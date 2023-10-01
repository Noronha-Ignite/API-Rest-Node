import { app } from './app'
import { env } from './env'

const PORT = env.PORT

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
