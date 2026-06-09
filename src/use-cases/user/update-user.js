export class UpdateUserUseCase {
  constructor(getUserByEmailRepository, updateUserRepository, bcryptAdapter) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
    this.bcryptAdapter = bcryptAdapter
  }


  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email
      )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new Error('Email already exists')
      }
    }

    const user = { ...updateUserParams }

    if (updateUserParams.password) {
      const hashedPassword = await this.bcryptAdapter.hash(updateUserParams.password)
      user.password = hashedPassword
    }

    const updatedUser = await this.updateUserRepository.execute(userId, user)

    return updatedUser
  }
}