import { invalidIdResponse, serverError, badRequest, invalidAmountResponse, invalidTypeResponse, ok } from '../helpers/index.js'
import { checkIfIdIsValid } from '../helpers/validation.js'
import { checkIfAmountIsValid, checkIfTypeIsValid } from '../helpers/transaction.js'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {

          const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)  
            if (!idIsValid) {
                return invalidIdResponse()
            }
              const params = httpRequest.body
                 const allowedFields = [
                    'name',
                    'date',
                    'amount',
                    'type'
                  ]
            
                  const someFieldIsNotAllowed = Object.keys(params).some(
                    (field) => !allowedFields.includes(field)
                  )
            
                  if (someFieldIsNotAllowed) {
                    return badRequest({
                      message: 'Some fields are not allowed'
                    })
                  }

                  if (params.amount && !checkIfAmountIsValid(params.amount)) {
                    return invalidAmountResponse();
                }
            
                if (params.type && !checkIfTypeIsValid(params.type)) {
                    return invalidTypeResponse();
                }

               const transaction = await this.updateTransactionUseCase.execute(
                    httpRequest.params.transactionId, 
                    params                            
                ) 
            
                return ok(transaction)
        } catch (error) {
            return serverError(error)
        }
    }
}