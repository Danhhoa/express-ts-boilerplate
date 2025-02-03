import { BaseController } from '@/shared/base/base.controller';
import userService from './user.service';
import { User } from './user.model';

class UserController extends BaseController<typeof userService> {
    constructor() {
        super(userService);
    }
    async getAllUsers(filters: any) {
        return this.service.getAllUsers(filters);
    }

    async getUserByEmail(email: string) {
        return this.service.getUserByEmail(email);
    }

    async createUser(data: Partial<User>) {
        return this.service.createUser(data);
    }

    async bulkCreateUser(data: Partial<User[]>) {
        return this.service.bulkCreateUser(data);
    }

    async updateUser(id: string, data: Partial<User>) {
        return this.service.updateUser(id, data);
    }

    async deleteUser(id: string) {
        return this.service.deleteUser(id);
    }
}

export default new UserController();
