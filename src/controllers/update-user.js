import { serverError, ok, badRequest } from './helpers/http.js'
import { UpdateUserUseCase } from "../use-cases/update-user.js"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { checkIfPasswordIsValid, checkIfEmailIsValid, invalidEmailResponse, invalidPasswordResponse, invalidIdRequiredResponse } from "./helpers/user.js"

export class UpdateUserController {
  async execute(request) {
    try {
      const userId = request.params.userId

      const isIdValid = validator.isUUID(userId)

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

      const updateUserUseCase = new UpdateUserUseCase()
      const result = await updateUserUseCase.execute(userId, updateData)
      
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