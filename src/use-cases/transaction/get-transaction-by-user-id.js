import { PostgresGetTransactionByUserIdRepository } from "../../repositories/postgres/transaction/get-transaction-by-user-id.js";
import { PostgresGetUserByIdRepository } from "../../repositories/postgres/user/get-user-by-id.js";

export class GetTransactionByUserId {
  constructor() {
    this.getTransactionByUserIdRepository = new PostgresGetTransactionByUserIdRepository();
    this.getUserByIdRepository = new PostgresGetUserByIdRepository();
  }
    async execute(params) {
      const user = await this.getUserByIdRepository.execute(params.userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transactions = await this.getTransactionByUserIdRepository.execute(params.userId);
      return transactions
    }
}