import { CrudRouter } from '@/shared/base/crud.router';
import { USER_ROLE } from '@/shared/enums';
import { IPaginationReq } from '@/shared/interfaces/common.interface';
import IRequest from '@/shared/interfaces/request.interface';
import { queryMiddleware } from '@/shared/middlewares/crud.middleware';
import { Response, Router } from 'express';
import { getListUserSchema } from './schema/user.schema';
import userController from './user.controller';
import { User } from './user.model';
import userService from './user.service';

class UserRouter extends CrudRouter<typeof userController> {
    router: Router;
    constructor() {
        super(userController);
        this.router = Router();
        this.router.get(
            '/',
            this.ensureAuth(),
            this.allowRoles([USER_ROLE.ADMIN]),
            queryMiddleware.run(),
            this.route(this.allUsers),
        );
        this.router.post('/', this.route(this.createUser));
        this.router.post('/upsert', this.route(this.upsertUser));
        this.router.post('/bulk-create', this.route(this.bulkCreateUser));
        this.router.post('/seed', this.route(this.seed));
        this.router.put('/:id', this.route(this.updateUser));
        this.router.delete('/:id', this.route(this.deleteUser));
    }

    async allUsers(req: IRequest, res: Response) {
        const { page, limit } = req.query;

        await getListUserSchema.validateAsync(req.query);

        const result = await this.controller.getAllUsers(req.query);

        return this.onSuccessAsList(res, result, {
            offset: page,
            limit,
        } as unknown as IPaginationReq);
    }

    async getUserByEmail(req: IRequest, res: Response) {
        const result = await this.controller.getUserByEmail(req.body.email);

        return this.onSuccess(res, result);
    }

    async createUser(req: IRequest, res: Response) {
        const data = req.body;
        const result = await this.controller.createUser(data);

        return this.onSuccess(res, result);
    }

    async upsertUser(req: IRequest, res: Response) {
        const data = req.body;
        const result = await this.controller.upsertUser(data);

        return this.onSuccess(res, result);
    }

    async bulkCreateUser(req: IRequest, res: Response) {
        const data = req.body;
        const result = await this.controller.bulkCreateUser(data);

        return this.onSuccess(res, result);
    }

    async updateUser(req: IRequest, res: Response) {
        const data = req.body;
        const { id } = req.params;
        const result = await this.controller.updateUser(id, data);

        return this.onSuccess(res, result);
    }

    async deleteUser(req: IRequest, res: Response) {
        const { id } = req.params;
        const result = await this.controller.deleteUser(id);

        return this.onSuccess(res, result);
    }

    async seed(req: IRequest, res: Response) {
        let count = 1;
        const arrUsers: User[] = [];
        for (let i = 1; i <= 10000; i++) {
            const payload = {
                email: `thanhdanh${count}@gmail.com`,
                firstName: `Danh_${count}`,
                lastName: 'Hoa',
                role: 'ADMIN',
                password: '123456',
            };

            arrUsers.push(payload as User);
            count++;
        }

        await userService.bulkCreateUser(arrUsers);

        return res.send({ success: true });
    }
}

const userRouter = new UserRouter().router;

export default userRouter;
