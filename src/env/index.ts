import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({
    path: '.env.test',
  })
} else {
  config()
}

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('production'),
    PORT: z.preprocess(
      (a) => (a ? parseInt(z.string().max(5).parse(a), 10) : undefined),
      z.number().positive().default(3333),
    ),
    DB_CLIENT: z.string(),

    DB_HOST: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_NAME: z.string().optional(),

    DB_URL: z.string().optional(),
  })
  .refine((data) => {
    // If not test environment require connection fields
    if (
      data.NODE_ENV !== 'test' &&
      !(data.DB_HOST && data.DB_NAME && data.DB_PASSWORD && data.DB_USER)
    ) {
      return false
    }

    // If test environment require db url field
    if (data.NODE_ENV === 'test' && !data.DB_URL) {
      return false
    }

    return true
  })

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
