import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Database connection configuration
 */
const config = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: path.join(__dirname, '../../smartheal.db'),
    },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
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
      directory: path.join(__dirname, '../migrations'),
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
      directory: path.join(__dirname, '../migrations'),
      extension: 'js',
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

export const db = knex(dbConfig);

/**
 * Initialize database connection
 */
export const initializeDatabase = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('✓ Database connected successfully');
    return db;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Close database connection
 */
export const closeDatabase = async () => {
  try {
    await db.destroy();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error closing database:', error.message);
  }
};

export default {
  db,
  initializeDatabase,
  closeDatabase,
};
