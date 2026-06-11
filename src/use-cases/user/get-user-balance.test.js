import { describe, it, expect, jest } from '@jest/globals'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { faker } from '@faker-js/faker'
import { UserNotFoundError } from '../../errors/user.js'

describe('GetUserBalanceUseCase', () => {
  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return {
        id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 })
      }
    }
  }

  class GetUserBalanceRepositoryStub {
    async execute() {
      return {
        earnings: Number(faker.finance.amount()),
        expenses: Number(faker.finance.amount()),
        balance: Number(faker.finance.amount())
      }
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
    
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository
    )

    return {
      sut,
      getUserByIdRepository,
      getUserBalanceRepository
    }
  }

  it('should successfully get user balance', async () => {
    const { sut } = makeSut()
    const params = { userId: faker.string.uuid() }

    const balance = await sut.execute(params)

    expect(balance).toBeTruthy()
    expect(balance).toHaveProperty('earnings')
    expect(balance).toHaveProperty('expenses')
    expect(balance).toHaveProperty('balance')
  })

  it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
    
    const params = { userId: faker.string.uuid() }
    const promise = sut.execute(params)

    await expect(promise).rejects.toThrow(new UserNotFoundError(params.userId))
  })

  it('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))
    
    const params = { userId: faker.string.uuid() }
    const promise = sut.execute(params)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if GetUserBalanceRepository throws', async () => {
    const { sut, getUserBalanceRepository } = makeSut()
    
    jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))
    
    const params = { userId: faker.string.uuid() }
    const promise = sut.execute(params)

    await expect(promise).rejects.toThrow()
  })
})