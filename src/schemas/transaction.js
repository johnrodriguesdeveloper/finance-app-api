import { z } from "zod"
import validator from 'validator'

export const createTransactionSchema = z.object({
  user_id: z.uuid(),
  name: z.string().trim().min(1, {
    message: 'Name is required'
  }),
  date: z.coerce.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date format'
  }),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    message: 'Type must be EXPENSE, EARNING or INVESTMENT'
  }),
  amount: z.number().min(0.01, {
    message: 'Amount must be greater than 0'
  }).refine( value => validator.isCurrency(value.toFixed(2), {
      decimal_digits: 2,
      allow_negatives: false,
      decimal_separator: '.'
    }), {
      message: 'Amount must be a valid currency'
    })
})