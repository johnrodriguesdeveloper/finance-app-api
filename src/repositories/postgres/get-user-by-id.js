import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresGetUserByIdRepository {
  async execute(userId) {
    const result = await PostgresHelper.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )
    
    return result[0]
  }
}