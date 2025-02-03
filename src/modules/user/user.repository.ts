import { db } from '@/db/kysely';
import { User } from '@/modules/user/user.model';
import { BaseRepository } from '@/shared/base/base.repository';
import { sql } from 'kysely';

class UserRepository extends BaseRepository<User> {
    constructor() {
        super('user');
    }

    async findByEmail(email: string): Promise<User | null> {
        let rawSql = sql<User>`SELECT * FROM user WHERE email = ${email}`;

        const { rows } = await rawSql.execute(db);

        return rows[0];
    }

    async findUsers(filters: Partial<User>) {
        let raw = `SELECT * FROM user as u WHERE 1=1 `;

        if (filters.email) {
            raw += `AND u.email LIKE ${filters.email}`;
        }

        const results = await sql`${raw}`.execute(db);

        return results;
    }
}

export default new UserRepository();
