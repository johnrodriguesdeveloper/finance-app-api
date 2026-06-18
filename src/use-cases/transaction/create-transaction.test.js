import { describe, it, expect, jest } from '@jest/globals'
import { CreateTransactionUseCase } from './create-transaction.js'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'

describe('CreateTransactionUseCase', () => {
  class CreateTransactionRepositoryStub {
    async execute(transaction) {
      return transaction
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { id: userId, first_name: 'John' }
    }
  }

  class IdGeneratorAdapterStub {
    generate() {
      return 'transaction-id-123'
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter
    )

    return { sut, createTransactionRepository, getUserByIdRepository, idGeneratorAdapter }
  }

  it('should successfully create a transaction', async () => {
    const { sut } = makeSut()
    const params = {
      user_id: faker.string.uuid(),
      name: 'Supermarket',
      amount: 150.50,
      type: 'EXPENSE'
    }

    const transaction = await sut.execute(params)

    expect(transaction.id).toBe('transaction-id-123')
    expect(transaction.name).toBe(params.name)
  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
    const params = { user_id: faker.string.uuid() }

    const promise = sut.execute(params)

    await expect(promise).rejects.toThrow(new UserNotFoundError(params.user_id))
  })

  it('should throw if CreateTransactionRepository throws', async () => {
    const { sut, createTransactionRepository } = makeSut()
    jest.spyOn(createTransactionRepository, 'execute').mockRejectedValueOnce(new Error('DB Error'))
    const params = { user_id: faker.string.uuid() }

    const promise = sut.execute(params)

    await expect(promise).rejects.toThrow()
  })
})