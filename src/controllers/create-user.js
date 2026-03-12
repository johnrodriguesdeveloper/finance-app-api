import { CreateUserUseCase } from "../use-cases/create-user.js";
import { EmailAlreadyInUseError } from "../errors/user.js";
import { checkIfPasswordIsValid, checkIfEmailIsValid, invalidEmailResponse, invalidPasswordResponse, badRequest, serverError, created } from "./helpers/index.js";

export class CreateUserController {
  constructor() {
    this.createUserUseCase = CreateUserUseCase;
  }
  
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];
      
      for (const field of requiredFields) {
        if (!params[field] || params[field].trim() === '') {
          return badRequest({ message: `Missing param: ${field}` });
        }
      }

      const passwordLengthIsNotValid = checkIfPasswordIsValid(params.password);
      if (passwordLengthIsNotValid) {
        return invalidPasswordResponse();
      }

      const emailIsNotValid = checkIfEmailIsValid(params.email);
      if (emailIsNotValid) {
        return invalidEmailResponse();
      }
      
      const createdUser = await this.createUserUseCase.execute(params);
      

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