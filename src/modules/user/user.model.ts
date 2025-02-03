import { BaseModel } from '@/shared/base/base.model';
import { USER_ROLE } from '@/shared/enums/user.enum';
import { v4 } from 'uuid';

export class User extends BaseModel {
    id: string;

    email: string;

    password: string;

    firstName: string;

    lastName: string;

    role: USER_ROLE;

    constructor(
        id: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        role: USER_ROLE,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
    ) {
        super(); // Call the constructor of the BaseModel if it has one
        this.id = id;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static sampleUser() {
        const user = new User(
            v4(),
            'sample@gmail.com',
            '123456',
            'A',
            'David',
            USER_ROLE.USER,
            new Date(),
            new Date(),
            null,
        );

        return user;
    }
}
