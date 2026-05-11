import { prisma } from "../../../../prisma/prisma.js";

export class PostgresDeleteUser {
  async execute(userId) {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    })
    return deletedUser
  }
  
}