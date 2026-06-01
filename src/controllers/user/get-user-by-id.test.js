import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import { jest } from '@jest/globals'

describe('GetUserByIdController', () => {
    class GetUserByIdUserCaseStub {
        async execute(userId) {
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
        const getUserByIdUserCase = new GetUserByIdUserCaseStub()
        const getUserByIdController = new GetUserByIdController(getUserByIdUserCase)
        return {
            getUserByIdUserCase,
            getUserByIdController
        }
    }
    
    it('should return 200 if a user is found', async () => {
        const { getUserByIdController } = makeSut()

        const httpRequest = {
            params: {
                userId: faker.string.uuid()
            }
        }

        const user = await getUserByIdController.execute(httpRequest)

        expect(user.statusCode).toBe(200)
    })

    it('should return 400 if an invalid userId is provided', async () => {
        const { getUserByIdController } = makeSut()

        const httpRequest = {
            params: {
                userId: 'invalid-id'
            }
        }

        const user = await getUserByIdController.execute(httpRequest)

        expect(user.statusCode).toBe(400)
    })

    it('should return 404 if userId is not found', async () => {
        const { getUserByIdController, getUserByIdUserCase } = makeSut()

        jest.spyOn(getUserByIdUserCase, 'execute').mockResolvedValue(null)

        const result = await getUserByIdController.execute({
            params: {
                userId: faker.string.uuid()
            }
        })

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if getUserByIdUserCase throws', async () => {
        const { getUserByIdController, getUserByIdUserCase } = makeSut()
        jest.spyOn(getUserByIdUserCase, 'execute').mockImplementation(() => {
            throw new Error()
        })
       
        const result = await getUserByIdController.execute({
            params: {
                userId: faker.string.uuid()
            }
        })

        expect(result.statusCode).toBe(500)
    })
})