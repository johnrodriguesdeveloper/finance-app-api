import { serverError, ok, badRequest } from './helpers.js'
import { UpdateUserUseCase } from "../use-cases/update-user.js"
import validator from "validator"
import { EmailAlreadyInUseError } from "../errors/user.js"

export class UpdateUserController {
  async execute(request) {
    try {
      const userId = request.params.userId

      const isIdValid = validator.isUUID(userId)

      if (!userId || !isIdValid) {
        return badRequest({ message: 'User ID is required and must be a valid UUID' })
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
        const passwordLengthNotIsValid = updateData.password.length < 6
        if (passwordLengthNotIsValid) {
          return badRequest({ message: 'Password must be at least 6 characters long' })
        }
      }

      if (updateData.email) {
        const emailIsNotValid = !validator.isEmail(updateData.email)
        if (emailIsNotValid) {
          return badRequest({ message: 'Invalid email format' })
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