import { USER_ROLE } from '../enums';
import { authMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';
import { BaseRouter } from './base.router';

export class CrudRouter<T> extends BaseRouter {
    protected controller: T;
    constructor(controller: T) {
        super();
        this.controller = controller;
    }

    public ensureAuth() {
        return authMiddleware.run();
    }

    public allowRoles(roles: USER_ROLE[]) {
        return new RoleMiddleware(roles).run();
    }
}
