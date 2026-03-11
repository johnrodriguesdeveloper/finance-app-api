import { CreateUserUseCase } from "../use-cases/create-user.js";
import validator from "validator";
import { badRequest, serverError, created } from "./helpers.js";
import { EmailAlreadyInUseError } from "../errors/user.js";

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim() === '') {
          return badRequest({ message: `Missing param: ${field}` });
        }
      }

      const passwordLengthIsNotValid = params.password.length < 6;
      if (passwordLengthIsNotValid) {
        return badRequest({ message: 'Password must be at least 6 characters long' });
      }

      const emailIsNotValid = !validator.isEmail(params.email);
      if (emailIsNotValid) {
        return badRequest({ message: 'Invalid email format' });
      }

      const createUserUseCase = new CreateUserUseCase();
      
      const createdUser = await createUserUseCase.execute(params);
      

      return created(createdUser);

    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.error(error);
      return serverError(error);
    }
  }
}