import { PostgresGetUserByEmailRepository } from "../repositories/postgres/get-user-by-email.js";
import bcrypt from "bcrypt";
import { PostgresUpdateUserRepository } from "../repositories/postgres/update-user.js";

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
      if(updateUserParams.email) {

        const PostgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository()

        const userWithProvidedEmail = await PostgresGetUserByEmailRepository.execute(updateUserParams.email)

        if(userWithProvidedEmail) {
          throw new Error('Email already exists')
        }

        const user = {
          ...updateUserParams
        }

        if(updateUserParams.password) {
          const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
          updateUserParams.password = hashedPassword

          user.password = hashedPassword
        }


        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = await postgresUpdateUserRepository.execute(userId, user)

        return updatedUser 
      }
  } 
}