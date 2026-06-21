import { Router } from "express"
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
import { makeCreateUserController } from './src/controllers/factories/controllers/user.js'
import { makeGetUserBalanceController } from "../controllers/factories/controllers/user.js"


export const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
 
  const createUserController = makeCreateUserController()

  const { statusCode, body } = await createUserController.execute(req)

  res.status(statusCode).json(body)
})

usersRouter.patch('/:userId', async (req, res) => {
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

usersRouter.get('/:userId', async (req, res) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(req)

  res.status(statusCode).json(body)
})

usersRouter.delete('/:userId', async (req, res) => {
  const deleteUserRepository = new PostgresDeleteUser()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.execute(req)

  res.status(statusCode).json(body)
})

usersRouter.get('/:userId/balance', async (req, res) => {
  const getUserBalanceController = makeGetUserBalanceController()

  const { statusCode, body } = await getUserBalanceController.execute(req)

  res.status(statusCode).json(body)
})