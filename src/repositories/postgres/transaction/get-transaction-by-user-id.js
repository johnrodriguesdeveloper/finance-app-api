import { TransactionRepository } from "../transaction.js";

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId){
      const transactionRepository = new TransactionRepository();
      const transactions = await transactionRepository.query('SELECT * FROM transactions WHERE user_id = $1',[userId]);
      return transactions;
    }
}