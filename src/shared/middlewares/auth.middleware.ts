import { HTTPError } from '@/shared/errors/http.error';
import IRequest from '@/shared/interfaces/request.interface';
import Encryption from '@/shared/utilities/encryption.utility';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from './base';
import userService from '@/modules/user/user.service';
import { MessageErrorCode } from '../errors/enums';

// export const isAdmin = () => {
//     return async (req: IRequest, res: Response, next: NextFunction) => {
//         if (req.user.role !== 'ADMIN') {
//             return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
//         }
//         next();
//     };
// };

const HEADERS = 'authorization';
export class AuthMiddleware extends BaseMiddleware {
    async use(
        req: IRequest,
        res: Response,
        next: NextFunction,
        option?: any,
    ): Promise<void> {
        try {
            if (!req.headers[HEADERS]) {
                throw new HTTPError({
                    code: StatusCodes.UNAUTHORIZED,
                    message: 'UNAUTHORIZED',
                    messageCode: MessageErrorCode.UNAUTHORIZED,
                });
            }
            const bearerHeader = req.headers[HEADERS].toString();
            const bearerToken = bearerHeader.split(' ')[1];

            const tokenVerified =
                await Encryption.verifyToken(bearerToken);

            req.tokenInfo = tokenVerified;

            let user = await userService.repository.findOne({
                where: {
                    email: tokenVerified.email,
                },
            });

            if (!user) {
                throw new HTTPError({
                    code: StatusCodes.UNAUTHORIZED,
                    message: 'UNAUTHORIZE',
                    messageCode: MessageErrorCode.UNAUTHORIZED,
                });
            }

            req.tokenInfo.exp = tokenVerified.exp;
            req.tokenInfo.role = tokenVerified.role;
            req.tokenInfo.user = user;

            next();
        } catch (error: any) {
            throw error;
        }
    }
}
