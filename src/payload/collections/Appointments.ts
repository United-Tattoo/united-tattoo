/**
 * Appointments Collection for Payload CMS
 *
 * Maps to existing 'appointments' table in Cloudflare D1
 * Booking appointments with CalDAV sync support
 */

import type { CollectionConfig } from 'payload'
import { hasRole, UserRoles, type UserRole } from './Users.ts'

// Appointment status enum
export const AppointmentStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type AppointmentStatusType = typeof AppointmentStatus[keyof typeof AppointmentStatus]

export const Appointments: CollectionConfig = {
  slug: 'appointments',

  // Admin panel configuration
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'client', 'startTime', 'status', 'createdAt'],
    group: 'Booking',
    description: 'Tattoo appointment bookings and scheduling',
  },

  // Access control
  access: {
    // Admins can see all, artists can see their own, clients can see their own
    read: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true

      // Artists can see their appointments
      if (user.role === UserRoles.ARTIST) {
        return {
          or: [
            {
              'artist.user': {
                equals: user.id,
              },
            },
          ],
        }
      }

      // Clients can see their appointments
      return {
        client: {
          equals: user.id,
        },
      }
    },

    // Admins and artists can create appointments
    create: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.ARTIST)
    },

    // Admins can update all, artists can update their own
    update: ({ req: { user } }) => {
      if (!user) return false
      if (hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)) return true

      if (user.role === UserRoles.ARTIST) {
        return {
          'artist.user': {
            equals: user.id,
          },
        }
      }
      return false
    },

    // Only admins can delete appointments
    delete: ({ req: { user } }) => {
      if (!user) return false
      return hasRole(user.role as UserRole, UserRoles.SHOP_ADMIN)
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
        description: 'Booked artist',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Client user account',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Appointment title (e.g., "Sleeve Tattoo")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Detailed description of the tattoo work',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'MMM d, yyyy h:mm a',
            },
            description: 'Appointment start time',
            width: '50%',
          },
        },
        {
          name: 'endTime',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'MMM d, yyyy h:mm a',
            },
            description: 'Appointment end time',
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: AppointmentStatus.PENDING,
      options: [
        { label: 'Pending', value: AppointmentStatus.PENDING },
        { label: 'Confirmed', value: AppointmentStatus.CONFIRMED },
        { label: 'In Progress', value: AppointmentStatus.IN_PROGRESS },
        { label: 'Completed', value: AppointmentStatus.COMPLETED },
        { label: 'Cancelled', value: AppointmentStatus.CANCELLED },
      ],
      admin: {
        description: 'Appointment status',
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'depositAmount',
          type: 'number',
          admin: {
            description: 'Deposit collected (USD)',
            width: '50%',
          },
          min: 0,
        },
        {
          name: 'totalAmount',
          type: 'number',
          admin: {
            description: 'Total appointment cost (USD)',
            width: '50%',
          },
          min: 0,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (placement info, design notes)',
      },
    },
    // CalDAV sync fields
    {
      name: 'caldavUid',
      type: 'text',
      admin: {
        description: 'CalDAV event UID for sync tracking',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'caldavEtag',
      type: 'text',
      admin: {
        description: 'CalDAV ETag for versioning',
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],

  // Hooks for CalDAV sync - imported from dedicated hooks file
  hooks: {
    afterChange: [
      async (args) => {
        const { syncToCalendarAfterChange } = await import('../hooks/caldav-sync')
        return syncToCalendarAfterChange(args)
      },
    ],
    afterDelete: [
      async (args) => {
        const { deleteFromCalendarAfterDelete } = await import('../hooks/caldav-sync')
        return deleteFromCalendarAfterDelete(args)
      },
    ],
  },

  // Timestamps
  timestamps: true,
}

