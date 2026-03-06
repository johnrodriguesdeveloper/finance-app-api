import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from "validator";

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
    const requiredFields = ['first_name', 'last_name', 'email', 'password']
    
    for (const field of requiredFields) {
      if (!params[field] || params[field].trim() === '') {
        return {
          statusCode: 400,
          body: {
            errorMessage: `Missing parameter: ${field}`
          }
        }
      }
    }
    const passwordLengthIsValid = params.password.length >= 6
    if (!passwordLengthIsValid) {
      return {
        statusCode: 400,
        body: {
          errorMessage: 'Password must be at least 6 characters long'
        }
      }
    }
    const emailIsValid = validator.isEmail(params.email)
    if (!emailIsValid) {
      return {
        statusCode: 400,
        body: {
          errorMessage: 'Invalid email format'
        }
      }
    }
    const createUserUseCase = new CreateUserUseCase()
    const createdUser = await createUserUseCase.execute(params)
    return {
      statusCode: 201,
      body: createdUser
    }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: {
          errorMessage: 'Internal server error'
        }
      }
    }
  }
}
