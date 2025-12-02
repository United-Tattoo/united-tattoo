/**
 * Portfolio Images Collection for Payload CMS
 *
 * Maps to existing 'portfolio_images' table in Cloudflare D1
 * Artist portfolio work images with tags and ordering
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

// Common portfolio image tags
const PORTFOLIO_TAGS = [
  'black-and-gray',
  'color',
  'sleeve',
  'arm',
  'leg',
  'back',
  'chest',
  'hand',
  'foot',
  'neck',
  'traditional',
  'neo-traditional',
  'realism',
  'portrait',
  'geometric',
  'watercolor',
  'japanese',
  'tribal',
  'minimalist',
  'dotwork',
  'linework',
  'cover-up',
  'lettering',
  'floral',
  'animal',
  'custom',
  '2023',
  '2024',
  '2025',
]

export const PortfolioImages: CollectionConfig = {
  slug: 'portfolio-images',

  // Enable file uploads
  upload: {
    staticDir: 'portfolio',
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
    useAsTitle: 'caption',
    defaultColumns: ['filename', 'artist', 'caption', 'isPublic', 'orderIndex', 'createdAt'],
    group: 'Content',
    description: 'Artist portfolio images and tattoo work',
  },

  // Access control
  access: {
    // Public can see public images, admins can see all
    read: ({ req: { user } }) => {
      if (user && hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) {
        return true
      }
      return {
        isPublic: {
          equals: true,
        },
      }
    },

    // Artists can upload their own images, admins can upload for anyone
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.ARTIST)
    },

    // Artists can update their own images, admins can update all
    update: async ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true

      // Artists can only update their own portfolio images
      if (user.role === UserRoles.ARTIST) {
        // Get the artist record for this user
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

    // Artists can delete their own images, admins can delete all
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
        description: 'Artist who created this work',
        position: 'sidebar',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Image description or caption',
      },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: PORTFOLIO_TAGS.map((tag) => ({
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
        description: 'Display order in portfolio (lower numbers first)',
        position: 'sidebar',
      },
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this image is publicly visible',
        position: 'sidebar',
      },
    },
  ],

  // Hooks
  hooks: {
    // Validate artist ownership for non-admin users
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          // If user is an artist, automatically set their artist ID
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

