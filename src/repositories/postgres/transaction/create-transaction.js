import { prisma } from '../../../db/prisma/client.js'

export class PostgresCreateTransactionRepository {
  async execute(createTransactionParams) {
    return await prisma.transaction.create({
      data: createTransactionParams
    })
  }
}