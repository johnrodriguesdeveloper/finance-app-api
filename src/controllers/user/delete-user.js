import { serverError, checkIfIdIsValid, ok, invalidIdRequiredResponse, userNotFoundResponse } from "../helpers/index.js"


export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async execute(req, res) {
    try {
      const userId = req.params.userId

      const idIsValid = checkIfIdIsValid(userId)
      
      if (!idIsValid) {
        return invalidIdRequiredResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId)

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