import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { BcryptAdapter } from '../../adapters/bcrypt.js'

export class CreateUserUseCase {
  constructor(getUserByEmailRepository, createUserRepository, bcryptAdapter) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.createUserRepository = createUserRepository
    this.bcryptAdapter = bcryptAdapter instanceof BcryptAdapter ? bcryptAdapter : new BcryptAdapter()
  }

  async execute(createUserParams) {
    const userWithProviderEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email
    )
    
    if (userWithProviderEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const hashedPassword = await this.bcryptAdapter.hash(createUserParams.password)

    const userId = uuidv4()

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createdUser = await this.createUserRepository.execute(user)
    
    return createdUser
  }
}