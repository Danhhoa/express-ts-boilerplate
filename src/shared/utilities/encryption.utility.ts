import envConfig from '@/shared/configs/env.config';
import { HTTPError } from '@/shared/errors/http.error';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { MessageErrorCode, USER_ROLE } from '../enums';
import dayjs, { Dayjs } from 'dayjs';

interface IJwtDecoded {
    id: string;
    email: string;
    role: any;
    iat: number;
    exp: number;
}

enum TOKEN_TYPE {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}

interface IGenerateTokenOption {
    exp?: Dayjs;
    secret?: string;
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

const generateAccessToken = async (
    payload: object,
    option: IGenerateTokenOption = {
        exp: dayjs().add(30, 'minutes'),
    },
) => {
    const secret = option.secret || envConfig.app.tokenSecret;
    return jwt.sign({ ...payload, type: 'ACCESS_TOKEN' }, secret, {
        expiresIn: Math.floor(option.exp.diff(dayjs(), 'seconds')),
    });
};

const generateRefreshToken = async (
    payload: Object,
    option: IGenerateTokenOption = {
        exp: dayjs().add(1, 'week'),
    },
) => {
    const secret = option.secret || envConfig.app.tokenSecret;

    return jwt.sign({ ...payload, type: 'REFRESH_TOKEN' }, secret, {
        expiresIn: Math.floor(option.exp.diff(dayjs(), 'seconds')),
    });
};
export { generateHash, generateAccessToken, verifyHash, verifyToken, generateRefreshToken };
