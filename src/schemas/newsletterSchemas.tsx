import { z } from 'zod';

export const FrameworksSchema = z.enum(['React', 'Vue', 'Angular', 'Svelte']);

export const newsletterFormSchema = z.object({
  email: z.string().email('Invalid email value'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().max(50).optional(),
  framework: FrameworksSchema,
});

export type NewsletterFormSchema = z.infer<typeof newsletterFormSchema>;
