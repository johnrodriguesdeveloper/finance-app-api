import { GetUserBalanceController } from './get-user-balance.js'
import { faker } from '@faker-js/faker'
import { jest } from '@jest/globals'

describe('GetUserBalanceController', () => {
  class GetUserBalanceUserCaseStub {
    async execute() {
      return faker.commerce.price() 
    }
  }
    const makeSut = () => {
        const getUserBalanceUserCase = new GetUserBalanceUserCaseStub()
        const getUserBalanceController = new GetUserBalanceController(getUserBalanceUserCase)
        return {
            getUserBalanceController,
            getUserBalanceUserCase
        }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid()
        }
    }
    
    it('should get user balance successfully', async () => {
        const { getUserBalanceController, getUserBalanceUserCase } = makeSut()
        jest.spyOn(getUserBalanceUserCase, 'execute').mockResolvedValue({ balance: faker.commerce.price() })

        const httpResponse = await getUserBalanceController.execute(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
    })
})