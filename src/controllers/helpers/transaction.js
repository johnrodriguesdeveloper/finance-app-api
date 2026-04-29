import validator from 'validator'

export const checkIfAmountIsValid = (amount) => {
  return validator.isCurrency(amount.toString(), {
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
