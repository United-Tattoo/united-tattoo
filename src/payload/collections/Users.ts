/**
 * Users Collection for Payload CMS
 *
 * Maps to existing 'users' table in Cloudflare D1
 * Handles authentication and role-based access control
 *
 * Role hierarchy: CLIENT (0) < ARTIST (1) < SHOP_ADMIN (2) < SUPER_ADMIN (3)
 */

import type { CollectionConfig } from 'payload'

export const UserRoles = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SHOP_ADMIN: 'SHOP_ADMIN',
  ARTIST: 'ARTIST',
  CLIENT: 'CLIENT',
} as const

export type UserRole = typeof UserRoles[keyof typeof UserRoles]

// Role hierarchy for permission checking
const roleHierarchy: Record<UserRole, number> = {
  CLIENT: 0,
  ARTIST: 1,
  SHOP_ADMIN: 2,
  SUPER_ADMIN: 3,
}

/**
 * Check if a user has at least the required role level
 */
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const Users: CollectionConfig = {
  slug: 'users',

  // Enable authentication
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
    group: 'Admin',
    description: 'User accounts for authentication and access control',
  },

  // Access control
  access: {
    // Anyone can create (for registration) - but we'll restrict via hooks
    create: () => true,

    // Users can read their own data, admins can read all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true
      return {
        id: {
          equals: user.id,
        },
      }
    },

    // Users can update their own data, admins can update all
    update: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true
      return {
        id: {
          equals: user.id,
        },
      }
    },

    // Only super admins can delete users
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SUPER_ADMIN)
    },

    // Admin panel access
    admin: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.ARTIST)
    },
  },

  // Fields matching existing database schema
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the user',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: UserRoles.CLIENT,
      options: [
        { label: 'Super Admin', value: UserRoles.SUPER_ADMIN },
        { label: 'Shop Admin', value: UserRoles.SHOP_ADMIN },
        { label: 'Artist', value: UserRoles.ARTIST },
        { label: 'Client', value: UserRoles.CLIENT },
      ],
      admin: {
        description: 'User role determines access level',
        position: 'sidebar',
      },
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => {
          if (!user) return false
          return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile picture',
      },
    },
    // Nextcloud integration fields
    {
      name: 'nextcloudId',
      type: 'text',
      unique: true,
      admin: {
        description: 'Nextcloud user ID for OAuth integration (optional - auto-populated on Nextcloud login)',
        position: 'sidebar',
      },
      // Allow admins to edit, but typically auto-populated via OAuth
      access: {
        update: ({ req: { user } }) => {
          if (!user) return true // Allow during first user creation
          return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
        },
      },
    },
  ],

  // Hooks for custom behavior
  hooks: {
    // Before creating a user, validate role assignment
    beforeChange: [
      async ({ data, req, operation, context }) => {
        // If creating a new user without admin permissions, force CLIENT role
        // EXCEPT: Allow first user creation (no users exist yet)
        if (operation === 'create') {
          const user = req.user

          // Check if this is the first user being created
          const payload = req.payload
          const existingUsers = await payload.find({
            collection: 'users',
            limit: 1,
          })

          const isFirstUser = existingUsers.totalDocs === 0

          // Allow first user to set their own role, otherwise enforce permissions
          if (!isFirstUser && (!user || !hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN))) {
            data.role = UserRoles.CLIENT
          }
        }
        return data
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

