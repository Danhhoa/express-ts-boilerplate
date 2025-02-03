import { User } from '@/modules/user/user.model';
import { Request } from 'express';

export default interface IRequest extends Request {
    tokenInfo?: {
        role: string;
        exp: number;
        user?: User;
        [x: string]: any;
    };
    pagination?: {
        page: number;
        limit: number;
        offset: number;
    };
}
