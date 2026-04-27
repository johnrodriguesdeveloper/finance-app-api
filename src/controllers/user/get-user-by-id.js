import { serverError, ok } from '../helpers/http.js'
import { userNotFoundResponse } from '../helpers/user.js'
import { checkIfIdIsValid, invalidIdResponse } from '../helpers/validation.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

   async execute(request, reply) {
    try {
      const isIdValid = checkIfIdIsValid(request.params.userId)
      if (!isIdValid) {
        return invalidIdResponse()
      }
      const { userId } = request.params
      const user = await this.getUserByIdUseCase.execute(userId)

      if (!user) {
        return userNotFoundResponse()
      }
      
      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
   }
}