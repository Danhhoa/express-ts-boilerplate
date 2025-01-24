import { DB, db } from '@/db/kysely';
import { DeleteResult } from 'kysely';
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

    // TODO: implement upsert
    async upsert<D extends Partial<T> | Array<Partial<T>>>(data: D): Promise<D extends  Array<Partial<T>> ? T[] : T | null> {
        throw new Error("Method not implement")
        // console.log("🚀 ~ BaseRepository<T> ~ upsert ~ data:", data)
        // if (Array.isArray(data)) {
           

        //     const qb =  db.insertInto(this.tableName).values(data).onDuplicateKeyUpdate((eb) => {
        //         const keys = Object.keys(data[0]).filter(key => key !== 'id');
        //         const tmp =  Object.fromEntries(keys.map((key) => [key,  sql`values(${eb.ref(key as any)})`,]));
        //         console.log("🚀 ~ BaseRepository<T> ~ qb ~ tmp:", tmp)

        //         return tmp
        //     })


        //     const result = await qb.execute();
        //     console.log(result);
            
        // }

        // return null

        // const qb = db.insertInto(this.tableName).values(data).onDuplicateKeyUpdate(data)


        // return qb.executeTakeFirst() as unknown as T;

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
