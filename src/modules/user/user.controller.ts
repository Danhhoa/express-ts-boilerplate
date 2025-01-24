import { BaseController } from '@/shared/base/base.controller';
import userService from './user.service';
import { User } from './user.entity';

class UserController extends BaseController<typeof userService> {
    constructor() {
        super(userService);
    }
    async getAllUsers() {
        return this.service.getAllUsers();
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
}

export default new UserController();
