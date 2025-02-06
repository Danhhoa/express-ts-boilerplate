import { db } from '@/db/kysely';
import { User } from '@/modules/user/user.model';
import { BaseRepository } from '@/shared/base/base.repository';
import { IFindAndCount, IFindOptions } from '@/shared/base/interfaces';
import { sql } from 'kysely';

class UserRepository extends BaseRepository<User> {
    constructor() {
        super('user');
    }

    async findAndCountAll(options?: Partial<IFindOptions<User>>): Promise<IFindAndCount<User>> {
        const selectFields = options?.fields?.length > 0 && !options?.fields?.includes('*');
        const isPagination = options?.limit && options?.offset >= 0;

        const qbCount = db
            .selectFrom(this.tableName)
            .select(db.fn.countAll().as('count'))
            .where('deletedAt', 'is', null)
            .$if(options.withDeleted, (qb) => qb.clearWhere());

        const qbRows = db
            .selectFrom(this.tableName)
            .select(User.getPublicFields())
            .$if(selectFields, (qb: any) => qb.clearSelect().select(options.fields))
            .where('deletedAt', 'is', null)
            .$if(options.withDeleted, (qb) => qb.clearWhere())
            .$if(isPagination, (qb) => qb.limit(options.limit).offset(options.offset));

        const [total, rows] = await Promise.all([qbCount.executeTakeFirst(), qbRows.execute()]);

        return { count: total.count, rows } as IFindAndCount<User>;
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
