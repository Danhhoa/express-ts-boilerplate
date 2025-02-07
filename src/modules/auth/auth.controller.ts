import { BaseController } from '@/shared/base/base.controller';
import authService from './auth.service';
import { IAuthLogin, IAuthLogout, IRefreshToken } from './interfaces/auth.interface';

class AuthController extends BaseController<typeof authService> {
    constructor() {
        super(authService);
    }
    async login(payload: IAuthLogin) {
        return this.service.login(payload);
    }

    async logout(payload: IAuthLogout) {
        return this.service.logout(payload);
    }

    async refreshToken(payload: IRefreshToken) {
        return this.service.refreshToken(payload);
    }
}

export default new AuthController();
