import {
  serverError,
  created,
  badRequest
} from '../helpers/index.js'
import { createTransactionSchema } from '../../schemas/transaction.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      await createTransactionSchema.parseAsync(params)
      
      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type: params.type.toUpperCase()
      })

      return created(transaction)

    } catch (error) {
      if (error.name === 'ZodError') {
        return badRequest(error.issues[0].message)
      }
      console.error(error)
      return serverError(error.message)
    }
  }
}