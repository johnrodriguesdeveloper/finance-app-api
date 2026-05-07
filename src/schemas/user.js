import { z } from 'zod'

export const createUserSchema = z.object({
        first_name: z.string({
          message: 'First name is required'
        }).trim().min(1, {
          message: 'First name is required'
        }),
        last_name: z.string({
          message: 'Last name is required'
        }).trim().min(1, {
          message: 'Last name is required'
        }),
        email: z.email({
          message: 'Email must be a valid email address'
        }).trim(),
        password: z.string({
          message: 'Password is required'
        }).trim().min(6,{
          message: 'Password must be at least 6 characters long'
        }),
      })
export const updateUserSchema = createUserSchema.partial().strict({
  message: 'No additional fields allowed'
})