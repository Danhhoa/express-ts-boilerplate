import { DeleteResult } from 'kysely';

export interface SoftDeleteResult {
    affected: number;
}

export interface IFindAndCount<T> {
    count: number;
    rows: T[];
}

export interface IFindOptions<T> {
    fields: Array<keyof T | '*'>;
    limit: number;
    offset: number;
    withDeleted: boolean;
}

export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findAndCountAll(options?: IFindOptions<T>): Promise<IFindAndCount<T>>;
    findById(id: string): Promise<T>;
    insert(data: Partial<T>): Promise<T>;
    bulkInsert(data: Partial<T[]>): Promise<T[]>;
    upsert(data: Partial<T> | Partial<T[]>): Promise<T | T[]>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string | Array<string>): Promise<DeleteResult>;
    softDelete(id: string | Array<string>): Promise<SoftDeleteResult>;
}
