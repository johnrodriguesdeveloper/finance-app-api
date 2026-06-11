import { describe, it, expect, jest } from '@jest/globals'
import { DeleteUserUseCase } from './delete-user.js'
import { faker } from '@faker-js/faker'

describe('DeleteUserUseCase', () => {
  class DeleteUserRepositoryStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      }
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub()
    const sut = new DeleteUserUseCase(deleteUserRepository)

    return {
      sut,
      deleteUserRepository,
    }
  }

  it('should successfully delete a user', async () => {
    const { sut } = makeSut()
    const userId = faker.string.uuid()
    
    const deletedUser = await sut.execute(userId)
    
    expect(deletedUser).toBeTruthy()
    expect(deletedUser).toHaveProperty('id')
    expect(deletedUser).toHaveProperty('first_name')
  })

  it('should return null if DeleteUserRepository returns null', async () => {
    const { sut, deleteUserRepository } = makeSut()
    
    jest.spyOn(deleteUserRepository, 'execute').mockResolvedValueOnce(null)
    const userId = faker.string.uuid()
    
    const result = await sut.execute(userId)
    
    expect(result).toBeNull()
  })

  it('should throw if DeleteUserRepository throws', async () => {
    const { sut, deleteUserRepository } = makeSut()
    
    jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))
    const userId = faker.string.uuid()
    
    const promise = sut.execute(userId)
    
    await expect(promise).rejects.toThrow()
  })
})