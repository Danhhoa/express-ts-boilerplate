import { BaseEntity } from '@/shared/base/base.entity';
import { USER_ROLE } from '@/shared/enums/user.enum';

export class User extends BaseEntity {
    id: string;

    email: string;

    password: string;

    firstName: string;

    lastName: string;

    role: USER_ROLE;
}
