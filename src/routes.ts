import { FastifyInstance, RouteOptions } from 'fastify'
import { knexClient } from './database'

const routeOptions: RouteOptions[] = [
  {
    method: 'GET',
    url: '/',
    handler: async (request, reply) => {
      const tables = await knexClient('sqlite_schema').select('*')

      return reply.send({ tables })
    },
  },
]

export async function routes(fastify: FastifyInstance) {
  routeOptions.forEach((route) => {
    fastify.route(route)
  })
}
