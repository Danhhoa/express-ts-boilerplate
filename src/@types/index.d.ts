import { User } from '@/modules/user/user.entity';
import { Knex } from 'knex/types';

declare module 'knex/types/tables' {
    interface Tables {
        user: User;
        book: any;
    }
}
