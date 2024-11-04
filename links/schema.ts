import { z } from 'zod';

export const linksCreateSchema = z.object({
  title: z
    .string({ required_error: 'link title is required' })
    .min(1, 'link title is required'),
  link: z
    .string({ required_error: 'link is required' })
    .url('this is not valid url')
    .min(1, 'link is required'),
});

export type LinkCreateSchema = z.infer<typeof linksCreateSchema>;
