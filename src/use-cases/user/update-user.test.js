import { describe, it, expect, jest } from '@jest/globals'
import { UpdateUserUseCase } from './update-user.js'
import { faker } from '@faker-js/faker'

describe('UpdateUserUseCase', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return null
    }
  }

  class UpdateUserRepositoryStub {
    async execute(userId, user) {
      return { id: userId, ...user }
    }
  }

  class BcryptAdapterStub {
    async hash() {
      return 'hashedPassword'
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const updateUserRepository = new UpdateUserRepositoryStub()
    const bcryptAdapter = new BcryptAdapterStub()

    const sut = new UpdateUserUseCase(
      getUserByEmailRepository,
      updateUserRepository,
      bcryptAdapter
    )

    return {
      sut,
      getUserByEmailRepository,
      updateUserRepository,
      bcryptAdapter
    }
  }

  it('should successfully update a user without email and password', async () => {
    const { sut } = makeSut()
    const userId = faker.string.uuid()
    const params = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName()
    }

    const updatedUser = await sut.execute(userId, params)

    expect(updatedUser.id).toBe(userId)
    expect(updatedUser.first_name).toBe(params.first_name)
    expect(updatedUser.last_name).toBe(params.last_name)
  })

  it('should successfully update a user and hash the new password', async () => {
    const { sut, bcryptAdapter } = makeSut()
    const userId = faker.string.uuid()
    const params = { password: 'plainTextPassword' }

    const hashSpy = jest.spyOn(bcryptAdapter, 'hash')

    const updatedUser = await sut.execute(userId, params)

    expect(hashSpy).toHaveBeenCalledWith('plainTextPassword')
    expect(updatedUser.password).toBe('hashedPassword')
  })

  it('should successfully update a user with a new email', async () => {
    const { sut, getUserByEmailRepository } = makeSut()
    const userId = faker.string.uuid()
    const params = { email: faker.internet.email() }

    const getEmailSpy = jest.spyOn(getUserByEmailRepository, 'execute')

    const updatedUser = await sut.execute(userId, params)

    expect(getEmailSpy).toHaveBeenCalledWith(params.email)
    expect(updatedUser.email).toBe(params.email)
  })

  it('should throw an error if email is already in use by another user', async () => {
    const { sut, getUserByEmailRepository } = makeSut()
    const userId = faker.string.uuid()
    const params = { email: faker.internet.email() }

    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce({
      id: faker.string.uuid() 
    })

    const promise = sut.execute(userId, params)

    await expect(promise).rejects.toThrow(new Error('Email already exists'))
  })

  it('should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepository } = makeSut()
    
    jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))

    const promise = sut.execute(faker.string.uuid(), { email: faker.internet.email() })

    await expect(promise).rejects.toThrow()
  })

  it('should throw if BcryptAdapter throws', async () => {
    const { sut, bcryptAdapter } = makeSut()
    
    jest.spyOn(bcryptAdapter, 'hash').mockRejectedValueOnce(new Error('Bcrypt error'))

    const promise = sut.execute(faker.string.uuid(), { password: 'newPassword' })

    await expect(promise).rejects.toThrow()
  })

  it('should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepository } = makeSut()
    
    jest.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))

    const promise = sut.execute(faker.string.uuid(), { first_name: 'John' })

    await expect(promise).rejects.toThrow()
  })
})