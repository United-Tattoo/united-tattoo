/**
 * Payload CMS Configuration for United Tattoo Studio
 *
 * This configuration integrates Payload CMS with:
 * - Cloudflare D1 (SQLite) database via OpenNext bindings
 * - Cloudflare R2 storage for file uploads
 * - Custom collections matching existing database schema
 * - Role-based access control (SUPER_ADMIN, SHOP_ADMIN, ARTIST, CLIENT)
 */

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CloudflareContext } from '@opennextjs/cloudflare'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import collections (using .ts extension for Payload CLI compatibility)
import { Users } from './payload/collections/Users.ts'
import { Artists } from './payload/collections/Artists.ts'
import { PortfolioImages } from './payload/collections/PortfolioImages.ts'
import { Appointments } from './payload/collections/Appointments.ts'
import { FlashItems } from './payload/collections/FlashItems.ts'
import { SiteSettings } from './payload/collections/SiteSettings.ts'
import { ArtistCalendars } from './payload/collections/ArtistCalendars.ts'
import { Media } from './payload/collections/Media.ts'

// Check if running from Payload CLI (generate, migrate commands)
const isCLI = process.argv.some((value) => value.match(/^(generate|migrate):?/))
const isProduction = process.env.NODE_ENV === 'production'

// Get Cloudflare context for D1/R2 bindings
// In CLI mode or development, use wrangler's getPlatformProxy
// In production, use the actual Cloudflare context
const cloudflare: CloudflareContext = isCLI || !isProduction
  ? await getCloudflareContextFromWrangler()
  : await getCloudflareContext({ async: true })

export default buildConfig({
  // Admin panel configuration
  admin: {
    user: Users.slug,
    theme: 'dark', // Force dark theme for consistent branding
    meta: {
      titleSuffix: ' | United Tattoo Studio',
      favicon: '/favicon.ico',
      ogImage: '/united-studio-main.jpg',
    },
    importMap: {
      baseDir: path.resolve(__dirname),
    },
  },

  // Custom routes - use /cms for Payload admin to avoid conflict with existing /admin
  routes: {
    admin: '/cms',
    api: '/api/payload',
  },

  // Collections
  collections: [
    Users,
    Artists,
    PortfolioImages,
    Appointments,
    FlashItems,
    SiteSettings,
    ArtistCalendars,
    Media,
  ],

  // Rich text editor
  editor: lexicalEditor({}),

  // Database adapter - Cloudflare D1 via binding
  db: sqliteD1Adapter({
    binding: (cloudflare.env as CloudflareEnv).D1,
  }),

  // File storage - Cloudflare R2 via binding
  plugins: [
    r2Storage({
      bucket: (cloudflare.env as CloudflareEnv).R2,
      collections: {
        media: true,
        'portfolio-images': {
          prefix: 'portfolio',
        },
        'flash-items': {
          prefix: 'flash',
        },
      },
    }),
  ],

  // Secret for encryption
  secret: process.env.PAYLOAD_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key',

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },

  // GraphQL configuration
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, '../generated-schema.graphql'),
  },

  // Server URL
  serverURL: process.env.NEXTAUTH_URL || 'http://localhost:3000',

  // CORS configuration
  cors: [
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // CSRF protection
  csrf: [
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ].filter(Boolean),
})

/**
 * Get Cloudflare context from Wrangler for local development and CLI commands
 * Adapted from OpenNext's implementation
 */
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  // Dynamic import to avoid bundling wrangler in production
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        // Use remote bindings in production, local in development
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
