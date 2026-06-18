import { describe, it, expect, jest } from '@jest/globals'
import { GetUserByIdUseCase } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('GetUserByIdUseCase', () => {
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

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdRepository)

    return {
      sut,
      getUserByIdRepository
    }
  }

  it('should successfully get a user by id', async () => {
    const { sut } = makeSut()
    const userId = faker.string.uuid()

    const user = await sut.execute(userId)

    expect(user).toBeTruthy()
    expect(user.id).toBe(userId)
    expect(user).toHaveProperty('first_name')
  })

  it('should return null if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)
    const userId = faker.string.uuid()

    const user = await sut.execute(userId)

    expect(user).toBeNull()
  })

  it('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut()
    
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))
    const userId = faker.string.uuid()

    const promise = sut.execute(userId)

    await expect(promise).rejects.toThrow()
  })
})