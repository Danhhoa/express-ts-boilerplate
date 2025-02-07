import { BaseRepository } from '@/shared/base/base.repository';
import { AuthToken } from './auth-token.model';
import { db } from '@/db/kysely';
import { sql } from 'kysely';
import { User } from '../user/user.model';

class AuthTokenRepository extends BaseRepository<AuthToken, 'authTokens'> {
    constructor() {
        super('authTokens');
    }

    public async findByRefeshToken(refreshToken: string): Promise<(AuthToken & { user: User }) | null> {
        const raw = sql<AuthToken & { user: User }>`
                    SELECT at.id, JSON_OBJECT(  'id', u.id, 
                                                'email', u.email, 
                                                'first_name', u.first_name, 
                                                'last_name', u.last_name
                                            ) as user
                    FROM auth_tokens as at
                    JOIN user as u ON u.id = at.user_id
                    WHERE at.refresh_token = ${refreshToken}
                    `;

        const { rows } = await raw.execute(db);

        return rows[0];
    }

    public async deleteRefreshToken(refreshToken: string) {
        const results = await db.deleteFrom(this.tableName).where('refreshToken', '=', refreshToken).executeTakeFirst();

        return results;
    }
}

export default new AuthTokenRepository();
