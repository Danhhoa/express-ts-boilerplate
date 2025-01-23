import { DB, db } from '@/db/kysely';
import { DeleteResult } from 'kysely/dist/cjs';
import { IBaseRepository } from './interfaces/base-repository.interface';

interface IBaseOption<T> {
    fields: Array<keyof T>;
}

export class BaseRepository<T> implements IBaseRepository<T> {
    protected tableName: keyof DB;
    constructor(tableName: keyof DB) {
        this.tableName = tableName;
    }
    async findAll(options?: Partial<IBaseOption<T>>): Promise<T[]> {
        const qb = db.selectFrom(this.tableName).selectAll();

        const results = await qb.execute();

        return results as T[];
    }

    async findById(id: string): Promise<T> {
        const [results] = await db.selectFrom(this.tableName).selectAll().where('id', '=', id).execute();

        return results as T;
    }

    async insert(data: Partial<T>): Promise<T> {
        let newItemId = (data as any).id;
        const qb = db.insertInto(this.tableName).values(data);

        const insertResults = await qb.executeTakeFirst();

        if (insertResults.insertId) {
            newItemId = insertResults.insertId;
        }
        // insertResults.insertId just working for auto increment id
        return db.selectFrom(this.tableName).selectAll().where('id', '=', newItemId).executeTakeFirst() as T;
    }

    // TODO: handle if id is auto increment
    async bulkInsert(data: Partial<T[]>): Promise<T[]> {
        let newItemIds = data.map((item) => (item as any).id);
        const qb = db.insertInto(this.tableName).values(data);

        const insertResults = await qb.executeTakeFirst();

        const results = await db.selectFrom(this.tableName).selectAll().where('id', 'in', newItemIds).execute();

        return results as T[];
    }

    async upsert(data: Partial<T | T[]>): Promise<T | T[]> {
        const qb = db.insertInto(this.tableName).values(data);
        if (Array.isArray(data)) {
            qb.onConflict((oc) =>
                oc.column('id').doUpdateSet((eb) => {
                    const keys = Object.keys(data[0]) as (keyof T)[];
                    return Object.fromEntries(keys.map((key) => [key, eb.ref(key as any)]));
                }),
            );

            return qb.execute() as unknown as T[];
        }

        qb.onConflict((oc) =>
            oc.column('id').doUpdateSet((eb) => {
                const keys = Object.keys(data) as (keyof T)[];
                return Object.fromEntries(keys.map((key) => [key, eb.ref(key as any)]));
            }),
        );

        return qb.executeTakeFirst() as unknown as T;
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        await db.updateTable(this.tableName).set(data).where('id', '=', id).execute();

        return this.findById(id);
    }

    async delete(id: string | Array<string>): Promise<DeleteResult> {
        const results = await db.deleteFrom(this.tableName).where('id', 'in', id).executeTakeFirst();

        return results;
    }
}
