import { FastifyInstance, RouteOptions } from 'fastify'

const routeOptions: RouteOptions[] = [
  {
    method: 'GET',
    url: '/',
    handler: async (request, reply) => {
      reply.send({ hello: 'world' })
    },
  },
]

export async function routes(fastify: FastifyInstance) {
  routeOptions.forEach((route) => {
    fastify.route(route)
  })
}

export default () => undefined
