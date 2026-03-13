import { serverError, ok, badRequest } from '../helpers/http.js'
import { checkIfIdIsValid, userNotFoundResponse } from '../helpers/user.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

   async execute(request, reply) {
    try {
      const isIdValid = checkIfIdIsValid(request.params.userId)
      if (!isIdValid) {
        return badRequest({ message: 'Invalid user ID' })
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