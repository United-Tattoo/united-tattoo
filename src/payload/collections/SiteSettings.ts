/**
 * Site Settings Collection for Payload CMS
 *
 * Maps to existing 'site_settings' table in Cloudflare D1
 * Global configuration for the studio (singleton pattern)
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',

  // Admin panel configuration
  admin: {
    useAsTitle: 'studioName',
    group: 'Admin',
    description: 'Global studio configuration and settings',
  },

  // Access control - only super admins can modify
  access: {
    // Public read access for site info
    read: () => true,

    // Only super admins can create (should only be one record)
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SUPER_ADMIN)
    },

    // Only super admins can update
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SUPER_ADMIN)
    },

    // Only super admins can delete
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SUPER_ADMIN)
    },
  },

  // Fields matching existing database schema
  fields: [
    // Basic Information
    {
      name: 'studioName',
      type: 'text',
      required: true,
      defaultValue: 'United Tattoo Studio',
      admin: {
        description: 'Studio display name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Premier tattoo studio specializing in custom artwork and professional tattooing services.',
      admin: {
        description: 'Studio description for SEO and about sections',
      },
    },

    // Contact Information
    {
      type: 'group',
      name: 'contact',
      label: 'Contact Information',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
          defaultValue: '123 Main Street, Fountain, CO 80817',
          admin: {
            description: 'Physical studio address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '+1 (555) 123-4567',
          admin: {
            description: 'Contact phone number',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          defaultValue: 'info@united-tattoos.com',
          admin: {
            description: 'Contact email address',
          },
        },
      ],
    },

    // Social Media
    {
      type: 'group',
      name: 'socialMedia',
      label: 'Social Media Links',
      fields: [
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram URL',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook URL',
          },
        },
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X URL',
          },
        },
        {
          name: 'tiktok',
          type: 'text',
          admin: {
            description: 'TikTok URL',
          },
        },
      ],
    },

    // Business Hours
    {
      name: 'businessHours',
      type: 'array',
      label: 'Business Hours',
      admin: {
        description: 'Weekly business hours schedule',
      },
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Sunday', value: 'Sunday' },
            { label: 'Monday', value: 'Monday' },
            { label: 'Tuesday', value: 'Tuesday' },
            { label: 'Wednesday', value: 'Wednesday' },
            { label: 'Thursday', value: 'Thursday' },
            { label: 'Friday', value: 'Friday' },
            { label: 'Saturday', value: 'Saturday' },
          ],
        },
        {
          name: 'openTime',
          type: 'text',
          admin: {
            description: 'Opening time (HH:mm format)',
          },
        },
        {
          name: 'closeTime',
          type: 'text',
          admin: {
            description: 'Closing time (HH:mm format)',
          },
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Is the studio closed on this day?',
          },
        },
      ],
      defaultValue: [
        { day: 'Monday', openTime: '10:00', closeTime: '18:00', isClosed: false },
        { day: 'Tuesday', openTime: '10:00', closeTime: '18:00', isClosed: false },
        { day: 'Wednesday', openTime: '10:00', closeTime: '18:00', isClosed: false },
        { day: 'Thursday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'Friday', openTime: '10:00', closeTime: '20:00', isClosed: false },
        { day: 'Saturday', openTime: '11:00', closeTime: '17:00', isClosed: false },
        { day: 'Sunday', openTime: null, closeTime: null, isClosed: true },
      ],
    },

    // Media
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero section background image',
      },
    },
    {
      name: 'logoUrl',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Studio logo',
      },
    },
  ],

  // Hooks to ensure singleton pattern
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // If creating, check if a settings record already exists
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'site-settings',
            limit: 1,
          })
          if (existing.docs.length > 0) {
            throw new Error('Site settings already exist. Please update the existing record.')
          }
        }
        return data
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

