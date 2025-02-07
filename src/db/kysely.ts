import { AuthToken } from '@/modules/auth/auth-token.model';
import { User } from '@/modules/user/user.model';
import { config } from 'dotenv';
import { CamelCasePlugin, Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';

config();

export interface DB {
    user: User;
    authTokens: AuthToken;
}

const dialect = new MysqlDialect({
    pool: createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
    }),
});

export const db = new Kysely<DB>({
    dialect,
    log: ['error'],
    plugins: [new CamelCasePlugin()],
});
