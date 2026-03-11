import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import bcrypt from 'bcrypt'
import { UpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository = new PostgresGetUserByEmailRepository()
      const userWithProvidedEmail = await postgresGetUserByEmailRepository.execute(
        updateUserParams.email
      )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new Error('Email already exists')
      }
    }

    const user = { ...updateUserParams }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashedPassword
    }

    const updateUserRepository = new UpdateUserRepository()
    const updatedUser = await updateUserRepository.execute(userId, user)

    return updatedUser
  }
}