import express from 'express'
import { usersRouter } from './routes/users.js'
import { transactionsRouter } from './routes/transactions.js'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'


const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

const swaggerDocument = swaggerUi.setup(JSON.parse(fs.readFileSync(path.join(process.cwd(), 'docs', 'swagger.json'), 'utf8')))
app.use('/docs', swaggerUi.serve, swaggerDocument)

export default app