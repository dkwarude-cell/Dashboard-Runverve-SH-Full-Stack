import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Knex Configuration
 * Used by: knex migrate, knex seed, knex raw
 */
export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres123',
      database: process.env.DB_NAME || 'smartheal_db',
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      extension: 'js',
    },
    pool: { min: 2, max: 10 },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: 'require',
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      extension: 'js',
    },
    pool: { min: 5, max: 20 },
  },
  test: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres123',
      database: `${process.env.DB_NAME || 'smartheal_db'}_test`,
    },
    migrations: {
      directory: path.join(__dirname, 'src/migrations'),
      extension: 'js',
    },
  },
};
