import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'

describe('CreateTransactionController', () => {

  const makeSut = () => {
    const createTransactionController = new CreateTransactionController()
    const sut = new CreateTransactionController(createTransactionController)

    return { createTransactionController, sut }
  }

  const baseHttpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.string.alphanumeric(10),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount())
    }
  }
  
  it('should return 201 when transaction is created', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute(baseHttpRequest)
    expect(response.statusCode).toBe(201)
  })

})