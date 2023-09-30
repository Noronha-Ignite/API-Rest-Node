import { knex } from 'knex'

export const knexClient = knex({
  client: 'sqlite',
  connection: {
    filename: './tmp/app.sqlite',
  },
})
