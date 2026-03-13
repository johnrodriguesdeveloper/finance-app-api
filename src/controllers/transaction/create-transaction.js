import validator from 'validator'
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  created,
} from './helpers/index.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }


  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = [
        'user_id',
        'name',
        'date',
        'amount',
        'type'
      ]

      for (const field of requiredFields) {
        if (!params[field] || String(params[field]).trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }


      if(params.amount <= 0) {
        return badRequest({ message: 'Amount must be greater than 0' })
      }

      const amoutIsValid = validator.isCurrency(params.amount.toString(),{
        decimal_digits: 2,
        allow_negatives: false,
        decimal_separator: '.'
      })

      if (!amoutIsValid) {
        return badRequest({ message: 'Invalid amount' })
      }

      const type = params.type.trim().toLowerCase()

      const typeIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typeIsValid) {
        return badRequest({ message: 'Invalid type' })
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type
      })

      return created(transaction)

    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}