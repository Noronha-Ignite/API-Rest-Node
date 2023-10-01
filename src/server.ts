import { app } from './app'
import { env } from './env'

const PORT = env.PORT

app
  .listen({
    port: PORT,
  })
  .then((url) => {
    console.log(`Server running on ${url}`)
  })
