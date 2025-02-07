import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    // up migration code goes here...
    // note: up migrations are mandatory. you must implement this function.
    // For more info, see: https://kysely.dev/docs/migrations
    await sql`CREATE TABLE auth_tokens (
				created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				deleted_at datetime(6) DEFAULT NULL,
				id int NOT NULL AUTO_INCREMENT,
				user_id varchar(36),
				refresh_token text DEFAULT NULL,
				PRIMARY KEY (id)
			)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    // down migration code goes here...
    // note: down migrations are optional. you can safely delete this function.
    // For more info, see: https://kysely.dev/docs/migrations
    await sql`DROP table auth_tokens`.execute(db);
}
