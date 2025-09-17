"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Artist, CreateArtistInput, UpdateArtistInput } from "@/types/database"

// API functions
async function fetchArtists(params?: {
  page?: number
  limit?: number
  isActive?: boolean
  specialty?: string
  search?: string
}): Promise<{
  artists: Artist[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}> {
  const searchParams = new URLSearchParams()
  
  if (params?.page) searchParams.set("page", params.page.toString())
  if (params?.limit) searchParams.set("limit", params.limit.toString())
  if (params?.isActive !== undefined) searchParams.set("isActive", params.isActive.toString())
  if (params?.specialty) searchParams.set("specialty", params.specialty)
  if (params?.search) searchParams.set("search", params.search)

  const response = await fetch(`/api/artists?${searchParams}`)
  
  if (!response.ok) {
    throw new Error("Failed to fetch artists")
  }
  
  return response.json()
}

async function fetchArtist(id: string): Promise<Artist> {
  const response = await fetch(`/api/artists/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Artist not found")
    }
    throw new Error("Failed to fetch artist")
  }
  
  return response.json()
}

async function createArtist(data: CreateArtistInput): Promise<Artist> {
  const response = await fetch("/api/artists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create artist")
  }
  
  return response.json()
}

async function updateArtist(id: string, data: Partial<UpdateArtistInput>): Promise<Artist> {
  const response = await fetch(`/api/artists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update artist")
  }
  
  return response.json()
}

async function deleteArtist(id: string): Promise<void> {
  const response = await fetch(`/api/artists/${id}`, {
    method: "DELETE",
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete artist")
  }
}

// React Query hooks
export function useArtists(params?: {
  page?: number
  limit?: number
  isActive?: boolean
  specialty?: string
  search?: string
}) {
  return useQuery({
    queryKey: ["artists", params],
    queryFn: () => fetchArtists(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useArtist(id: string) {
  return useQuery({
    queryKey: ["artists", id],
    queryFn: () => fetchArtist(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createArtist,
    onSuccess: (newArtist) => {
      // Invalidate and refetch artists list
      queryClient.invalidateQueries({ queryKey: ["artists"] })
      
      // Add the new artist to the cache
      queryClient.setQueryData(["artists", newArtist.id], newArtist)
      
      toast.success("Artist created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create artist")
    },
  })
}

export function useUpdateArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateArtistInput> }) =>
      updateArtist(id, data),
    onSuccess: (updatedArtist) => {
      // Update the specific artist in cache
      queryClient.setQueryData(["artists", updatedArtist.id], updatedArtist)
      
      // Invalidate artists list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["artists"] })
      
      toast.success("Artist updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update artist")
    },
  })
}

export function useDeleteArtist() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteArtist,
    onSuccess: (_, deletedId) => {
      // Remove the artist from cache
      queryClient.removeQueries({ queryKey: ["artists", deletedId] })
      
      // Invalidate artists list
      queryClient.invalidateQueries({ queryKey: ["artists"] })
      
      toast.success("Artist deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete artist")
    },
  })
}

// Utility hooks for common operations
export function useActiveArtists() {
  return useArtists({ isActive: true })
}

export function useArtistsBySpecialty(specialty: string) {
  return useArtists({ specialty, isActive: true })
}

export function useSearchArtists(search: string) {
  return useArtists({ search, isActive: true })
}

// Prefetch functions for better UX
export function usePrefetchArtist() {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["artists", id],
      queryFn: () => fetchArtist(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}

// Cache management utilities
export function useInvalidateArtists() {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ["artists"] })
  }
}

export function useRefreshArtist() {
  const queryClient = useQueryClient()
  
  return (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["artists", id] })
  }
}
