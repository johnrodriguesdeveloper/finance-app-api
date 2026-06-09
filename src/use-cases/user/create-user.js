import { EmailAlreadyInUseError } from '../../errors/user.js'
import { BcryptAdapter } from '../../adapters/bcrypt.js'

export class CreateUserUseCase {
  constructor(getUserByEmailRepository, createUserRepository, bcryptAdapter, idGeneratorAdapter) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.createUserRepository = createUserRepository
    this.bcryptAdapter = bcryptAdapter instanceof BcryptAdapter ? bcryptAdapter : new BcryptAdapter()
    this.idGeneratorAdapter = idGeneratorAdapter
  }

  async execute(createUserParams) {
    const userWithProviderEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email
    )
    
    if (userWithProviderEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const hashedPassword = await this.bcryptAdapter.hash(createUserParams.password)

    const userId = this.idGeneratorAdapter.execute()

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createdUser = await this.createUserRepository.execute(user)
    
    return createdUser
  }
}