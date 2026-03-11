import { PostgresHelper } from '../../db/postgres/helper.js'


export class UpdateUserRepository {
  async execute(userId,updateParams) {
      const updateFields = [] 
      const updateValues = []

      Object.keys(updateParams).forEach(key => {
       updateFields.push(`${key} = $${updateFields.length + 1}`)
       updateValues.push(updateParams[key]) 
      })
      updateValues.push(userId)

      const updateQuery= `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${updateFields.length + 1}
        RETURNING * 
      `

      const updateUser = await PostgresHelper.query(updateQuery, updateValues)
      return updateUser[0]
  }   
}
