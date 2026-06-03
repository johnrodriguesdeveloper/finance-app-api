import { describe, it, expect } from '@jest/globals'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { faker } from '@faker-js/faker'

describe('GetTransactionByUserIdController', () => {
  class GetUserByIdStub {
    async execute() {
      return [
        {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
          name: faker.string.uuid(),
          date:faker.date.anytime().toISOString(),
          type: 'EXPENSE',
          amount: Number(faker.finance.amount())
      }
      ]
    }
  }
  
  const makeSut = () => {
    const getUserByIdStub = new GetUserByIdStub()
    const sut = new GetTransactionByUserIdController(getUserByIdStub)
    return { sut, getUserByIdStub }
  }


    it('should return 200 when finding transactions by user id successfully', async () => {
        const { sut }= makeSut()

        const response = await sut.execute({
          query: {
            userId: faker.string.uuid()
          }
        })
        
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when user id is invalid', async () => {
        const { sut }= makeSut()

        const response = await sut.execute({
          query: {
            userId: 'invalid-id'
          }
        })
        
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing userId param', async () => {
        const { sut }= makeSut()

        const response = await sut.execute({
          query: {
            userId: undefined
          }
        })
        
        expect(response.statusCode).toBe(400)
    })
})