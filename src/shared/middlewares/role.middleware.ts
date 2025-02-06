import { Response, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';

// Interfaces
import IRequest from '../interfaces/request.interface';
import { USER_ROLE } from '../enums/user.enum';
import { HTTPError } from '../errors/http.error';
import { BaseMiddleware } from './base';
import { MessageErrorCode } from '../enums';

export class RoleMiddleware extends BaseMiddleware {
    private allowRoles: USER_ROLE[];
    constructor(requireRoles: USER_ROLE[]) {
        super();
        this.allowRoles = requireRoles;
    }

    use(req: IRequest, res: Response, next: NextFunction) {
        const user = req?.tokenInfo?.user;

        const hasRole = this.allowRoles.includes(user.role);

        if (!user || !user.role || !hasRole) {
            throw new HTTPError({
                message: 'Permission Denied',
                code: httpStatusCodes.FORBIDDEN,
                messageCode: MessageErrorCode.PERMISSION_DENIED,
            });
        }

        next();
    }
}
