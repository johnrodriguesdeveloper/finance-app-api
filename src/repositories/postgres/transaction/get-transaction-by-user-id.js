import { prisma } from '../../../db/prisma/client.js'

export class PostgresGetTransactionByUserIdRepository {
    async execute(userId){
      return await prisma.transaction.findMany({
        where: {
          user_id: userId
        }
      })
    }
}