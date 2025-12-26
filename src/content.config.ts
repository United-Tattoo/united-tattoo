import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artists = defineCollection({
  loader: glob({
    base: './src/content/artists',
    pattern: '**/*.mdx'
  }),
  schema: z.object({
    name: z.string(),
    portrait: z.string(),
    galleryDir: z.string(),
    specialties: z.array(z.string()).optional(),
    instagram: z.string().optional(),
    bookingEmailCc: z.string().email().optional(),
  }),
});

export const collections = { artists };

