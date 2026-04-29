import { badRequest } from "./http.js"
import validator from "validator"

export const checkIfIdIsValid = (id) => {
  return validator.isUUID(id)
}

export const requiredFieldResponse = (field) => {
  return badRequest({ message: `The field ${field} is required` })
}

export const invalidIdResponse = () => {
  return badRequest({ message: 'The provided ID is not valid' })
}

export const checkIfIsString = (value) => {
  return typeof value === 'string'
}

export const validateRequiredFields = (params, requiredFields) => {

  for (const field of requiredFields) {

    const fieldIsMissing = !params[field]
    const fieldIsEmpty = checkIfIsString(params[field]) && validator.isEmpty(params[field],{
      ignore_whitespace: true
    })

    if (fieldIsMissing || fieldIsEmpty) {
      return {
        field,
        message: `Missing param: ${field}`,
        ok: false
      }
    }
  }
  return { ok: true,
    message: 'All required fields are present'
   }
}