import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { expect, describe, it } from '@jest/globals'

describe('Delete Transaction Controller', () => {

    class DeleteTransactionUseCase {
      async execute() {
        return {
          userId: faker.string.uuid(),
          id: faker.string.uuid(),
          name: faker.string.uuid(),
          date:faker.date.anytime().toISOString(),
          type: 'EXPENSE',
          amount: Number(faker.finance.amount())
        }
      }
    }
      
  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCase()
    const sut = new DeleteTransactionController(deleteTransactionUseCase)
    return {
      sut,
      deleteTransactionUseCase
    }
  }

  it('should return 200 when deleting a transaction successfully', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      params: {
        transactionId: faker.string.uuid()
      }
    })
    expect(response.statusCode).toBe(200)
  })
})