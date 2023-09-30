import fastify from 'fastify'
import { env } from './env'
import { routes } from './routes'

const PORT = env.PORT

const app = fastify()

app.register(routes)

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
