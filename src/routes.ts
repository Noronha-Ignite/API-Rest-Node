import { FastifyInstance, RouteOptions } from 'fastify'
import { knexClient } from './lib/knexClient'

const routeOptions: RouteOptions[] = [
  {
    method: 'GET',
    url: '/',
    handler: async (request, reply) => {
      const migrations = await knexClient.select('*').from('knex_migrations')

      return reply.send({ migrations })
    },
  },
]

export async function routes(fastify: FastifyInstance) {
  routeOptions.forEach((route) => {
    fastify.route(route)
  })
}
