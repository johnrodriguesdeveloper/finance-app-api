import { serverError, checkIfIdIsValid, ok, invalidIdRequiredResponse, userNotFoundResponse } from "./helpers/index.js"
import { DeleteUserUseCase } from "../use-cases/delete-user.js"

export class DeleteUserController {
  async execute(req, res) {
    try {
      const userId = req.params.userId

      const idIsValid = checkIfIdIsValid(userId)
      
      if (!idIsValid) {
        return invalidIdRequiredResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()
      const deletedUser = await deleteUserUseCase.execute(userId)

      if (!deletedUser) {
        return userNotFoundResponse()
      }

      return ok(deletedUser)
    } catch (error) {
      console.error(error)
      return serverError(res)
    }
  }
}