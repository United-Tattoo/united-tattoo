import { useState, useEffect, useCallback } from 'react'

interface AvailabilityResult {
  available: boolean
  reason?: string
  checking: boolean
  error?: string
}

interface UseAvailabilityParams {
  artistId: string | null
  startTime: string | null
  endTime: string | null
  enabled?: boolean
}

export function useAvailability({
  artistId,
  startTime,
  endTime,
  enabled = true,
}: UseAvailabilityParams): AvailabilityResult {
  const [result, setResult] = useState<AvailabilityResult>({
    available: false,
    checking: false,
  })

  const checkAvailability = useCallback(async () => {
    if (!enabled || !artistId || !startTime || !endTime) {
      setResult({ available: false, checking: false })
      return
    }

    setResult(prev => ({ ...prev, checking: true, error: undefined }))

    try {
      const params = new URLSearchParams({
        artistId,
        startTime,
        endTime,
      })

      const response = await fetch(`/api/caldav/availability?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check availability')
      }

      setResult({
        available: data.available,
        reason: data.reason,
        checking: false,
      })
    } catch (error) {
      setResult({
        available: false,
        checking: false,
        error: error instanceof Error ? error.message : 'Failed to check availability',
      })
    }
  }, [artistId, startTime, endTime, enabled])

  useEffect(() => {
    // Debounce the availability check
    const timer = setTimeout(() => {
      checkAvailability()
    }, 300)

    return () => clearTimeout(timer)
  }, [checkAvailability])

  return result
}

