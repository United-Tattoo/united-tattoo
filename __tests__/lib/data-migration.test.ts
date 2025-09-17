import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock the database using proper Vitest patterns
const mockStmt = {
  bind: vi.fn().mockReturnThis(),
  run: vi.fn().mockResolvedValue({ success: true, changes: 1 }),
  get: vi.fn(),
  all: vi.fn().mockResolvedValue({ results: [] }),
  first: vi.fn().mockResolvedValue(null),
}

const mockDB = {
  prepare: vi.fn().mockReturnValue(mockStmt),
  exec: vi.fn(),
}

// Mock the entire lib/db module
vi.mock('@/lib/db', () => ({
  getDB: vi.fn(() => mockDB),
}))

// Mock the artists data with proper structure
vi.mock('@/data/artists', () => ({
  artists: [
    {
      id: '1',
      name: 'Test Artist',
      bio: 'Test bio',
      styles: ['Traditional', 'Realism'],
      instagram: 'https://instagram.com/testartist',
      experience: '5 years',
      workImages: ['/test-image.jpg'],
      faceImage: '/test-face.jpg',
    },
    {
      id: '2',
      name: 'Another Artist',
      bio: 'Another bio',
      styles: ['Japanese', 'Blackwork'],
      instagram: 'https://instagram.com/anotherartist',
      experience: '8 years',
      workImages: [],
      faceImage: '/another-face.jpg',
    },
  ],
}))

describe('DataMigrator', () => {
  let DataMigrator: any
  let migrator: any

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reset mock implementations
    mockDB.prepare.mockReturnValue(mockStmt)
    mockStmt.first.mockResolvedValue(null)
    mockStmt.run.mockResolvedValue({ success: true, changes: 1 })
    
    // Import the DataMigrator class after mocks are set up
    const module = await import('@/lib/data-migration')
    DataMigrator = module.DataMigrator
    migrator = new DataMigrator()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('isMigrationCompleted', () => {
    it('should return false when no artists exist', async () => {
      mockStmt.first.mockResolvedValueOnce({ count: 0 })

      const isCompleted = await migrator.isMigrationCompleted()

      expect(isCompleted).toBe(false)
    })

    it('should return true when artists exist', async () => {
      mockStmt.first.mockResolvedValueOnce({ count: 2 })

      const isCompleted = await migrator.isMigrationCompleted()

      expect(isCompleted).toBe(true)
    })
  })

  describe('migrateArtistData', () => {
    it('should migrate all artists successfully', async () => {
      await migrator.migrateArtistData()

      // Verify user creation calls
      expect(mockDB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR IGNORE INTO users')
      )

      // Verify artist creation calls
      expect(mockDB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR IGNORE INTO artists')
      )

      // Verify portfolio image creation calls
      expect(mockDB.prepare).toHaveBeenCalledWith(
        expect.stringContaining('INSERT OR IGNORE INTO portfolio_images')
      )
    })

    it('should handle errors gracefully', async () => {
      mockStmt.run.mockRejectedValueOnce(new Error('Database error'))

      await expect(migrator.migrateArtistData()).rejects.toThrow('Database error')
    })
  })

  describe('clearMigratedData', () => {
    it('should clear all data successfully', async () => {
      await migrator.clearMigratedData()

      expect(mockDB.prepare).toHaveBeenCalledWith('DELETE FROM portfolio_images')
      expect(mockDB.prepare).toHaveBeenCalledWith('DELETE FROM artists')
      expect(mockDB.prepare).toHaveBeenCalledWith('DELETE FROM users WHERE role = "ARTIST"')
    })

    it('should handle clear data errors', async () => {
      mockStmt.run.mockRejectedValueOnce(new Error('Clear error'))

      await expect(migrator.clearMigratedData()).rejects.toThrow('Clear error')
    })
  })

  describe('getMigrationStats', () => {
    it('should return correct migration statistics', async () => {
      mockStmt.first
        .mockResolvedValueOnce({ count: 3 }) // total users
        .mockResolvedValueOnce({ count: 2 }) // total artists
        .mockResolvedValueOnce({ count: 1 }) // total portfolio images

      const stats = await migrator.getMigrationStats()

      expect(stats.totalUsers).toBe(3)
      expect(stats.totalArtists).toBe(2)
      expect(stats.totalPortfolioImages).toBe(1)
    })
  })
})
