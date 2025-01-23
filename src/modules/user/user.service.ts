import { User } from './user.entity';
import userRepository from './user.repository';
import { v4 as uuidV4 } from 'uuid';

class UserService {
    async getAllUsers() {
        const users = await userRepository.findAll();

        return users;
    }

    async createUser(data: Partial<User>) {
        const id = uuidV4();
        return await userRepository.insert({ id, ...data });
    }

    async bulkCreateUser(data: Partial<User[]>) {
        const payload = data.map((user) => ({ id: uuidV4(), ...user }));
        const users = await userRepository.bulkInsert(payload);

        return users;
    }

    async upsertUser(data: Partial<User>) {
        const user = await userRepository.upsert(data);

        return user;
    }

    async update(id: string, data: Partial<User>) {
        const userUpdated = await userRepository.update(id, data);

        return userUpdated;
    }

    async deleteUser(id: string) {
        return userRepository.delete(id);
    }
}

const userService = new UserService();

export default userService;
