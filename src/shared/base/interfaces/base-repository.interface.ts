import { DeleteResult, InsertResult } from 'kysely';

export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    insert(data: Partial<T>): Promise<T>;
    bulkInsert(data: Partial<T[]>): Promise<T[]>;
    upsert(data: Partial<T> |  Partial<T[]>): Promise<T | T[]>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string | Array<string>): Promise<DeleteResult>;
}
