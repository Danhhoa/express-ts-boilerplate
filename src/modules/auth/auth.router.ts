import { loginSchema } from '@/modules/auth/validations/auth.schema';
import { BaseRouter } from '@/shared/base/base.router';
import IRequest from '@/shared/interfaces/request.interface';
import { Response, Router } from 'express';
import authController from './auth.controller';

class AuthRouter extends BaseRouter {
    router: Router;
    constructor() {
        super();
        this.router = Router();

        this.router.get('/refresh-token', this.route(this.refreshToken));
        this.router.post('/login', this.route(this.login));
        this.router.post('/logout', this.route(this.logout));
    }

    async login(req: IRequest, res: Response) {
        const body = req.body;

        await loginSchema.validateAsync(body);

        const results = await authController.login(body);

        return this.onSuccess(res, results);
    }

    async logout(req: IRequest, res: Response) {
        const body = req.body;

        const results = await authController.logout({ refreshToken: body.refreshToken });

        return this.onSuccess(res, results);
    }

    async refreshToken(req: IRequest, res: Response) {
        const body = req.body;

        const results = await authController.refreshToken(body);

        return this.onSuccess(res, results);
    }
}

const authRouter = new AuthRouter().router;

export default authRouter;
