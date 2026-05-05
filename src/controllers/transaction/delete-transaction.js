import { invalidIdResponse, checkIfIdIsValid } from "../helpers/validation.js"
import { ok, serverError } from "../helpers/http.js"
import { transactionNotFoundResponse } from "../helpers/transaction.js"

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }
  
  async execute(httpRequest) {
    try {
      const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)
      if(!idIsValid) {
        return invalidIdResponse()
      }

      const transaction = await this.deleteTransactionUseCase.execute(httpRequest.params.transactionId)
      
      if(!transaction) {
        return transactionNotFoundResponse()
      }
      
      return ok(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
