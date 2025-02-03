import envConfig from '@/configs/env.config';
import { HTTPError } from '@/shared/errors/http.error';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { MessageErrorCode } from '../enums';

interface IJwtDecoded {
    id: string;
    email: string;
    role: any;
    iat: number;
    exp: number;
}

const generateHash = (password: string, saltRounds: number = 10): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
            if (!err) {
                resolve(hash);
            }
            reject(err);
        });
    });
};

const verifyHash = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

const generateToken = (key: string, value: string) => {};

const verifyToken = (token: string) => {
    const secret = envConfig.app.tokenSecret;

    try {
        const tokenVerified = jwt.verify(token, secret, {
            ignoreExpiration: true,
        }) as IJwtDecoded;

        const now = new Date();
        const tokenExpireTime = new Date(tokenVerified.exp * 1000);

        if (tokenExpireTime <= now) {
            throw new HTTPError({
                message: 'Token expired',
                code: StatusCodes.FORBIDDEN,
                messageCode: MessageErrorCode.TOKEN_EXPIRED,
            });
        }

        return tokenVerified;
    } catch (error) {
        if (error instanceof HTTPError) {
            throw new HTTPError({
                code: StatusCodes.FORBIDDEN,
                message: 'Token expired',
                messageCode: MessageErrorCode.TOKEN_EXPIRED,
            });
        }

        throw new HTTPError({
            code: StatusCodes.UNAUTHORIZED,
            message: 'Invalid token',
            messageCode: MessageErrorCode.UNAUTHORIZED,
        });
    }
};

export { generateHash, generateToken, verifyHash, verifyToken };
