import { BaseController } from '@/shared/base/base.controller';
import authService from './auth.service';
import { IAuthLogin } from './interfaces/auth.interface';

class AuthController extends BaseController<typeof authService> {
    constructor() {
        super(authService);
    }
    async login(data: IAuthLogin) {
        return this.service.login(data);
    }
}

export default new AuthController();
