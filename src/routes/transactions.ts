import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knexClient } from '../lib/knexClient'

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.post('/', async (req, res) => {
    const transactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = transactionBodySchema.parse(req.body)

    await knexClient('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : -amount,
    })

    return res.status(201).send()
  })
}
