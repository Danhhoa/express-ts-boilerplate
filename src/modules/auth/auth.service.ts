import { MessageErrorCode } from '@/shared/enums';
import { HTTPError } from '@/shared/errors/http.error';
import dayjs from 'dayjs';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../shared/utilities/encryption.utility';
import userRepository from '../user/user.repository';
import authTokenRepository from './auth-token.repository';
import { IAuthLogin, IAuthLogout, IRefreshToken } from './interfaces/auth.interface';

class AuthService {
    async login(payload: IAuthLogin) {
        const { email, password } = payload;

        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new HTTPError({
                code: StatusCodes.UNAUTHORIZED,
                message: 'User not found',
                messageCode: MessageErrorCode.USER_NOT_FOUND,
            });
        }
        // const checkPassword = await verifyHash(password, user.password);
        // if (!checkPassword) {
        //     throw new HTTPError({
        //         code: StatusCodes.UNAUTHORIZED,
        //         message: 'Incorrect password. Please try again.',
        //         messageCode: MessageErrorCode.WRONG_PASSWORD,
        //     });
        // }
        user.password = undefined;
        const tokenPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        const token = await generateAccessToken(tokenPayload);
        const refreshToken = await generateRefreshToken(tokenPayload);

        // Store refresh token
        await authTokenRepository.insert({ userId: user.id, refreshToken });

        return { user, token, refreshToken };
    }

    async logout(payload: IAuthLogout) {
        // Del token in DB,...
        await authTokenRepository.deleteRefreshToken(payload.refreshToken);

        return {
            success: true,
        };
    }

    async refreshToken(payload: IRefreshToken) {
        // create new accessToken & rotate refreshToken
        const existedToken = await authTokenRepository.findByRefeshToken(payload.refreshToken);

        if (!existedToken) {
            throw new HTTPError({
                code: StatusCodes.UNAUTHORIZED,
                message: 'Invalid token',
                messageCode: MessageErrorCode.INVALID_TOKEN,
            });
        }

        const tokenInfo = verifyToken(payload.refreshToken);
        const newTokenPayload = existedToken.user;

        // Re-assign last exp
        const expTime = dayjs(tokenInfo.exp * 1000);

        const accessToken = await generateAccessToken(newTokenPayload);
        const refreshToken = await generateRefreshToken(newTokenPayload, { exp: expTime });

        // Rotate RF
        await authTokenRepository.update(existedToken.id, { refreshToken });

        return {
            accessToken,
            refreshToken,
        };
    }
}

const authService = new AuthService();

export default authService;
