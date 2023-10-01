import { execSync } from 'node:child_process'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import request from 'supertest'
import {
  it,
  beforeAll,
  afterAll,
  describe,
  expect,
  beforeEach,
  afterEach,
} from 'vitest'

import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await rm(path.resolve(__dirname, '..', 'tmp', 'test.sqlite'))
  })

  beforeEach(() => {
    execSync('npm run migrate:latest')
  })

  afterEach(() => {
    execSync('npm run migrate:rollback -- --all')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const transaction = {
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    }

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(transaction)

    const setSessionCookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', setSessionCookie)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const transaction = {
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    }

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send(transaction)

    const setSessionCookie = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', setSessionCookie)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', setSessionCookie)
      .expect(200)

    expect(getTransactionResponse.body).toEqual({
      transaction: expect.objectContaining({
        title: transaction.title,
        amount: transaction.amount,
      }),
    })
  })

  it('should be able to get the summary of transactions', async () => {
    const transaction1 = {
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    }

    const transaction2 = {
      title: 'New Transaction 2',
      amount: 2000,
      type: 'debit',
    }

    const createTransaction1Response = await request(app.server)
      .post('/transactions')
      .send(transaction1)

    const setSessionCookie = createTransaction1Response.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', setSessionCookie)
      .send(transaction2)

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', setSessionCookie)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: transaction1.amount - transaction2.amount,
    })
  })
})
