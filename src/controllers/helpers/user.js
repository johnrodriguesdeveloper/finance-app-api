

import { badRequest, notFound } from "./http.js"




export const invalidIdRequiredResponse = () => {
  return badRequest({ message: 'User ID is required and must be a valid UUID' })
}

export const userNotFoundResponse = () => {
  return notFound({ message: 'User not found' })
}




