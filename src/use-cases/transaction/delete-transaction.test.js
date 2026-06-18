
import { describe, it, expect, jest } from '@jest/globals'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { faker } from '@faker-js/faker'

describe('DeleteTransactionUseCase', () => {
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        name: 'Salary',
        amount: 5000,
        type: 'EARNING'
      }
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()
    const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

    return { sut, deleteTransactionRepository }
  }

  it('should successfully delete a transaction', async () => {
    const { sut } = makeSut()
    const transactionId = faker.string.uuid()

    const transaction = await sut.execute(transactionId)

    expect(transaction).toBeTruthy()
    expect(transaction.id).toBe(transactionId)
  })

  it('should throw if repository throws', async () => {
    const { sut, deleteTransactionRepository } = makeSut()
    jest.spyOn(deleteTransactionRepository, 'execute').mockRejectedValueOnce(new Error('DB Error'))

    const promise = sut.execute(faker.string.uuid())

    await expect(promise).rejects.toThrow()
  })
})