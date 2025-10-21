import { useQuery } from '@tanstack/react-query'
import type { FlashItem } from '@/types/database'

export const flashKeys = {
  listByArtist: (artistId: string) => ['flash', 'list', artistId] as const,
  item: (id: string) => ['flash', 'item', id] as const,
}

export function useFlash(artistId: string | undefined) {
  return useQuery({
    queryKey: flashKeys.listByArtist(artistId || ''),
    queryFn: async () => {
      if (!artistId) return [] as FlashItem[]
      const res = await fetch(`/api/flash/${artistId}`)
      if (!res.ok) throw new Error('Failed to fetch flash')
      const data = await res.json()
      return (data.items || []) as FlashItem[]
    },
    enabled: !!artistId,
    staleTime: 1000 * 60 * 5,
  })
}

export async function fetchFlashItem(id: string): Promise<FlashItem | null> {
  const res = await fetch(`/api/flash/item/${id}`)
  if (!res.ok) return null
  const data = await res.json()
  return (data.item || null) as FlashItem | null
}


