import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ArtistsGrid } from '@/components/artists-grid'
import '@testing-library/jest-dom'

// Mock the custom hook
vi.mock('@/hooks/use-artist-data', () => ({
  useArtists: vi.fn(),
}))

import { useArtists } from '@/hooks/use-artist-data'

describe('ArtistsGrid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading state', () => {
    vi.mocked(useArtists).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should display artists when loaded', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'test-artist',
        name: 'Test Artist',
        bio: 'Test bio',
        specialties: ['Traditional', 'Realism'],
        instagramHandle: '@testartist',
        portfolioImages: [
          {
            id: '1',
            artistId: '1',
            url: 'https://example.com/image.jpg',
            caption: 'Test image',
            tags: ['Traditional'],
            isPublic: true,
            orderIndex: 0,
            createdAt: new Date(),
          },
        ],
        isActive: true,
        hourlyRate: 150,
      },
    ]

    vi.mocked(useArtists).mockReturnValue({
      data: mockArtists,
      isLoading: false,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    expect(screen.getByText(/Traditional, Realism/i)).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('should display error state', () => {
    vi.mocked(useArtists).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
    } as any)

    render(<ArtistsGrid />)

    expect(screen.getByText(/Failed to load artists/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('should display empty state when no artists match filter', async () => {
    vi.mocked(useArtists).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    await waitFor(() => {
      expect(screen.getByText(/No artists found/i)).toBeInTheDocument()
    })
  })

  it('should display artist cards with portfolio images', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'artist-one',
        name: 'Artist One',
        bio: 'Bio one',
        specialties: ['Traditional'],
        portfolioImages: [
          {
            id: '1',
            artistId: '1',
            url: 'https://example.com/img1.jpg',
            tags: ['profile'],
            isPublic: true,
            orderIndex: 0,
            createdAt: new Date(),
          },
        ],
        isActive: true,
        hourlyRate: 100,
      },
    ]

    vi.mocked(useArtists).mockReturnValue({
      data: mockArtists,
      isLoading: false,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    await waitFor(() => {
      // Check for View Portfolio link
      const portfolioLink = screen.getByRole('link', { name: /View Portfolio/i })
      expect(portfolioLink).toHaveAttribute('href', '/artists/artist-one')

      // Check for Book Now link
      const bookLink = screen.getByRole('link', { name: /Book Now/i })
      expect(bookLink).toHaveAttribute('href', '/book?artist=artist-one')

      // Check for hourly rate display
      expect(screen.getByText(/\$100\/hr/i)).toBeInTheDocument()
    })
  })

  it('should display specialties as badges', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'multi-specialty-artist',
        name: 'Multi Specialty Artist',
        bio: 'Expert in multiple styles',
        specialties: ['Traditional', 'Realism', 'Fine Line', 'Japanese'],
        portfolioImages: [],
        isActive: true,
      },
    ]

    vi.mocked(useArtists).mockReturnValue({
      data: mockArtists,
      isLoading: false,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    await waitFor(() => {
      // Should show first 3 specialties
      expect(screen.getByText('Traditional')).toBeInTheDocument()
      expect(screen.getByText('Realism')).toBeInTheDocument()
      expect(screen.getByText('Fine Line')).toBeInTheDocument()
      
      // Should show "+1 more" badge for the 4th specialty
      expect(screen.getByText('+1 more')).toBeInTheDocument()
    })
  })

  it('should show inactive badge for inactive artists', async () => {
    const mockArtists = [
      {
        id: '1',
        slug: 'inactive-artist',
        name: 'Inactive Artist',
        bio: 'Currently unavailable',
        specialties: ['Traditional'],
        portfolioImages: [],
        isActive: false,
      },
    ]

    vi.mocked(useArtists).mockReturnValue({
      data: mockArtists,
      isLoading: false,
      error: null,
    } as any)

    render(<ArtistsGrid />)

    await waitFor(() => {
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
    })
  })
})
