import { prisma } from "../../../../prisma/prisma.js";

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
      const { _sum: { amount: totalExpenses } } = await prisma.transaction.aggregate({
  where: {
    user_id: userId,
    type: 'EXPENSE',
  },
  _sum: {
    amount: true,
  },
})

const { _sum: { amount: totalEarnings } } = await prisma.transaction.aggregate({
  where: {
    user_id: userId,
    type: 'EARNING',
  },
  _sum: {
    amount: true,
  },
})

const { _sum: { amount: totalInvestments } } = await prisma.transaction.aggregate({
  where: {
    user_id: userId,
    type: 'INVESTMENT',
  },
  _sum: {
    amount: true,
  },
})
  const _totalEarning = totalEarnings || 0
  const _totalExpense = totalExpenses || 0
  const _totalInvestment = totalInvestments || 0

const balance = _totalEarning - _totalExpense - _totalInvestment
      return {
        earnings: _totalEarning,
        expenses: _totalExpense,
        investments: _totalInvestment,
        balance: balance
      }
    }
}
