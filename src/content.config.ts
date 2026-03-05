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
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    twitch: z.string().optional(),
    portfolioUrl: z.string().url().optional(),
    bookingEmailCc: z.string().email().optional(),
    testimonials: z.array(z.object({
      quote: z.string(),
      client: z.string(),
    })).optional(),
    // Calendar Integration Fields
    calendarId: z.string().optional(), // Nextcloud calendar identifier
    acceptingBookings: z.boolean().default(true),
    schedule: z.object({
      monday: z.union([z.string(), z.literal("closed")]),
      tuesday: z.union([z.string(), z.literal("closed")]),
      wednesday: z.union([z.string(), z.literal("closed")]),
      thursday: z.union([z.string(), z.literal("closed")]),
      friday: z.union([z.string(), z.literal("closed")]),
      saturday: z.union([z.string(), z.literal("closed")]),
      sunday: z.union([z.string(), z.literal("closed")]),
    }).optional(),
    bufferMinutes: z.number().default(30),
  }),
});

export const collections = { artists };

