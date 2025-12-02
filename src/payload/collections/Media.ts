/**
 * Media Collection for Payload CMS
 *
 * Handles general file uploads to Cloudflare R2
 * Used for avatars, site images, and other media
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

export const Media: CollectionConfig = {
  slug: 'media',

  // Enable file uploads
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 400,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },

  // Admin panel configuration
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    group: 'Media',
    description: 'General media files and images',
  },

  // Access control
  access: {
    // Public read access
    read: () => true,

    // Authenticated users can upload
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.ARTIST)
    },

    // Only admins can update/delete
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },

    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },
  },

  // Fields
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],

  // Hooks
  hooks: {
    // Track who uploaded the file
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.uploadedBy = req.user.id
        }
        return data
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

