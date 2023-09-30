import knex, { Knex } from 'knex'
import { env } from '../env'

export const knexConfig: Knex.Config = {
  client: env.DB_CLIENT,
  connection: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
}

export const knexClient = knex(knexConfig)
