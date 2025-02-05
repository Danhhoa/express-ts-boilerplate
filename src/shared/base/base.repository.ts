import { DB, db } from '@/db/kysely';
import dayjs from 'dayjs';
import { DeleteResult, sql } from 'kysely';
import { IBaseRepository, IFindAndCount, IFindOptions, SoftDeleteResult } from './interfaces/base-repository.interface';

export class BaseRepository<T> implements IBaseRepository<T> {
    protected tableName: keyof DB;
    constructor(tableName: keyof DB) {
        this.tableName = tableName;
    }
    // TODO: improve for M-N, M-M, N-M
    // TODO: improve for where clause?
    async findAll(options?: Partial<IFindOptions<T>>): Promise<T[]> {
        const selectFields = options?.fields?.length > 0 && !options?.fields?.includes('*');
        const isPagination = options?.limit && options?.offset >= 0;

        const qb = db
            .selectFrom(this.tableName)
            .selectAll()
            .$if(selectFields, (qb: any) => qb.clearSelect().select(options.fields))
            .where('deletedAt', 'is', null)
            .$if(options.withDeleted, (qb) => qb.clearWhere())
            .$if(isPagination, (qb) => qb.limit(options.limit).offset(options.offset));

        const results = await qb.execute();

        return results as T[];
    }

    async findAndCountAll(options?: Partial<IFindOptions<T>>): Promise<IFindAndCount<T>> {
        const selectFields = options?.fields?.length > 0 && !options?.fields?.includes('*');
        const isPagination = options?.limit && options?.offset >= 0;

        const qbCount = db
            .selectFrom(this.tableName)
            .select(db.fn.countAll().as('count'))
            .where('deletedAt', 'is', null)
            .$if(options.withDeleted, (qb) => qb.clearWhere());

        const qbRows = db
            .selectFrom(this.tableName)
            .selectAll()
            .$if(selectFields, (qb: any) => qb.clearSelect().select(options.fields))
            .where('deletedAt', 'is', null)
            .$if(options.withDeleted, (qb) => qb.clearWhere())
            .$if(isPagination, (qb) => qb.limit(options.limit).offset(options.offset));

        const [total, rows] = await Promise.all([qbCount.executeTakeFirst(), qbRows.execute()]);

        return { count: total.count, rows } as IFindAndCount<T>;
    }

    async findById(id: string): Promise<T> {
        const [results] = await db.selectFrom(this.tableName).selectAll().where('id', '=', id).execute();

        return results as T;
    }

    async insert(data: Partial<T>): Promise<T> {
        let newItemId = (data as any)?.id;
        const qb = db.insertInto(this.tableName).values(data);

        const insertResults = await qb.executeTakeFirst();
        console.log('🚀 ~ BaseRepository<T> ~ insert ~ insertResults:', insertResults);

        // [MYSQL] insertId will return if use auto increment ID
        if (insertResults.insertId) {
            newItemId = insertResults.insertId;
        }

        return db.selectFrom(this.tableName).selectAll().where('id', '=', newItemId).executeTakeFirst() as T;
    }

    async bulkInsert(data: Partial<T[]>): Promise<T[]> {
        let newItemIds = data.map((item) => (item as any).id);
        const qb = db.insertInto(this.tableName).values(data);

        const insertResults = await qb.executeTakeFirst();

        // [MYSQL] insertId will return if use auto increment ID
        if (insertResults.insertId) {
            const firstInsertId = Number(insertResults.insertId);
            newItemIds = data.map((_: Partial<T>, index: number) => firstInsertId + index);
        }

        const results = await db.selectFrom(this.tableName).selectAll().where('id', 'in', newItemIds).execute();

        return results as T[];
    }

    // REQUIRED: at least one field setted as unique
    async upsert(data: Partial<T>): Promise<T> {
        let newItemId = (data as any)?.id;

        const qb = db.insertInto(this.tableName).values(data).onDuplicateKeyUpdate(data);

        const upsertResults = await qb.executeTakeFirst();

        // [MYSQL] insertId will return if use auto increment ID
        // [MYSQL] insertId will undefinded if upsert but not change anything
        if (upsertResults.insertId) {
            newItemId = Number(upsertResults.insertId);
        }

        return db.selectFrom(this.tableName).selectAll().where('id', '=', newItemId).executeTakeFirst() as T;
    }

    // REQUIRED: at least one field setted as unique
    // NOTE: [MYSQL] upsert with increment id cause gap id
    // More information: https://stackoverflow.com/questions/3679611/mysql-upsert-and-auto-increment-causes-gaps
    async bulkUpsert(data: Partial<T[]>): Promise<T[]> {
        throw new Error('Not implement');
        let newItemIds = data.map((item) => (item as any)?.id);

        const qb = db
            .insertInto(this.tableName)
            .values(data)
            .onDuplicateKeyUpdate((eb) => {
                const keys = Object.keys(data[0]).filter((key) => key !== 'id');
                const tmp = Object.fromEntries(keys.map((key) => [key, sql`values(${eb.ref(key as any)})`]));
                console.log('🚀 ~ BaseRepository<T> ~ qb ~ tmp:', tmp);

                return tmp;
            });

        const upsertResults = await qb.execute();

        // [MYSQL] insertId will return if use auto increment ID
        // [MYSQL] insertId will undefinded if upsert but not change anything
        // if (upsertResults.insertId) {
        //     const firstInsertId = Number(upsertResults.insertId);
        //     newItemIds = data.map((_: Partial<T>, index: number) => firstInsertId + index);
        // }
        return db.selectFrom(this.tableName).selectAll().where('id', 'in', newItemIds).execute() as unknown as T[];
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        await db.updateTable(this.tableName).set(data).where('id', '=', id).execute();

        return this.findById(id);
    }

    async softDelete(id: string | Array<string>): Promise<SoftDeleteResult> {
        const results = await db
            .updateTable(this.tableName)
            .set('deletedAt', dayjs().toDate())
            .where('id', Array.isArray(id) ? 'in' : '=', id)
            .where('deletedAt', 'is', null)
            .executeTakeFirst();

        return { affected: Number(results.numChangedRows) };
    }

    async delete(id: string | Array<string>): Promise<DeleteResult> {
        const results = await db
            .deleteFrom(this.tableName)
            .where('id', Array.isArray(id) ? 'in' : '=', id)
            .executeTakeFirst();

        return results;
    }
}
