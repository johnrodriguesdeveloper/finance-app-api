import { PostgresCreateTransactionRepository } from '../../../repositories/postgres/transaction/create-transaction.js'
import { CreateTransactionUseCase } from '../../../use-cases/transaction/create-transaction.js'
import { CreateTransactionController } from '../../transaction/create-transaction.js'
import { PostgresGetUserByIdRepository } from '../../../repositories/postgres/user/get-user-by-id.js'
import { PostgresGetTransactionByUserIdRepository } from '../../../repositories/postgres/transaction/get-transaction-by-user-id.js'
import { GetTransactionByUserId } from '../../../use-cases/transaction/get-transaction-by-user-id.js'
import { GetTransactionByUserIdController } from '../../transaction/get-transaction-by-user-id.js'
import { PostgresUpdateTransactionRepository } from '../../../repositories/postgres/transaction/update-transaction.js'
import { UpdateTransactionUseCase } from '../../../use-cases/transaction/update-transaction.js'
import { UpdateTransactionController } from '../../transaction/update-transaction.js'


export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()
  const createTransactionUseCase = new CreateTransactionUseCase(createTransactionRepository, getUserByIdRepository)
  const createTransactionController = new CreateTransactionController(createTransactionUseCase)
  
  return createTransactionController
}

export const makeGetTransactionByUserIdController = () => {
  const getTransactionByUserIdRepository = new PostgresGetTransactionByUserIdRepository()
  const getTransactionByUserIdUseCase = new GetTransactionByUserId(getTransactionByUserIdRepository)
  const getTransactionByUserIdController = new GetTransactionByUserIdController(getTransactionByUserIdUseCase)
  
  return getTransactionByUserIdController
}

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()
  const updateTransactionUseCase = new UpdateTransactionUseCase(updateTransactionRepository)
  const updateTransactionController = new UpdateTransactionController(updateTransactionUseCase)
  
  return updateTransactionController
}
