import { GetUserBalanceController } from "../../../controllers/user/get-user-balance.js"
import { PostgresGetUserBalanceRepository } from "../../../repositories/postgres/user/get-user-balance.js"
import { PostgresGetUserByIdRepository } from "../../../repositories/postgres/user/get-user-by-id.js"
import { GetUserBalanceUseCase } from "../../../use-cases/user/get-user-balance.js"
import { PostgresGetUserByEmailRepository } from "../../../repositories/postgres/user/get-user-by-email.js"
import { PostgresCreateUserRepository } from "../../../repositories/postgres/user/create-user.js"
import { CreateUserUseCase } from "../../../use-cases/user/create-user.js"
import { CreateUserController } from "../../../controllers/user/create-user.js"
import { BcryptAdapter } from "../../../adapters/bcrypt.js"

export const makeGetUserBalanceController = () => {
  const postgresGetUserBalanceRepository = new PostgresGetUserBalanceRepository()
  
  const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()
  
  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    postgresGetUserBalanceRepository, 
    postgresGetUserByIdRepository
  )
  
  const getUserBalanceController = new GetUserBalanceController(getUserBalanceUseCase)
  
  return getUserBalanceController
}

export const makeCreateUserController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository()
  const createUserRepository = new PostgresCreateUserRepository()
  const bcryptAdapter = new BcryptAdapter()
  const createUserUseCase = new CreateUserUseCase(getUserByEmailRepository, createUserRepository, bcryptAdapter)
  const createUserController = new CreateUserController(createUserUseCase)
  
  return createUserController
}