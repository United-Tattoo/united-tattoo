/**
 * Flash Items Collection for Payload CMS
 *
 * Maps to existing 'flash_items' table in Cloudflare D1
 * Pre-designed tattoo flash available for booking
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

// Common flash tags
const FLASH_TAGS = [
  'flash',
  'small',
  'medium',
  'large',
  'color',
  'black-and-gray',
  'traditional',
  'neo-traditional',
  'minimalist',
  'floral',
  'animal',
  'geometric',
  'lettering',
  'custom',
  'available',
  'sold',
]

export const FlashItems: CollectionConfig = {
  slug: 'flash-items',

  // Enable file uploads
  upload: {
    staticDir: 'flash',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'full',
        width: 1200,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['filename', 'title', 'artist', 'price', 'isAvailable', 'createdAt'],
    group: 'Content',
    description: 'Pre-designed tattoo flash designs',
  },

  // Access control
  access: {
    // Public can see available flash, admins can see all
    read: ({ req: { user } }) => {
      if (user && hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) {
        return true
      }
      return {
        isAvailable: {
          equals: true,
        },
      }
    },

    // Artists can upload flash, admins can upload for anyone
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.ARTIST)
    },

    // Artists can update their own flash, admins can update all
    update: async ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true

      if (user.role === UserRoles.ARTIST) {
        try {
          const artists = await req.payload.find({
            collection: 'artists',
            where: {
              user: {
                equals: user.id,
              },
            },
            limit: 1,
          })
          if (artists.docs.length > 0) {
            return {
              artist: {
                equals: artists.docs[0].id,
              },
            }
          }
        } catch {
          return false
        }
      }
      return false
    },

    // Artists can delete their own flash, admins can delete all
    delete: async ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true

      if (user.role === UserRoles.ARTIST) {
        try {
          const artists = await req.payload.find({
            collection: 'artists',
            where: {
              user: {
                equals: user.id,
              },
            },
            limit: 1,
          })
          if (artists.docs.length > 0) {
            return {
              artist: {
                equals: artists.docs[0].id,
              },
            }
          }
        } catch {
          return false
        }
      }
      return false
    },
  },

  // Fields matching existing database schema
  fields: [
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
      admin: {
        description: 'Artist who designed this flash',
        position: 'sidebar',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Flash design title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Design description',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Price in cents (e.g., 15000 = $150)',
      },
      min: 0,
    },
    {
      name: 'sizeHint',
      type: 'text',
      admin: {
        description: 'Suggested size (e.g., "3x3 inches")',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: FLASH_TAGS.map((tag) => ({
        label: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '),
        value: tag,
      })),
      admin: {
        description: 'Tags for categorization and filtering',
      },
    },
    {
      name: 'orderIndex',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers first)',
        position: 'sidebar',
      },
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this flash is available for booking',
        position: 'sidebar',
      },
    },
  ],

  // Hooks
  hooks: {
    // Auto-assign artist for artist users
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          if (req.user.role === UserRoles.ARTIST && !data.artist) {
            const artists = await req.payload.find({
              collection: 'artists',
              where: {
                user: {
                  equals: req.user.id,
                },
              },
              limit: 1,
            })
            if (artists.docs.length > 0) {
              data.artist = artists.docs[0].id
            }
          }
        }
        return data
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

