import { jest } from '@jest/globals'
import { DeleteUserController } from './delete-user.js'
import { faker } from '@faker-js/faker'
import { expect, describe, it } from '@jest/globals'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        async execute() {
            return {
              id: faker.string.uuid(),
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              email: faker.internet.email(),
              password: faker.internet.password({ length: 7 })
            }
        }
    }
    
    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const deleteUserController = new DeleteUserController(deleteUserUseCase)
        return {
            deleteUserUseCase,
            deleteUserController
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid()
        }
    }
  
    
    it('should delete user successfully', async () => {
        const { deleteUserController } = makeSut()
        const httpResponse = await deleteUserController.execute(httpRequest)
        
        expect(httpResponse.statusCode).toBe(200)
    })

    it('should return 404 if user not found', async () => {
        const { deleteUserController, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null)
       
        const httpResponse = await deleteUserController.execute(httpRequest)
        
        expect(httpResponse.statusCode).toBe(404)
    })

    it('should return 500 if deleteUserUseCase throws', async () => {
        const { deleteUserController, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockImplementation(() => {
            throw new Error()
        })
       
        const httpResponse = await deleteUserController.execute(httpRequest)
        
        expect(httpResponse.statusCode).toBe(500)
    })
})