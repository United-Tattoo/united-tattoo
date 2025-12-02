/**
 * Cloudflare Environment Type Definitions
 *
 * This file declares the types for Cloudflare D1 and R2 bindings
 * used by Payload CMS and the rest of the application.
 *
 * These bindings are configured in wrangler.toml and accessed via
 * getCloudflareContext() from @opennextjs/cloudflare
 */

interface CloudflareEnv {
  /**
   * Cloudflare D1 Database binding
   * Used by Payload CMS for data storage
   */
  D1: D1Database

  /**
   * Cloudflare R2 Bucket binding
   * Used by Payload CMS for file/media storage
   */
  R2: R2Bucket

  /**
   * Additional environment variables
   */
  PAYLOAD_SECRET?: string
  NEXTAUTH_SECRET?: string
  NEXTAUTH_URL?: string
  NEXTCLOUD_BASE_URL?: string
  NEXTCLOUD_OAUTH_CLIENT_ID?: string
  NEXTCLOUD_OAUTH_CLIENT_SECRET?: string
  NEXTCLOUD_USERNAME?: string
  NEXTCLOUD_PASSWORD?: string
  NEXTCLOUD_ARTISTS_GROUP?: string
  NEXTCLOUD_ADMINS_GROUP?: string
}

declare global {
  // Make CloudflareEnv available globally
  type CloudflareEnv = CloudflareEnv
}

export {}

