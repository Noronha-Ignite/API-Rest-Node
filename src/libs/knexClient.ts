import knex, { Knex } from 'knex'
import { env } from '../env'

let entensions: Knex.Config = {}

if (env.NODE_ENV === 'test') {
  entensions = {
    connection: {
      filename: env.DB_URL ?? '',
    },
    useNullAsDefault: true,
  }
} else {
  entensions = {
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
  }
}

export const knexConfig: Knex.Config = {
  client: env.DB_CLIENT,
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
    extension: 'ts',
  },
  ...entensions,
}

export const knexClient = knex(knexConfig)
