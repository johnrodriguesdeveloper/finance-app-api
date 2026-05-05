import validator from 'validator'
import { badRequest, notFound } from './http.js'

export const checkIfAmountIsValid = (amount) => {
  if (typeof amount !== 'number') {
    return false
  }
  return validator.isCurrency(amount.toFixed(2), {
    decimal_digits: 2,
    allow_negatives: false,
    decimal_separator: '.'
  })
}

export const checkIfTypeIsValid = (type) => 
  ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmountResponse = () => {
  return badRequest({ message: 'Invalid amount' })
}
export const invalidTypeResponse = () => {
  return badRequest({ message: 'Invalid type' })
}

export const transactionNotFoundResponse = () => {
  return notFound({ message: 'Transaction not found' })
}
