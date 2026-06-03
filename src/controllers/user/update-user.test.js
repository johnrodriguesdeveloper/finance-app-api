import { jest } from '@jest/globals'
import { UpdateUserController } from './update-user.js';
import { faker } from '@faker-js/faker';
import { EmailAlreadyInUseError } from '../../errors/user'; 
import { expect, describe, it } from '@jest/globals'

describe('UpdateUserController', () => {

  class UpdateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }
  
  const makeSut = () => {
     const updateUserUseCaseStub = new UpdateUserUseCaseStub()
     const sut = new UpdateUserController(updateUserUseCaseStub)
     return { sut, updateUserUseCaseStub }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid()
    },
    body: {
            first_name: faker.person.firstName(), 
            last_name: faker.person.lastName(),   
            email: faker.internet.email(),
            password: faker.internet.password({
              length: 7
            })
        }
     };

    it('should return 200 if user is updated successfully', async () => {
       const { sut } = makeSut()
         
       const httpResponse = await sut.execute(httpRequest)
       
       expect(httpResponse.statusCode).toBe(200)
    })
    
    it('should return 400 when an invalid email is provided', async () => {
      const { sut } = makeSut()
         
     const httpResponse = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: 'invalid-email'
      }
     })


     expect(httpResponse.statusCode).toBe(400);
    })
    
    it('should return 400 when an invalid password is provided', async () => {
      const { sut } = makeSut()
         
     const httpResponse = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({
          length: 5
        })
      }
     })


     expect(httpResponse.statusCode).toBe(400);
    })
    
     it('should return 400 when an invalid id is provided', async () => {
      const { sut } = makeSut()
         
     const httpResponse = await sut.execute({
      params: {
        userId: 'invalid-id'
      },
      body: httpRequest.body
     })


     expect(httpResponse.statusCode).toBe(400);
    })
    
    it('should return 400 when an unallowed id is provided', async () => {
      const { sut } = makeSut()
         
     const httpResponse = await sut.execute({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        unallowedField: 'unallowed-value'
      }
     })


     expect(httpResponse.statusCode).toBe(400);
    })

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
      const { sut, updateUserUseCaseStub  } = makeSut()

      jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValueOnce(
        new Error()
      )

      const response = await sut.execute(httpRequest)

      expect(response.statusCode).toBe(500)
    })

     it('should return 500 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
      const { sut, updateUserUseCaseStub  } = makeSut()

      jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValueOnce(
        new EmailAlreadyInUseError()
      )

      const response = await sut.execute(httpRequest)

      expect(response.statusCode).toBe(400)
    })
})