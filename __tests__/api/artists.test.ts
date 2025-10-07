import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/artists/route'
import { NextRequest } from 'next/server'

// Mock the database functions
vi.mock('@/lib/db', () => ({
  getPublicArtists: vi.fn(),
}))

import { getPublicArtists } from '@/lib/db'

describe('GET /api/artists', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return artists successfully', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'test-artist',
        name: 'Test Artist',
        bio: 'Test bio',
        specialties: ['Traditional', 'Realism'],
        instagramHandle: '@testartist',
        portfolioImages: [],
        isActive: true,
        hourlyRate: 150,
      },
    ]

    vi.mocked(getPublicArtists).mockResolvedValue(mockArtists)

    const request = new NextRequest('http://localhost:3000/api/artists')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.artists).toHaveLength(1)
    expect(data.artists[0].name).toBe('Test Artist')
  })

  it('should apply specialty filter', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'traditional-artist',
        name: 'Traditional Artist',
        bio: 'Test bio',
        specialties: ['Traditional'],
        portfolioImages: [],
        isActive: true,
      },
    ]

    vi.mocked(getPublicArtists).mockResolvedValue(mockArtists)

    const request = new NextRequest('http://localhost:3000/api/artists?specialty=Traditional')
    await GET(request)

    expect(getPublicArtists).toHaveBeenCalledWith(
      expect.objectContaining({
        specialty: 'Traditional',
      }),
      undefined
    )
  })

  it('should apply search filter', async () => {
    vi.mocked(getPublicArtists).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/artists?search=John')
    await GET(request)

    expect(getPublicArtists).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'John',
      }),
      undefined
    )
  })

  it('should apply pagination', async () => {
    vi.mocked(getPublicArtists).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/artists?limit=10&page=2')
    await GET(request)

    expect(getPublicArtists).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        offset: 10, // page 2 with limit 10 = offset 10
      }),
      undefined
    )
  })

  it('should handle database errors gracefully', async () => {
    vi.mocked(getPublicArtists).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/artists')
    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data).toHaveProperty('error')
  })

  it('should return empty array when no artists found', async () => {
    vi.mocked(getPublicArtists).mockResolvedValue([])

    const request = new NextRequest('http://localhost:3000/api/artists')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.artists).toEqual([])
  })
})
