import { randomUUID } from 'crypto'
import { FastifyInstance, RouteOptions } from 'fastify'
import { knexClient } from './lib/knexClient'

const routeOptions: RouteOptions[] = [
  {
    method: 'GET',
    url: '/',
    handler: async (request, reply) => {
      const [transactionId] = await knexClient('transactions').insert({
        id: randomUUID(),
        title: 'Transação de teste',
        amount: 1500,
      })

      const transaction = await knexClient('transactions')
        .select('*')
        .where({
          id: transactionId,
        })
        .first()

      return reply.send({ transaction })
    },
  },
]

export async function routes(fastify: FastifyInstance) {
  routeOptions.forEach((route) => {
    fastify.route(route)
  })
}
