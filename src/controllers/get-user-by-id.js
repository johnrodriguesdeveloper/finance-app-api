import { serverError, ok, badRequest, notFound } from './helpers/http.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { checkIfIdIsValid } from './helpers/user.js'

export class GetUserByIdController {
   async execute(request, reply) {
    try {
      const isIdValid = checkIfIdIsValid(request.params.userId)
      if (!isIdValid) {
        return badRequest({ message: 'Invalid user ID' })
      }
      const { userId } = request.params
      const getUserByIdUseCase = new GetUserByIdUseCase()
      const user = await getUserByIdUseCase.execute(userId)

      if (!user) {
        return notFound({ message: 'User not found' })
      }
      
      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
   }
}