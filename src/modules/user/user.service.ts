import { v4 as uuidV4 } from 'uuid';
import { User } from './user.model';
import userRepository from './user.repository';

class UserService {
    async getAllUsers(filters: unknown) {
        const users = await userRepository.findAndCountAll(filters);

        return users;
    }

    async getUserByEmail(email: string) {
        const user = await userRepository.findByEmail(email);

        return user;
    }

    async createUser(data: Partial<User>) {
        const id = uuidV4();
        return await userRepository.insert({ id, ...data });
    }

    async upsertUser(data: Partial<User>) {
        const id = uuidV4();
        return await userRepository.upsert({ id, ...data });
    }

    async bulkCreateUser(data: Partial<User[]>) {
        const payload = data.map((user) => ({ id: uuidV4(), ...user }));
        const users = await userRepository.bulkInsert(data);

        return users;
    }

    async updateUser(id: string, data: Partial<User>) {
        const userUpdated = await userRepository.update(id, data);

        return userUpdated;
    }

    async deleteUser(id: string) {
        return userRepository.softDelete(id);
    }
}

const userService = new UserService();

export default userService;
