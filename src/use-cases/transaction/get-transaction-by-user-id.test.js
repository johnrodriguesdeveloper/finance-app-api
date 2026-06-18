import { describe, it, expect, jest } from '@jest/globals'
import { GetTransactionByUserId } from './get-transaction-by-user-id.js'
import { faker } from '@faker-js/faker'

describe('GetTransactionByUserId UseCase', () => {
  class GetTransactionByUserIdRepositoryStub {
    async execute(userId) {
      return [
        { id: faker.string.uuid(), user_id: userId, amount: 100 },
        { id: faker.string.uuid(), user_id: userId, amount: 200 }
      ]
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { id: userId, name: 'John' }
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository = new GetTransactionByUserIdRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetTransactionByUserId(getTransactionByUserIdRepository, getUserByIdRepository)

    return { sut, getTransactionByUserIdRepository, getUserByIdRepository }
  }

  it('should successfully get transactions by user id', async () => {
    const { sut } = makeSut()
    const userId = faker.string.uuid()

    const transactions = await sut.execute({ userId })

    expect(transactions).toHaveLength(2)
    expect(transactions[0].user_id).toBe(userId)
  })

  it('should throw Error if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

    const promise = sut.execute({ userId: faker.string.uuid() })

    await expect(promise).rejects.toThrow(new Error('User not found'))
  })

  it('should throw if GetTransactionByUserIdRepository throws', async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut()
    jest.spyOn(getTransactionByUserIdRepository, 'execute').mockRejectedValueOnce(new Error('DB Error'))

    const promise = sut.execute({ userId: faker.string.uuid() })

    await expect(promise).rejects.toThrow()
  })
})