import { snakeCase } from 'lodash';
import { config } from 'dotenv';
import knex from 'knex';

config();

const dbClient = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        pool: {
            idleTimeoutMillis: 30000,
            max: 10,
        },
    },
    log: {
        debug(message) {
            console.log({ debug: message });
        },
        error(message) {
            console.log(message);
        },
    },
    compileSqlOnError: false,
    debug: true,
    wrapIdentifier(value, origImpl, queryContext) {
        if (typeof value === 'string' && value !== '*') {
            console.log('🚀 ~ wrapIdentifier ~ value:', value);
            // Convert camelCase to snake_case
            return origImpl(snakeCase(value));
        }
        return origImpl(value);
    },
});

export default dbClient;
