import { serverError, ok, badRequest } from '../helpers/http.js'
import { EmailAlreadyInUseError } from "../../errors/user.js"
import { invalidIdRequiredResponse } from "../helpers/user.js"
import { checkIfIdIsValid } from "../helpers/validation.js"
import { updateUserSchema } from "../../schemas/user.js"
import { z } from "zod"

export class UpdateUserController {

  constructor(updateUserUseCase){
    this.updateUserUseCase = updateUserUseCase
  }
  
  async execute(request) {
    try {
      const userId = request.params.userId

      const isIdValid = checkIfIdIsValid(userId)  

      if (!userId || !isIdValid) {
        return invalidIdRequiredResponse()
      }

      const params = request.body

      await updateUserSchema.parseAsync(params)

      const result = await this.updateUserUseCase.execute(userId, params)
      
      return ok( result)
    } catch (error) {

      if (error instanceof z.ZodError) {
        return badRequest({ message: error.issues[0].message })
      }

      if(error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return serverError()
    }
  }
}