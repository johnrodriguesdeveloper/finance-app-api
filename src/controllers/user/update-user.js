import { serverError, ok, badRequest } from '../helpers/http.js'
import { EmailAlreadyInUseError } from "../../errors/user.js"
import { checkIfPasswordIsValid, checkIfEmailIsValid, invalidEmailResponse, invalidPasswordResponse, invalidIdRequiredResponse } from "../helpers/user.js"
import { checkIfIdIsValid } from "../helpers/validation.js"

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

      const updateData = request.body

      const allowedFields = [
        'first_name',
        'last_name',
        'email',
        'password'
      ]

      const someFieldIsNotAllowed = Object.keys(updateData).some(
        (field) => !allowedFields.includes(field)
      )

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: 'Some fields are not allowed'
        })
      }

      if (updateData.password) {
        const passwordLengthNotIsValid = checkIfPasswordIsValid(updateData.password)
        if (passwordLengthNotIsValid) {
          return invalidPasswordResponse()
        }
      }

      if (updateData.email) {
        const emailIsNotValid = checkIfEmailIsValid(updateData.email)
        if (emailIsNotValid) {
          return invalidEmailResponse()
        }
      }

      const result = await this.updateUserUseCase.execute(userId, updateData)
      
      return ok( result)
    } catch (error) {

      if(error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return serverError()
    }
  }
}