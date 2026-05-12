import { prisma } from '../../../db/prisma/client.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        return await prisma.transaction.delete({
            where: {
                id: transactionId
            }
        })
    }
}
