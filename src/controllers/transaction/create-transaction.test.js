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


  it('should return 400 when user_id is not provided', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        user_id: undefined
      }
    })
    expect(response.statusCode).toBe(400)
  })
  it('should return 400 when name is not provided', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        name: undefined
      }
    })
    expect(response.statusCode).toBe(400)
  })
  it('should return 400 when date is not provided', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: undefined
      }
    })
    expect(response.statusCode).toBe(400)
  })
  it('should return 400 when type is not provided', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: undefined
      }
    })
    expect(response.statusCode).toBe(400)
  })
  it('should return 400 when amount is not provided', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: undefined
      }
    })
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when date is invalid', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: 'invalid-date'
      }
    })
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
    const { sut } = makeSut()
    
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'invalid-type'
      }
    })
    expect(response.statusCode).toBe(400)
  })

})