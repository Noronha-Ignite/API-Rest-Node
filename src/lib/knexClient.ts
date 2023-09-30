import knex, { Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'docker',
    database: process.env.DB_NAME || 'api-rest-node-db',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
}

export const knexClient = knex(knexConfig)
