import { serverError, ok, badRequest } from './helpers.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator'

export class GetUserByIdController {
   async execute(request, reply) {
    try {
      const isIdValid = validator.isUUID(request.params.userId)
      if (!isIdValid) {
        return badRequest({ message: 'Invalid user ID' })
      }
      const { userId } = request.params
      const getUserByIdUseCase = new GetUserByIdUseCase()
      const user = await getUserByIdUseCase.execute(userId)
      
      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
   }
}