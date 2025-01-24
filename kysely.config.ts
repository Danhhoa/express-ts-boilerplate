import { config } from 'dotenv';
import { defineConfig } from 'kysely-ctl';
import { db } from './src/db/kysely';

config();

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: './src/db/migrations',
    allowJS: true,
  },
});
