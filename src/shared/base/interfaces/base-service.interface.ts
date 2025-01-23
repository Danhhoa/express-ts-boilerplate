import { IFindAndCountResponse } from '@/shared/interfaces/typeorm.interface';
import {
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    InsertResult,
    UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseService<Entity> {
    withTnx(
        runInTransaction: (
            entityManager: EntityManager,
        ) => Promise<unknown>,
    ): Promise<any>;

    insert(
        entity:
            | QueryDeepPartialEntity<Entity>
            | QueryDeepPartialEntity<Entity>[],
    ): Promise<InsertResult>;

    insertWithTnx(
        entityManager: EntityManager,
        entity:
            | QueryDeepPartialEntity<Entity>
            | QueryDeepPartialEntity<Entity>[],
    ): Promise<InsertResult>;

    save(data: DeepPartial<Entity>): Promise<Entity>;

    saveWithTnx(
        entityManager: EntityManager,
        entity: DeepPartial<Entity>,
    ): Promise<DeepPartial<Entity>>;

    findAndCount(
        where: FindOptionsWhere<Entity>,
        options?: FindManyOptions<Entity>,
    ): Promise<IFindAndCountResponse<Entity>>;

    findById(
        id: string,
        options?: FindOneOptions<Entity>,
    ): Promise<Entity>;

    findByIds(
        ids: string[],
        options?: FindOneOptions<Entity>,
    ): Promise<Entity[]>;

    bulkSave(data: DeepPartial<Entity[]>): Promise<Entity[]>;

    update(
        where: FindOptionsWhere<Entity>,
        update: QueryDeepPartialEntity<Entity>,
    ): Promise<UpdateResult>;

    updateWithTnx(
        entityManager: EntityManager,
        where: FindOptionsWhere<Entity>,
        update: QueryDeepPartialEntity<Entity>,
    ): Promise<UpdateResult>;

    delete(where: FindOptionsWhere<Entity>): Promise<DeleteResult>;
}
