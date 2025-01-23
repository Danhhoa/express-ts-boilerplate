import { BaseEntity } from '@/shared/base/base.entity';

export class User extends BaseEntity {
    id: string;

    email: string;

    password: string;

    firstName: string;

    lastName: string;

    role: string;
}
