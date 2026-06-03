import { UpdateTransactionController } from './update-transaction.js'
import { faker } from '@faker-js/faker'
import { describe, it, expect } from '@jest/globals'

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      }
    }
  }

  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCase)

    return { sut, updateTransactionUseCase }
  }

  const baseHttpReq = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
     name: faker.commerce.productName(),
     date: faker.date.anytime().toISOString(),
     type: 'EXPENSE',
     amount: Number(faker.finance.amount()),  
    }
  }

  it('should return 200 when updating a transaction successfully', async () => {
    const { sut } = makeSut()

    const response = await sut.execute(baseHttpReq)

    expect(response.statusCode).toBe(200)
  })
  it('should return 400 when transaction ID is missing', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpReq,
      params: {
        transactionId: 'invalid-id',
      },
    })

    expect(response.statusCode).toBe(400)
  })
  it('should return 400 when transaction ID is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpReq,
      params: {
        transactionId: undefined,
      },
    })

    expect(response.statusCode).toBe(500)
  })
  it('should return 500 when updateTransactionUseCase throws an error', async () => {
    const { sut, updateTransactionUseCase } = makeSut()
    
    updateTransactionUseCase.execute = async () => {
      throw new Error('Database error')
    }

    const response = await sut.execute(baseHttpReq)

    expect(response.statusCode).toBe(500)
  })
  it('should return 400 when transaction amount is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpReq,
      body: {
        amount: 'invalid-amount',
      },
    })

    expect(response.statusCode).toBe(400)
  })

   it('should return 400 when transaction type is invalid', async () => {
    const { sut } = makeSut()

    const response = await sut.execute({
      ...baseHttpReq,
      body: {
        type: 'invalid-amount',
      },
    })

    expect(response.statusCode).toBe(400)
  })
})