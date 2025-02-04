import { HTTPError } from '@/shared/errors/http.error';
import userRepository from '../user/user.repository';
import { IAuthLogin } from './interfaces/auth.interface';
import { MessageErrorCode } from '@/shared/enums';
import { StatusCodes } from 'http-status-codes';
import { generateAccessToken, generateRefreshToken, verifyHash } from '../../shared/utilities/encryption.utility';

class AuthService {
    async login(data: IAuthLogin) {
        const { email, password } = data;

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
        return { user, token, refreshToken };
    }
}

const authService = new AuthService();

export default authService;
