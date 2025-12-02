import { z } from "zod"

/**
 * Zod schemas for Artist entities
 * Used for runtime validation of API responses and form data
 */

// Portfolio Image schema
export const portfolioImageSchema = z.object({
  id: z.string(),
  artistId: z.string(),
  url: z.string().url(),
  caption: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  orderIndex: z.number().int().default(0),
  isPublic: z.boolean().default(true),
  createdAt: z.coerce.date(),
})

export type PortfolioImageSchema = z.infer<typeof portfolioImageSchema>

// Flash Item schema
export const flashItemSchema = z.object({
  id: z.string(),
  artistId: z.string(),
  url: z.string().url(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  sizeHint: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  orderIndex: z.number().int().default(0),
  isAvailable: z.boolean().default(true),
  createdAt: z.coerce.date(),
})

export type FlashItemSchema = z.infer<typeof flashItemSchema>

// Base Artist schema
export const artistSchema = z.object({
  id: z.string(),
  userId: z.string(),
  slug: z.string(),
  name: z.string().min(1),
  bio: z.string(),
  specialties: z.array(z.string()),
  instagramHandle: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  hourlyRate: z.number().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ArtistSchema = z.infer<typeof artistSchema>

// Artist with Portfolio schema
export const artistWithPortfolioSchema = artistSchema.extend({
  portfolioImages: z.array(portfolioImageSchema).default([]),
  flashItems: z.array(flashItemSchema).optional(),
  availability: z.array(z.object({
    id: z.string(),
    artistId: z.string(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isActive: z.boolean(),
  })).default([]),
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().nullable().optional(),
  }).optional(),
})

export type ArtistWithPortfolioSchema = z.infer<typeof artistWithPortfolioSchema>

// Public Artist schema (for API responses)
export const publicArtistSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  bio: z.string(),
  specialties: z.array(z.string()),
  instagramHandle: z.string().nullable().optional(),
  isActive: z.boolean(),
  hourlyRate: z.number().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  portfolioImages: z.array(portfolioImageSchema).default([]),
})

export type PublicArtistSchema = z.infer<typeof publicArtistSchema>

// Input schemas for creating/updating artists
export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  instagramHandle: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  isActive: z.boolean().optional().default(true),
  userId: z.string().optional(),
  email: z.string().email().optional(),
})

export type CreateArtistInput = z.infer<typeof createArtistSchema>

export const updateArtistSchema = createArtistSchema.partial().extend({
  id: z.string().optional(), // Optional for backward compatibility
})

export type UpdateArtistInput = z.infer<typeof updateArtistSchema>

// API response schema for list of artists
export const artistsListResponseSchema = z.object({
  artists: z.array(publicArtistSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    hasMore: z.boolean(),
  }),
  filters: z.object({
    isActive: z.boolean().optional(),
    specialty: z.string().nullable().optional(),
    search: z.string().nullable().optional(),
  }),
})

export type ArtistsListResponse = z.infer<typeof artistsListResponseSchema>

/**
 * Validate and parse artist data from API response
 */
export function parseArtist(data: unknown): ArtistWithPortfolioSchema {
  return artistWithPortfolioSchema.parse(data)
}

/**
 * Safely parse artist data, returning null on failure
 */
export function safeParseArtist(data: unknown): ArtistWithPortfolioSchema | null {
  const result = artistWithPortfolioSchema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validate artists list API response
 */
export function parseArtistsList(data: unknown): ArtistsListResponse {
  return artistsListResponseSchema.parse(data)
}

