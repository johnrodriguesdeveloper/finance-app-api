

import { badRequest } from "./http.js"
import validator from "validator"

export const invalidPasswordResponse = () => {
  return badRequest({ message: 'Password must be at least 6 characters long' })
}

export const invalidEmailResponse = () => {
  return badRequest({ message: 'Invalid email format' })
}

export const invalidIdRequiredResponse = () => {
  return badRequest({ message: 'User ID is required and must be a valid UUID' })
}

export const checkIfPasswordIsValid = (password) => {
  return password.length < 6
}

export const checkIfEmailIsValid = (email) => {
  return !validator.isEmail(email)
}