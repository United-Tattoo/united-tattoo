import { describe, it, expect } from 'vitest'
import { createArtistSchema, createAppointmentSchema } from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('createArtistSchema', () => {
    it('should validate a valid artist object', () => {
      const validArtist = {
        name: 'John Doe',
        bio: 'Experienced tattoo artist',
        specialties: ['Traditional', 'Realism'],
        instagramHandle: 'johndoe',
        hourlyRate: 150,
        isActive: true,
      }

      const result = createArtistSchema.safeParse(validArtist)
      expect(result.success).toBe(true)
    })

    it('should reject artist with invalid data', () => {
      const invalidArtist = {
        name: '', // Empty name should fail
        bio: 'Bio',
        specialties: [],
        hourlyRate: -50, // Negative rate should fail
      }

      const result = createArtistSchema.safeParse(invalidArtist)
      expect(result.success).toBe(false)
    })

    it('should require name field', () => {
      const artistWithoutName = {
        bio: 'Bio',
        specialties: ['Traditional'],
        hourlyRate: 150,
      }

      const result = createArtistSchema.safeParse(artistWithoutName)
      expect(result.success).toBe(false)
    })
  })

  describe('createAppointmentSchema', () => {
    it('should validate a valid appointment object', () => {
      const validAppointment = {
        clientName: 'Jane Smith',
        clientEmail: 'jane@example.com',
        clientPhone: '+1234567890',
        artistId: 'artist-123',
        startTime: new Date('2024-12-01T10:00:00Z'),
        endTime: new Date('2024-12-01T12:00:00Z'),
        description: 'Traditional rose tattoo',
        estimatedPrice: 300,
        status: 'PENDING' as const,
      }

      const result = createAppointmentSchema.safeParse(validAppointment)
      expect(result.success).toBe(true)
    })

    it('should reject appointment with invalid email', () => {
      const invalidAppointment = {
        clientName: 'Jane Smith',
        clientEmail: 'invalid-email', // Invalid email format
        artistId: 'artist-123',
        startTime: new Date('2024-12-01T10:00:00Z'),
        endTime: new Date('2024-12-01T12:00:00Z'),
        description: 'Tattoo description',
        status: 'PENDING' as const,
      }

      const result = createAppointmentSchema.safeParse(invalidAppointment)
      expect(result.success).toBe(false)
    })

    it('should reject appointment with end time before start time', () => {
      const invalidAppointment = {
        clientName: 'Jane Smith',
        clientEmail: 'jane@example.com',
        artistId: 'artist-123',
        startTime: new Date('2024-12-01T12:00:00Z'),
        endTime: new Date('2024-12-01T10:00:00Z'), // End before start
        description: 'Tattoo description',
        status: 'PENDING' as const,
      }

      const result = createAppointmentSchema.safeParse(invalidAppointment)
      expect(result.success).toBe(false)
    })
  })
})
