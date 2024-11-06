import { z } from 'zod';

export const userCreateSchema = z.object({
  username: z
    .string({ required_error: 'username is required' })
    .trim()
    .min(1, 'username is required'),
  key: z
    .string({ required_error: 'key is required' })
    .trim()
    .min(1, 'key is required'),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>
