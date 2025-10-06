import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PublicArtist, ArtistWithPortfolio, Artist } from '@/types/database'

// Query keys for cache management
export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...artistKeys.lists(), filters] as const,
  details: () => [...artistKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistKeys.details(), id] as const,
  me: () => [...artistKeys.all, 'me'] as const,
}

// Fetch all artists
export function useArtists(filters?: {
  specialty?: string
  search?: string
  limit?: number
  page?: number
}) {
  return useQuery({
    queryKey: artistKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.specialty) params.append('specialty', filters.specialty)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.page) params.append('page', filters.page.toString())

      const response = await fetch(`/api/artists?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch artists')
      }
      
      const data = await response.json()
      return data.artists as PublicArtist[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Fetch single artist by ID or slug
export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: artistKeys.detail(id || ''),
    queryFn: async () => {
      if (!id) return null
      
      const response = await fetch(`/api/artists/${id}`)
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error('Failed to fetch artist')
      }
      
      return response.json() as Promise<ArtistWithPortfolio>
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Fetch current artist (for artist dashboard)
export function useCurrentArtist() {
  return useQuery({
    queryKey: artistKeys.me(),
    queryFn: async () => {
      const response = await fetch('/api/artists/me')
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return null
        }
        throw new Error('Failed to fetch artist profile')
      }
      
      return response.json() as Promise<Artist>
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry on auth errors
  })
}

// Update artist mutation
export function useUpdateArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Artist> }) => {
      const response = await fetch(`/api/artists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update artist')
      }
      
      return response.json() as Promise<Artist>
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: artistKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      queryClient.invalidateQueries({ queryKey: artistKeys.me() })
    },
  })
}

// Create artist mutation (admin only)
export function useCreateArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      name: string
      bio: string
      specialties: string[]
      instagramHandle?: string
      hourlyRate?: number
      email?: string
    }) => {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create artist')
      }
      
      return response.json() as Promise<Artist>
    },
    onSuccess: () => {
      // Invalidate artists list
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
    },
  })
}

// Delete artist mutation (admin only)
export function useDeleteArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/artists/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete artist')
      }
      
      return response.json()
    },
    onSuccess: (_, id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      queryClient.removeQueries({ queryKey: artistKeys.detail(id) })
    },
  })
}
