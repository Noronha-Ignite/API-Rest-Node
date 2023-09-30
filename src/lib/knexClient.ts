import 'dotenv/config'

import knex, { Knex } from 'knex'

export const knexConfig: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
}

export const knexClient = knex(knexConfig)
