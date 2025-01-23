import { User } from '@/modules/user/user.entity';
import { BaseRepository } from '@/shared/base/base.repository';
import { DeleteResult } from 'kysely/dist/cjs';

interface IUserRepository {
    // getAllUsers(): Promise<User[]>;
    // createUser(data: Partial<User>): Promise<User>;
    // bulkCreateUser(data: Partial<User[]>): Promise<User[]>;
    // upsertUser(data: Partial<User>): Promise<User>;
    // bulkUpsertUser(data: Partial<User[]>): Promise<User[]>;
    // updateUser(data: Partial<User>): Promise<User>;
    // deleteUser(ids: string | string[]): Promise<DeleteResult>;
}

class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super('user');
    }
}

export default new UserRepository();
