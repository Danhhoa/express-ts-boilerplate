import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await sql`CREATE TABLE users (
				created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				deleted_at datetime(6) DEFAULT NULL,
				id varchar(36) NOT NULL,
				email varchar(255) NOT NULL,
				password varchar(255) NOT NULL,
				first_name varchar(255) DEFAULT NULL,
				last_name varchar(255) DEFAULT NULL,
				role varchar(255) DEFAULT NULL,
				PRIMARY KEY (id),
				UNIQUE KEY email_UNIQUE (email)
			)`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await sql`DROP TABLE users`.execute(db);
}
