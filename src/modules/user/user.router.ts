import { loginSchema } from '@/modules/auth/validations/auth.schema';
import { Request, Response, Router } from 'express';
import { BaseRouter } from '@/shared/base/base.router';
import userController from './user.controller';

class UserRouter extends BaseRouter {
    router: Router;
    constructor() {
        super();
        this.router = Router();
        this.router.get('/', this.route(this.allUsers));
        this.router.post('/', this.route(this.createUser));
        this.router.post('/bulk-create', this.route(this.bulkCreateUser));
        this.router.post('/upsert', this.route(this.upsertUser));
        this.router.post('/login', this.route(this.login));
    }

    async login(req: Request, res: Response) {
        const body = req.body;

        await loginSchema.validateAsync(body);

        return this.onSuccess(res, true);
    }

    async allUsers(req: Request, res: Response) {
        const { page, limit } = req.query;

        const result = await userController.getAllUsers();

        return this.onSuccessAsList(res, result, {
            offset: page,
            limit,
        } as any);
    }

    async createUser(req: Request, res: Response) {
        const data = req.body;
        const result = await userController.createUser(data);

        return this.onSuccess(res, result);
    }

    async bulkCreateUser(req: Request, res: Response) {
        const data = req.body;
        const result = await userController.bulkCreateUser(data);

        return this.onSuccess(res, result);
    }

    async upsertUser(req: Request, res: Response) {
        const data = req.body;
        const result = await userController.upsertUser(data);

        return this.onSuccess(res, result);
    }
}

const userRouter = new UserRouter().router;

export default userRouter;
