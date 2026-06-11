import { describe, it, expect, jest } from '@jest/globals'
import { CreateUserUseCase } from './create-user.js'
import { faker } from '@faker-js/faker'
import { EmailAlreadyInUseError } from '../../errors/user.js'

describe('Create User Use Case', () => {
  const makeSut = () => {
    class GetUserByEmailRepositoryStub {
      async execute() {
        return null
      }
    }

    class BcryptAdapterStub {
      async hash() {
        return 'hashedPassword'
      }
    }

    class IdGeneratorAdapterStub {
      execute() {
        return 'userId'
      }
    }

    class CreateUserRepositoryStub {
      async execute(user) {
        return user
      }
    }

    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const bcryptAdapter = new BcryptAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()
    const createUserRepository = new CreateUserRepositoryStub()

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      bcryptAdapter,
      idGeneratorAdapter
    )

    return {
      sut,
      getUserByEmailRepository,
      bcryptAdapter,
      idGeneratorAdapter,
      createUserRepository,
    }
  } 

  const user = {
    id: 'userId',
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'hashedPassword'
  }

  it('should create a new user', async () => {
    const { sut } = makeSut()

    const createdUser = await sut.execute(user)
    expect(createdUser).toBeTruthy()
  })

  it('should throw an EmailAlreadyExistsError if email already exists', async () => {
    const { sut , getUserByEmailRepository} = makeSut()

    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(user)

    const promise = sut.execute(user)
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email)
    )
  })

  it('should throw if IdGeneratorAdapter throws', async () => {
    const { sut, idGeneratorAdapter } = makeSut()
    
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error('IdGenerator error')
    })

    const promise = sut.execute(user)
    
    await expect(promise).rejects.toThrow()
  })

  it('should throw if BcryptAdapter throws', async () => {
    const { sut, bcryptAdapter } = makeSut()
    
    jest.spyOn(bcryptAdapter, 'hash').mockRejectedValueOnce(new Error('Bcrypt error'))

    const promise = sut.execute(user)
    
    await expect(promise).rejects.toThrow()
  })

  it('should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut()
    
    jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(new Error('Database error'))

    const promise = sut.execute(user)
    
    await expect(promise).rejects.toThrow()
  })
})