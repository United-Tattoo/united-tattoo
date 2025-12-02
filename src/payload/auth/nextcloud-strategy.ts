/**
 * Nextcloud OAuth Strategy for Payload CMS
 *
 * Integrates Nextcloud OAuth authentication with Payload's auth system.
 * This strategy handles:
 * - User auto-provisioning based on Nextcloud groups
 * - Role assignment (SUPER_ADMIN, SHOP_ADMIN, ARTIST, CLIENT)
 * - Artist profile creation for users in the artists group
 */

import type { Payload } from 'payload'
import { UserRoles, type UserRole } from '../collections/Users.ts'

// Environment variables for Nextcloud OAuth
const NEXTCLOUD_BASE_URL = process.env.NEXTCLOUD_BASE_URL
const NEXTCLOUD_USERNAME = process.env.NEXTCLOUD_USERNAME
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD
const NEXTCLOUD_ARTISTS_GROUP = process.env.NEXTCLOUD_ARTISTS_GROUP || 'artists'
const NEXTCLOUD_ADMINS_GROUP = process.env.NEXTCLOUD_ADMINS_GROUP || 'shop_admins'

/**
 * Get Nextcloud user profile via OCS API
 */
export async function getNextcloudUserProfile(userId: string): Promise<{
  id: string
  enabled: boolean
  email: string
  displayname: string
  groups: string[]
  quota?: string
  lastLogin?: number
} | null> {
  if (!NEXTCLOUD_BASE_URL || !NEXTCLOUD_USERNAME || !NEXTCLOUD_PASSWORD) {
    console.warn('Nextcloud credentials not configured')
    return null
  }

  try {
    const url = `${NEXTCLOUD_BASE_URL}/ocs/v2.php/cloud/users/${encodeURIComponent(userId)}?format=json`
    const auth = Buffer.from(`${NEXTCLOUD_USERNAME}:${NEXTCLOUD_PASSWORD}`).toString('base64')

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`,
        'OCS-APIRequest': 'true',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch Nextcloud user: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data.ocs?.data || null
  } catch (error) {
    console.error('Error fetching Nextcloud user profile:', error)
    return null
  }
}

/**
 * Get user's Nextcloud groups
 */
export async function getNextcloudUserGroups(userId: string): Promise<string[]> {
  const profile = await getNextcloudUserProfile(userId)
  return profile?.groups || []
}

/**
 * Determine user role based on Nextcloud group membership
 */
export async function determineUserRole(userId: string): Promise<UserRole> {
  const groups = await getNextcloudUserGroups(userId)

  // Check for admin groups
  if (groups.includes('admin') || groups.includes('admins')) {
    return UserRoles.SUPER_ADMIN
  }

  // Check for shop admin group
  if (groups.includes(NEXTCLOUD_ADMINS_GROUP)) {
    return UserRoles.SHOP_ADMIN
  }

  // Check for artists group
  if (groups.includes(NEXTCLOUD_ARTISTS_GROUP)) {
    return UserRoles.ARTIST
  }

  // Default to client (will be rejected for OAuth login)
  return UserRoles.CLIENT
}

/**
 * Generate a unique slug from a name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Provision a user in Payload from Nextcloud OAuth data
 *
 * @param payload - Payload instance
 * @param nextcloudUserId - Nextcloud user ID
 * @param email - User email
 * @param displayName - User display name
 * @returns The created or existing Payload user
 */
export async function provisionPayloadUser(
  payload: Payload,
  nextcloudUserId: string,
  email: string,
  displayName: string
): Promise<{
  id: string
  email: string
  name: string
  role: UserRole
} | null> {
  try {
    // Determine role from Nextcloud groups
    const role = await determineUserRole(nextcloudUserId)

    // Prevent non-authorized users from signing in
    if (role === UserRoles.CLIENT) {
      console.warn(`User ${email} is not in an authorized Nextcloud group`)
      return null
    }

    // Check if user already exists by email
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existingUsers.docs.length > 0) {
      const existingUser = existingUsers.docs[0]
      console.log(`Existing user ${email} found in Payload`)

      // Update nextcloudId if not set
      if (!existingUser.nextcloudId) {
        await payload.update({
          collection: 'users',
          id: existingUser.id,
          data: {
            nextcloudId: nextcloudUserId,
          },
        })
      }

      return {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role as UserRole,
      }
    }

    // Create new user
    console.log(`Creating new Payload user for ${email} with role ${role}`)

    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        name: displayName,
        role,
        nextcloudId: nextcloudUserId,
        // Generate a random password since auth is via Nextcloud
        password: crypto.randomUUID(),
      },
    })

    // If artist, create artist profile
    if (role === UserRoles.ARTIST) {
      const baseSlug = generateSlug(displayName)
      let slug = baseSlug
      let counter = 1

      // Check for existing slugs and increment if needed
      let existingArtists = await payload.find({
        collection: 'artists',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })

      while (existingArtists.docs.length > 0) {
        slug = `${baseSlug}-${counter}`
        counter++
        existingArtists = await payload.find({
          collection: 'artists',
          where: {
            slug: {
              equals: slug,
            },
          },
          limit: 1,
        })
      }

      const artist = await payload.create({
        collection: 'artists',
        data: {
          user: newUser.id,
          name: displayName,
          slug,
          bio: '',
          specialties: [],
          isActive: true,
        },
      })

      console.log(`Created artist profile ${artist.id} for user ${newUser.id}`)
    }

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as UserRole,
    }
  } catch (error) {
    console.error('Error provisioning Payload user:', error)
    return null
  }
}

/**
 * Authenticate a user via Payload's local API
 * Used after Nextcloud OAuth completes to create a Payload session
 */
export async function authenticatePayloadUser(
  payload: Payload,
  email: string
): Promise<{
  token: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
  }
} | null> {
  try {
    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (users.docs.length === 0) {
      console.error(`User ${email} not found in Payload`)
      return null
    }

    const user = users.docs[0]

    // Generate a token for the user
    // Note: In production, you'd use Payload's login method with the user's credentials
    // Since we're using Nextcloud OAuth, we'll use the Local API to generate a token
    const result = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
        // We don't have the password, so we'll use a different approach
        // For now, we'll return the user data and handle session separately
      },
    })

    return {
      token: result.token || '',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
    }
  } catch (error) {
    console.error('Error authenticating Payload user:', error)
    return null
  }
}

