import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetUserBalanceRepository {
    async execute(userId) {
        const result = await PostgresHelper.query(
        `SELECT * FROM get_user_balance($1)`,
          [userId]
        )
        return {
          userId,
          ...result[0]
        }
    }
}
