/**
 * Artist Calendars Collection for Payload CMS
 *
 * Maps to existing 'artist_calendars' table in Cloudflare D1
 * Per-artist CalDAV configuration for Nextcloud integration
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

export const ArtistCalendars: CollectionConfig = {
  slug: 'artist-calendars',

  // Admin panel configuration
  admin: {
    useAsTitle: 'calendarId',
    defaultColumns: ['artist', 'calendarId', 'lastSyncAt', 'createdAt'],
    group: 'Admin',
    description: 'CalDAV calendar configurations for artists',
  },

  // Access control - admin only
  access: {
    // Only admins can read calendar configs
    read: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },

    // Only admins can create
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },

    // Only admins can update
    update: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
    },

    // Only super admins can delete
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SUPER_ADMIN)
    },
  },

  // Fields matching existing database schema
  fields: [
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      required: true,
      unique: true,
      admin: {
        description: 'Artist this calendar belongs to (one calendar per artist)',
      },
    },
    {
      name: 'calendarUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'WebDAV URL to the calendar (e.g., https://portal.united-tattoos.com/remote.php/dav/calendars/username/appointments/)',
      },
    },
    {
      name: 'calendarId',
      type: 'text',
      required: true,
      admin: {
        description: 'Calendar name/identifier (e.g., "appointments")',
      },
    },
    {
      name: 'syncToken',
      type: 'text',
      admin: {
        description: 'Token for incremental sync',
        readOnly: true,
      },
    },
    {
      name: 'lastSyncAt',
      type: 'date',
      admin: {
        description: 'Timestamp of last successful sync',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM d, yyyy h:mm a',
        },
      },
    },
  ],

  // Hooks
  hooks: {
    // Test calendar connection before save
    beforeChange: [
      async ({ data, req, operation }) => {
        // Only test connection on create or when URL changes
        if (operation === 'create' || data.calendarUrl) {
          try {
            // Import CalDAV client dynamically
            const { createCalDAVClient, testCalendarConnection } = await import('@/lib/caldav-client')

            const client = createCalDAVClient()
            if (client && data.calendarUrl) {
              const isConnected = await testCalendarConnection(data.calendarUrl, data.calendarId)
              if (!isConnected) {
                throw new Error('Could not connect to the calendar. Please verify the URL and credentials.')
              }
            }
          } catch (error) {
            // Log but don't block if CalDAV is not configured
            console.warn('CalDAV connection test skipped:', error)
          }
        }
        return data
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

