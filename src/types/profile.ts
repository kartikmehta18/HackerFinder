
import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  bio: z.string().max(160, 'Bio must be 160 characters or less').optional(),
  location: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  avatar_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  skills: z.string().optional().transform((val) => {
    if (!val) return [] as string[];
    return val.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  })
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
