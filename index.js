import express from 'express'
import 'dotenv/config.js'
import {
  GetUserByIdController,
  DeleteUserController,
  UpdateUserController
} from './src/controllers/index.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/user/get-user-by-id.js'
import { PostgresGetUserByEmailRepository } from './src/repositories/postgres/user/get-user-by-email.js'
import { UpdateUserRepository } from './src/repositories/postgres/user/update-user.js'
import { DeleteUserUseCase } from './src/use-cases/user/delete-user.js'
import { PostgresDeleteUser } from './src/repositories/postgres/user/delete-user.js'
import { GetUserByIdUseCase } from './src/use-cases/user/get-user-by-id.js'
import { UpdateUserUseCase } from './src/use-cases/user/update-user.js'
import { makeCreateTransactionController } from './src/controllers/factories/controllers/transaction.js'
import { makeGetTransactionByUserIdController } from './src/controllers/factories/controllers/transaction.js'
import { makeUpdateTransactionController } from './src/controllers/factories/controllers/transaction.js'
import { makeDeleteTransactionController } from './src/controllers/factories/controllers/transaction.js'
import { makeGetUserBalanceController } from './src/controllers/factories/controllers/user.js'
import { makeCreateUserController } from './src/controllers/factories/controllers/user.js'






const app = express()

app.use(express.json())

app.post('/api/users', async (req, res) => {
 
  const createUserController = makeCreateUserController()

  const { statusCode, body } = await createUserController.execute(req)

  res.status(statusCode).json(body)
})

app.patch('/api/users/:userId', async (req, res) => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const updateUserRepository = new UpdateUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository
  )

  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.execute(req)

  res.status(statusCode).json(body)
})

app.get('/api/users/:userId', async (req, res) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(req)

  res.status(statusCode).json(body)
})

app.delete('/api/users/:userId', async (req, res) => {
  const deleteUserRepository = new PostgresDeleteUser()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.execute(req)

  res.status(statusCode).json(body)
})

app.get('/api/transactions', async (req, res) => {
  const getTransactionByUserIdController = makeGetTransactionByUserIdController()

  const { statusCode, body } = await getTransactionByUserIdController.execute(req)

  res.status(statusCode).json(body)
})

app.post('/api/transactions', async (req, res) => {
  const createTransactionController = makeCreateTransactionController()

  const { statusCode, body } = await createTransactionController.execute(req)

  res.status(statusCode).json(body)
})  

app.patch('/api/transactions/:transactionId', async (req, res) => {
  const updateTransactionController = makeUpdateTransactionController()

  const { statusCode, body } = await updateTransactionController.execute(req)

  res.status(statusCode).json(body)
})

app.delete('/api/transactions/:transactionId', async (req, res) => {
  const deleteTransactionController = makeDeleteTransactionController()

  const { statusCode, body } = await deleteTransactionController.execute(req)

  res.status(statusCode).json(body)
})

app.get('/api/users/:userId/balance', async (req, res) => {
  const getUserBalanceController = makeGetUserBalanceController()

  const { statusCode, body } = await getUserBalanceController.execute(req)

  res.status(statusCode).json(body)
})

app.listen(8080, () => console.log('listening on port 8080'))