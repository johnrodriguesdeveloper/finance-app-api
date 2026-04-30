import { PostgresGetTransactionByUserIdRepository } from "../../repositories/postgres/transaction/get-transaction-by-user-id.js";
import { PostgresGetUserByIdRepository } from "../../repositories/postgres/user/get-user-by-id.js";
import { userNotFoundResponse } from "../helpers/user.js";

export class GetTransactionByUserId {
  constructor() {
    this.getTransactionByUserIdRepository = new PostgresGetTransactionByUserIdRepository();
    this.getUserByIdRepository = new PostgresGetUserByIdRepository();
  }
    async execute(params) {
      const user = await this.getUserByIdRepository.execute(params.userId);
      if (!user) {
        return userNotFoundResponse()
      }
      const transactions = await this.getTransactionByUserIdRepository.execute(params.userId);
      return transactions
    }
}