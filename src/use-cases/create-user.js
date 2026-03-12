import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';
import { EmailAlreadyInUseError } from '../errors/user.js';
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';

export class CreateUserUseCase {
  constructor() {
    this.getUserByEmailRepository =  PostgresGetUserByEmailRepository
    this.createUserRepository = PostgresCreateUserRepository
  }
  
  async execute(createUserParams) {

   
    const userWithProviderEmail = await this.getUserByEmailRepository.execute(createUserParams.email)
    if (userWithProviderEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const userId = uuidv4()

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword
    }

    const createdUser = await this.createUserRepository.execute(user)
    return createdUser
  }
}