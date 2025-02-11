import userService from '@/modules/user/user.service';
import { MessageErrorCode } from '@/shared/enums';
import { HTTPError } from '@/shared/errors/http.error';
import IRequest from '@/shared/interfaces/request.interface';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseMiddleware } from './base';
import { verifyToken } from '../utilities/encryption.utility';

const HEADERS = 'authorization';
class AuthMiddleware extends BaseMiddleware {
    id;
    constructor() {
        super();
        this.id = Math.random();
    }

    async use(req: IRequest, res: Response, next: NextFunction, option?: any): Promise<void> {
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

            const tokenVerified = await verifyToken(bearerToken);

            req.tokenInfo = tokenVerified;

            let user = await userService.getUserByEmail(tokenVerified.email);

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
            next(error);
        }
    }
}

export const authMiddleware = new AuthMiddleware();
