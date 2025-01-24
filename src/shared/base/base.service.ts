
import dbClient from '@/db/knex';
import { DB, db } from '@/db/kysely';
import { Knex } from 'knex/types';
import { sql } from 'kysely';
import { snakeToCamel } from '../utilities/converter';

interface IBaseOption<T> {
    fields: Array<keyof T>;
}

export class BaseService<T> {
    protected tableName: keyof DB;
    constructor(tableName: keyof DB) {
        this.tableName = tableName;
    }

    // protected get repository() {
    //     return dbClient<T>(this.tableName); // Creates a new query builder every time it's accessed
    // }

    // async findAndCount(
    // ): Promise<any> {
    //     const result = await this.repository.findAndCount({
    //         ...options,
    //         where,
    //     });

    //     return {
    //         count: result[1],
    //         rows: result[0],
    //     };
    // }

    protected getRepository(): Knex.QueryBuilder<T> {
        return dbClient<T>(this.tableName);
    }

    async findAll(options?: Partial<IBaseOption<T>>): Promise<T[]> {
        let fields: '*' | Array<keyof T> = '*';
        if (options?.fields) {
            fields = options.fields;
        }
        console.time('knexQuery');
        // const results = await this.getRepository().select(fields);
        const [results] = await dbClient.raw(`select id, first_name from user`);
        console.timeEnd('knexQuery');

        return snakeToCamel(results) as T[];
        return results;
    }

    async findById(id: string, options?: Partial<IBaseOption<T>>): Promise<T> {
        let fields: '*' | Array<keyof T> = '*';
        if (options?.fields) {
            fields = options.fields;
        }

        const results = await this.getRepository().select(fields).where('id', id);
        return snakeToCamel(results[0]) as T;
    }

    async findById2(id?: string): Promise<T> {
        console.time('kyselyQuery');
        // const result = await db.selectFrom(this.tableName).select('id').execute();
        const result = await sql`SELECT id, first_name from user`.execute(db);
        console.timeEnd('kyselyQuery');

        return result as T;
    }
}
