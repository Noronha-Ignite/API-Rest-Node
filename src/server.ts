import fastify from 'fastify'
import { routes } from './routes'

const PORT = Number(process.env.PORT) || 3333

const app = fastify()

app.register(routes)

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
