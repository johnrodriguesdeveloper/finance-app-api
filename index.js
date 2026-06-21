import express from 'express'
import 'dotenv/config.js'

import { usersRouter } from './src/routes/users.js'
import { transactionsRouter } from './src/routes/transactions.js'

const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

app.listen(8080, () => console.log('listening on port 8080'))