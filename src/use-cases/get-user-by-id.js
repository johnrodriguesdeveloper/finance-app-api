
export class GetUserByIdUseCase {

    constructor() {
        this.getUserByIdRepository =  getUserByIdRepository
    }
    
    async execute(userId) {
        const user = await this.getUserByIdRepository.execute(userId)
        return user
    }
}