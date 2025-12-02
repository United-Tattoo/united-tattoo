/**
 * Artists Collection for Payload CMS
 *
 * Maps to existing 'artists' table in Cloudflare D1
 * Artist profiles linked to user accounts with portfolio management
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

// Predefined tattoo specialties
const TATTOO_SPECIALTIES = [
  'blackwork',
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
  'color',
  'black-and-gray',
  'cover-up',
  'lettering',
  'script',
  'floral',
  'animal',
  'custom',
]

/**
 * Generate URL-friendly slug from name
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Artists: CollectionConfig = {
  slug: 'artists',

  // Admin panel configuration
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'isActive', 'hourlyRate', 'createdAt'],
    group: 'Content',
    description: 'Tattoo artist profiles and information',
  },

  // Access control
  access: {
    // Public read access for active artists
    read: ({ req: { user } }) => {
      // Admins can see all artists
      if (user && hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) {
        return true
      }
      // Public can only see active artists
      return {
        isActive: {
          equals: true,
        },
      }
    },

    // Only admins can create artists
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },

    // Artists can update their own profile, admins can update all
    update: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true
      // Artists can only update their own profile
      if (user.role === UserRoles.ARTIST) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },

    // Only admins can delete artists
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },
  },

  // Fields matching existing database schema
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'Linked user account for authentication',
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Artist display name',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (auto-generated from name)',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from name if not provided
            if (!value && data?.name) {
              return generateSlug(data.name)
            }
            return value
          },
        ],
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Artist biography and description',
      },
    },
    {
      name: 'specialties',
      type: 'select',
      hasMany: true,
      options: TATTOO_SPECIALTIES.map((specialty) => ({
        label: specialty.charAt(0).toUpperCase() + specialty.slice(1).replace(/-/g, ' '),
        value: specialty,
      })),
      admin: {
        description: 'Tattoo styles and specializations',
      },
    },
    {
      name: 'instagramHandle',
      type: 'text',
      admin: {
        description: 'Instagram username (without @)',
      },
      validate: (value: string | null | undefined) => {
        if (value && value.startsWith('@')) {
          return 'Please enter the handle without the @ symbol'
        }
        return true
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the artist is currently active at the studio',
        position: 'sidebar',
      },
    },
    {
      name: 'hourlyRate',
      type: 'number',
      admin: {
        description: 'Hourly rate in USD',
        step: 5,
      },
      min: 0,
    },
    // Virtual field for portfolio images count (populated via hooks)
    {
      name: 'portfolioCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of portfolio images',
        position: 'sidebar',
      },
      access: {
        create: () => false,
        update: () => false,
      },
    },
  ],

  // Hooks for custom behavior
  hooks: {
    // Auto-generate unique slug before create
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && data.name && !data.slug) {
          const baseSlug = generateSlug(data.name)
          let slug = baseSlug
          let counter = 1

          // Check for existing slugs and increment if needed
          const payload = req.payload
          let existing = await payload.find({
            collection: 'artists',
            where: {
              slug: {
                equals: slug,
              },
            },
            limit: 1,
          })

          while (existing.docs.length > 0) {
            slug = `${baseSlug}-${counter}`
            counter++
            existing = await payload.find({
              collection: 'artists',
              where: {
                slug: {
                  equals: slug,
                },
              },
              limit: 1,
            })
          }

          data.slug = slug
        }
        return data
      },
    ],
    // Update portfolio count after read
    afterRead: [
      async ({ doc, req }) => {
        try {
          const portfolioImages = await req.payload.find({
            collection: 'portfolio-images',
            where: {
              artist: {
                equals: doc.id,
              },
            },
            limit: 0, // Just get the count
          })
          doc.portfolioCount = portfolioImages.totalDocs
        } catch (error) {
          // Portfolio collection might not exist yet
          doc.portfolioCount = 0
        }
        return doc
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

