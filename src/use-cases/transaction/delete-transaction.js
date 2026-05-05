export class DeleteTransactionUseCase {
  constructor(postgresDeleteTransactionRepository) {
    this.postgresDeleteTransactionRepository = postgresDeleteTransactionRepository
  }
  
  async execute(transactionId) {
    const transaction = await this.postgresDeleteTransactionRepository.execute(transactionId)
    return transaction
  }
}