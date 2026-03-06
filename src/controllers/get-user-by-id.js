import { serverError } from './helpers.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'

export class GetUserByIdController {
   async execute(request, reply) {
    try {
      const { userId } = request.params
      const getUserByIdUseCase = new GetUserByIdUseCase()
      const user = await getUserByIdUseCase.execute(userId)
      return { 
        statusCode: 200, 
        user 
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
   }
}