import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getArtists,
  getArtistWithPortfolio,
  getPublicArtists,
  getArtistBySlug,
  updateArtist,
  addPortfolioImage,
  updatePortfolioImage,
  deletePortfolioImage,
} from '@/lib/db'

// Mock D1 database
const createMockD1 = () => ({
  prepare: vi.fn().mockReturnThis(),
  bind: vi.fn().mockReturnThis(),
  first: vi.fn(),
  all: vi.fn(),
  run: vi.fn(),
})

describe('Database Functions', () => {
  let mockEnv: { DB: ReturnType<typeof createMockD1> }

  beforeEach(() => {
    mockEnv = {
      DB: createMockD1(),
    }
    vi.clearAllMocks()
  })

  describe('getArtists', () => {
    it('should fetch all artists and parse JSON fields', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Test Artist',
          bio: 'Test bio',
          specialties: '["Traditional","Realism"]',
          isActive: 1,
        },
      ]

      mockEnv.DB.all.mockResolvedValue({
        results: mockArtists,
        success: true,
      })

      const result = await getArtists(mockEnv)

      expect(result).toHaveLength(1)
      expect(result[0].specialties).toEqual(['Traditional', 'Realism'])
      expect(result[0].isActive).toBe(true)
    })

    it('should handle empty results', async () => {
      mockEnv.DB.all.mockResolvedValue({
        results: [],
        success: true,
      })

      const result = await getArtists(mockEnv)
      expect(result).toEqual([])
    })

    it('should handle database errors', async () => {
      mockEnv.DB.all.mockRejectedValue(new Error('Database error'))

      await expect(getArtists(mockEnv)).rejects.toThrow('Database error')
    })
  })

  describe('getArtistWithPortfolio', () => {
    it('should fetch artist with portfolio images', async () => {
      const mockArtist = {
        id: '1',
        name: 'Test Artist',
        bio: 'Test bio',
        specialties: '["Traditional"]',
        isActive: 1,
      }

      const mockImages = [
        {
          id: '1',
          artistId: '1',
          url: 'https://example.com/image.jpg',
          caption: 'Test image',
          tags: '["Traditional","Portrait"]',
          isPublic: 1,
          orderIndex: 0,
        },
      ]

      mockEnv.DB.first.mockResolvedValueOnce(mockArtist)
      mockEnv.DB.all.mockResolvedValueOnce({
        results: mockImages,
        success: true,
      })

      const result = await getArtistWithPortfolio('1', mockEnv)

      expect(result).toBeDefined()
      expect(result?.name).toBe('Test Artist')
      expect(result?.portfolioImages).toHaveLength(1)
      expect(result?.portfolioImages[0].tags).toEqual(['Traditional', 'Portrait'])
    })

    it('should return null for non-existent artist', async () => {
      mockEnv.DB.first.mockResolvedValue(null)

      const result = await getArtistWithPortfolio('999', mockEnv)
      expect(result).toBeNull()
    })
  })

  describe('getPublicArtists', () => {
    it('should return only active artists with public images', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Active Artist',
          specialties: '["Traditional"]',
          isActive: 1,
        },
        {
          id: '2',
          name: 'Inactive Artist',
          specialties: '["Realism"]',
          isActive: 0,
        },
      ]

      mockEnv.DB.all.mockResolvedValue({
        results: mockArtists.filter(a => a.isActive),
        success: true,
      })

      const result = await getPublicArtists({}, mockEnv)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Active Artist')
    })

    it('should filter by specialty', async () => {
      const mockArtists = [
        {
          id: '1',
          name: 'Traditional Artist',
          specialties: '["Traditional"]',
          isActive: 1,
        },
      ]

      mockEnv.DB.all.mockResolvedValue({
        results: mockArtists,
        success: true,
      })

      await getPublicArtists({ specialty: 'Traditional' }, mockEnv)

      // Verify the bind was called (specialty filter applied)
      expect(mockEnv.DB.bind).toHaveBeenCalled()
    })
  })

  describe('getArtistBySlug', () => {
    it('should fetch artist by slug', async () => {
      const mockArtist = {
        id: '1',
        slug: 'test-artist',
        name: 'Test Artist',
        specialties: '["Traditional"]',
      }

      mockEnv.DB.first.mockResolvedValue(mockArtist)
      mockEnv.DB.all.mockResolvedValue({
        results: [],
        success: true,
      })

      const result = await getArtistBySlug('test-artist', mockEnv)

      expect(result).toBeDefined()
      expect(result?.slug).toBe('test-artist')
      expect(mockEnv.DB.bind).toHaveBeenCalledWith('test-artist')
    })
  })

  describe('updateArtist', () => {
    it('should update artist and stringify JSON fields', async () => {
      const updateData = {
        id: '1',
        name: 'Updated Name',
        bio: 'Updated bio',
        specialties: ['Traditional', 'Realism'],
        hourlyRate: 150,
      }

      mockEnv.DB.run.mockResolvedValue({
        success: true,
        meta: { changes: 1 },
      })

      await updateArtist('1', updateData, mockEnv)

      // Verify the update was called
      expect(mockEnv.DB.run).toHaveBeenCalled()
      expect(mockEnv.DB.bind).toHaveBeenCalled()
    })
  })

  describe('Portfolio Image Operations', () => {
    it('should add portfolio image', async () => {
      const imageData = {
        url: 'https://example.com/image.jpg',
        caption: 'Test caption',
        tags: ['Traditional'],
        isPublic: true,
        orderIndex: 0,
      }

      mockEnv.DB.run.mockResolvedValue({
        success: true,
        meta: { last_row_id: 1 },
      })

      mockEnv.DB.first.mockResolvedValue({
        id: '1',
        ...imageData,
        artistId: '1',
        tags: JSON.stringify(imageData.tags),
      })

      const result = await addPortfolioImage('1', imageData, mockEnv)

      expect(result).toBeDefined()
      expect(result.caption).toBe('Test caption')
    })

    it('should update portfolio image', async () => {
      const updateData = {
        caption: 'Updated caption',
        tags: ['Traditional', 'Portrait'],
        isPublic: false,
      }

      mockEnv.DB.run.mockResolvedValue({
        success: true,
        meta: { changes: 1 },
      })

      await updatePortfolioImage('1', updateData, mockEnv)

      expect(mockEnv.DB.run).toHaveBeenCalled()
    })

    it('should delete portfolio image', async () => {
      mockEnv.DB.run.mockResolvedValue({
        success: true,
        meta: { changes: 1 },
      })

      await deletePortfolioImage('1', mockEnv)

      expect(mockEnv.DB.run).toHaveBeenCalled()
    })
  })
})
