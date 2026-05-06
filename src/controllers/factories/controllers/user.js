import { GetUserBalanceController } from "../../../controllers/user/get-user-balance.js"
import { PostgresGetUserBalanceRepository } from "../../../repositories/postgres/user/get-user-balance.js"
import { PostgresGetUserByIdRepository } from "../../../repositories/postgres/user/get-user-by-id.js"
import { GetUserBalanceUseCase } from "../../../use-cases/user/get-user-balance.js"

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