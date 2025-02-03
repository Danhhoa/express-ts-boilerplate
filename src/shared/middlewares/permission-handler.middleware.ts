import { Response, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';

// Interfaces
import IRequest from '../interfaces/request.interface';
import { USER_ROLE } from '../enums/user.enum';
import { HTTPError } from '../errors/http.error';
import { BaseMiddleware } from './base';

// export const isAdmin = () => {
//   return async (req: IRequest, res: Response, next: NextFunction) => {
//     if (req.user.role !== 'ADMIN') {
//       return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
//     }
//     next();
//   };
// };

export class RoleMiddleware extends BaseMiddleware {
    private rolesPermitted: USER_ROLE[];
    constructor(requireRoles: USER_ROLE[]) {
        super();
        this.rolesPermitted = requireRoles;
    }

    use(req: IRequest, res: Response, next: NextFunction) {
        const user = req?.tokenInfo?.user;
        console.log('🚀 ~ RoleMiddleware ~ use ~ user:', user);

        const hasRole = () => {
            return this.rolesPermitted.includes(user.role);
        };

        if (!user || !user.role || !hasRole) {
            throw new HTTPError({ message: 'Permission Denied', code: httpStatusCodes.FORBIDDEN });
        }

        next();
    }
}
