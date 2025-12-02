/**
 * Payload API Helper
 *
 * Provides functions to interact with Payload CMS collections.
 * These functions can be used as replacements for the legacy db.ts functions
 * during the migration period.
 */

import type { Payload } from 'payload'
import { getPayload } from '@/src/payload/get-payload'

// Re-export getPayload for convenience
export { getPayload }

/**
 * Get public artists with their portfolio images
 * Equivalent to legacy getPublicArtists()
 */
export async function getPublicArtistsFromPayload(filters?: {
  isActive?: boolean
  specialty?: string
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    const payload = await getPayload()

    const where: any = {}

    // Filter by active status
    if (filters?.isActive !== undefined) {
      where.isActive = { equals: filters.isActive }
    }

    // Filter by specialty
    if (filters?.specialty) {
      where.specialties = { contains: filters.specialty }
    }

    // Search by name
    if (filters?.search) {
      where.name = { like: `%${filters.search}%` }
    }

    const artists = await payload.find({
      collection: 'artists',
      where,
      limit: filters?.limit || 50,
      page: filters?.offset ? Math.floor(filters.offset / (filters.limit || 50)) + 1 : 1,
      depth: 2, // Include related documents
    })

    // Fetch portfolio images for each artist
    const artistsWithPortfolio = await Promise.all(
      artists.docs.map(async (artist) => {
        const portfolioImages = await payload.find({
          collection: 'portfolio-images',
          where: {
            artist: { equals: artist.id },
            isPublic: { equals: true },
          },
          sort: 'orderIndex',
          limit: 20,
        })

        return {
          ...artist,
          portfolioImages: portfolioImages.docs,
        }
      })
    )

    return artistsWithPortfolio
  } catch (error) {
    console.error('Error fetching artists from Payload:', error)
    throw error
  }
}

/**
 * Get a single artist by ID or slug
 * Equivalent to legacy getArtistByIdOrSlug()
 */
export async function getArtistFromPayload(idOrSlug: string) {
  try {
    const payload = await getPayload()

    // Try to find by ID first
    try {
      const artist = await payload.findByID({
        collection: 'artists',
        id: idOrSlug,
        depth: 2,
      })

      if (artist) {
        // Fetch portfolio images
        const portfolioImages = await payload.find({
          collection: 'portfolio-images',
          where: {
            artist: { equals: artist.id },
            isPublic: { equals: true },
          },
          sort: 'orderIndex',
          limit: 100,
        })

        return {
          ...artist,
          portfolioImages: portfolioImages.docs,
        }
      }
    } catch {
      // Not found by ID, try slug
    }

    // Try to find by slug
    const artistsBySlug = await payload.find({
      collection: 'artists',
      where: {
        slug: { equals: idOrSlug },
      },
      limit: 1,
      depth: 2,
    })

    if (artistsBySlug.docs.length > 0) {
      const artist = artistsBySlug.docs[0]

      // Fetch portfolio images
      const portfolioImages = await payload.find({
        collection: 'portfolio-images',
        where: {
          artist: { equals: artist.id },
          isPublic: { equals: true },
        },
        sort: 'orderIndex',
        limit: 100,
      })

      return {
        ...artist,
        portfolioImages: portfolioImages.docs,
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching artist from Payload:', error)
    throw error
  }
}

/**
 * Create a new artist
 * Equivalent to legacy createArtist()
 */
export async function createArtistInPayload(data: {
  userId: string
  name: string
  bio: string
  specialties?: string[]
  instagramHandle?: string | null
  hourlyRate?: number | null
  isActive?: boolean
}) {
  try {
    const payload = await getPayload()

    const artist = await payload.create({
      collection: 'artists',
      data: {
        user: data.userId,
        name: data.name,
        bio: data.bio,
        specialties: data.specialties || [],
        instagramHandle: data.instagramHandle || undefined,
        hourlyRate: data.hourlyRate || undefined,
        isActive: data.isActive ?? true,
      },
    })

    return artist
  } catch (error) {
    console.error('Error creating artist in Payload:', error)
    throw error
  }
}

/**
 * Update an artist
 * Equivalent to legacy updateArtist()
 */
export async function updateArtistInPayload(
  id: string,
  data: Partial<{
    name: string
    bio: string
    specialties: string[]
    instagramHandle: string | null
    hourlyRate: number | null
    isActive: boolean
  }>
) {
  try {
    const payload = await getPayload()

    const artist = await payload.update({
      collection: 'artists',
      id,
      data,
    })

    return artist
  } catch (error) {
    console.error('Error updating artist in Payload:', error)
    throw error
  }
}

/**
 * Get user by email
 * Equivalent to legacy getUserByEmail()
 */
export async function getUserByEmailFromPayload(email: string) {
  try {
    const payload = await getPayload()

    const users = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
      limit: 1,
    })

    return users.docs.length > 0 ? users.docs[0] : null
  } catch (error) {
    console.error('Error fetching user from Payload:', error)
    throw error
  }
}

/**
 * Get appointments for an artist
 */
export async function getArtistAppointmentsFromPayload(
  artistId: string,
  options?: {
    status?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }
) {
  try {
    const payload = await getPayload()

    const where: any = {
      artist: { equals: artistId },
    }

    if (options?.status) {
      where.status = { equals: options.status }
    }

    if (options?.startDate) {
      where.startTime = { greater_than_equal: options.startDate.toISOString() }
    }

    if (options?.endDate) {
      where.endTime = { less_than_equal: options.endDate.toISOString() }
    }

    const appointments = await payload.find({
      collection: 'appointments',
      where,
      sort: 'startTime',
      limit: options?.limit || 100,
      depth: 2,
    })

    return appointments.docs
  } catch (error) {
    console.error('Error fetching appointments from Payload:', error)
    throw error
  }
}

/**
 * Get site settings (singleton)
 */
export async function getSiteSettingsFromPayload() {
  try {
    const payload = await getPayload()

    const settings = await payload.find({
      collection: 'site-settings',
      limit: 1,
    })

    return settings.docs.length > 0 ? settings.docs[0] : null
  } catch (error) {
    console.error('Error fetching site settings from Payload:', error)
    throw error
  }
}

