import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knexClient } from '../libs/knexClient'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { deepObjectMap } from '../utils/object'

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.addHook('onSend', (_, __, payload, done) => {
    if (!payload) done()

    const parsedPayload = deepObjectMap(
      JSON.parse(String(payload)),
      (value) => {
        if (!isNaN(Number(value))) {
          return Number(value)
        }

        return value
      },
    )

    return done(null, JSON.stringify(parsedPayload))
  })

  app.get('/', { preHandler: [checkSessionIdExists] }, async (req, reply) => {
    const { sessionId } = req.cookies

    const transactions = await knexClient('transactions')
      .where({
        session_id: sessionId,
      })
      .select()

    return reply.send({ transactions })
  })

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const transactionDetailParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = transactionDetailParamsSchema.parse(req.params)

      const transaction = await knexClient('transactions')
        .select('*')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' })
      }

      return reply.send({ transaction })
    },
  )

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const summary = await knexClient('transactions')
        .where({
          session_id: sessionId,
        })
        .sum('amount', { as: 'amount' })
        .first()

      return reply.send({ summary })
    },
  )

  app.post('/', async (req, reply) => {
    const transactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = transactionBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knexClient('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
