import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  serverError,
  validateRequiredFields,
  requiredFieldResponse,
  created 
} from '../helpers/index.js'
import { checkIfAmountIsValid, checkIfTypeIsValid ,invalidAmountResponse, invalidTypeResponse} from '../helpers/transaction.js'

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

      const { ok: requiredFieldsAreValid, field } = validateRequiredFields(params, requiredFields)

      if (!requiredFieldsAreValid) {
        return requiredFieldResponse(field)
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }


      const amoutIsValid = checkIfAmountIsValid(params.amount)

      if (!amoutIsValid) {
        return invalidAmountResponse()
      }

      const type = params.type.trim().toUpperCase() 

      const typeIsValid = checkIfTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
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