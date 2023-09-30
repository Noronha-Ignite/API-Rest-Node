import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knexClient } from '../lib/knexClient'

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.get('/', async (_, reply) => {
    const transactions = await knexClient('transactions').select()

    return reply.send({ transactions })
  })

  app.get('/:id', async (req, reply) => {
    const transactionDetailParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = transactionDetailParamsSchema.parse(req.params)

    const transaction = await knexClient('transactions')
      .select('*')
      .where({
        id,
      })
      .first()

    if (!transaction) {
      return reply.status(404).send({ message: 'Transaction not found' })
    }

    return reply.send({ transaction })
  })

  app.get('/summary', async (_, reply) => {
    const summary = await knexClient('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return reply.send({ summary })
  })

  app.post('/', async (req, reply) => {
    const transactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = transactionBodySchema.parse(req.body)

    await knexClient('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}
