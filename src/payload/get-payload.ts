/**
 * Payload Instance Helper
 *
 * Provides a cached Payload instance for use in API routes and server components.
 * This ensures we don't create multiple Payload instances.
 */

import { getPayload as getPayloadInstance, type Payload } from 'payload'
import config from '@payload-config'

// Cache the Payload promise to avoid multiple initializations
let cachedPayload: Payload | null = null

/**
 * Get the Payload instance
 *
 * @returns Promise<Payload> - The initialized Payload instance
 */
export async function getPayload(): Promise<Payload> {
  if (cachedPayload) {
    return cachedPayload
  }

  const payload = await getPayloadInstance({
    config,
  })

  cachedPayload = payload
  return payload
}

/**
 * Get the Payload instance (alias for backward compatibility)
 */
export const getPayloadClient = getPayload

