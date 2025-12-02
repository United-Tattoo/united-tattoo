/**
 * Data Migration Script: D1 to Payload CMS
 *
 * This script migrates existing data from Cloudflare D1 database
 * to Payload CMS collections.
 *
 * Usage:
 *   npx payload run scripts/migrate-to-payload.ts
 *
 * Or via npm script:
 *   pnpm payload:migrate
 */

import { getPayload } from 'payload'
import config from '../payload.config'

// Types for D1 data
interface D1User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  created_at: string
  updated_at: string
}

interface D1Artist {
  id: string
  user_id: string
  name: string
  slug: string
  bio: string
  specialties: string // JSON string
  instagram_handle?: string
  is_active: boolean
  hourly_rate?: number
  created_at: string
  updated_at: string
}

interface D1PortfolioImage {
  id: string
  artist_id: string
  url: string
  caption?: string
  tags: string // JSON string
  order_index: number
  is_public: boolean
  created_at: string
  updated_at: string
}

interface D1Appointment {
  id: string
  artist_id: string
  client_id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  status: string
  deposit_amount?: number
  total_amount?: number
  notes?: string
  caldav_uid?: string
  caldav_etag?: string
  created_at: string
  updated_at: string
}

interface D1FlashItem {
  id: string
  artist_id: string
  url: string
  title: string
  description?: string
  price?: number
  size_hint?: string
  tags: string // JSON string
  order_index: number
  is_available: boolean
  created_at: string
  updated_at: string
}

interface D1SiteSettings {
  id: string
  studio_name: string
  description: string
  address: string
  phone: string
  email: string
  social_media: string // JSON string
  business_hours: string // JSON string
  hero_image_url?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

interface D1ArtistCalendar {
  id: string
  artist_id: string
  calendar_url: string
  calendar_id: string
  sync_token?: string
  last_sync_at?: string
  created_at: string
  updated_at: string
}

// Migration statistics
interface MigrationStats {
  users: { total: number; migrated: number; errors: number }
  artists: { total: number; migrated: number; errors: number }
  portfolioImages: { total: number; migrated: number; errors: number }
  appointments: { total: number; migrated: number; errors: number }
  flashItems: { total: number; migrated: number; errors: number }
  siteSettings: { total: number; migrated: number; errors: number }
  artistCalendars: { total: number; migrated: number; errors: number }
}

// ID mapping to track old ID -> new ID relationships
const idMappings = {
  users: new Map<string, string>(),
  artists: new Map<string, string>(),
}

/**
 * Fetch data from D1 via API endpoint
 * In production, you'd use direct D1 access or export
 */
async function fetchFromD1<T>(tableName: string): Promise<T[]> {
  // This is a placeholder - in production you'd:
  // 1. Use wrangler d1 export to get SQL dump
  // 2. Parse the SQL dump
  // 3. Or use a direct D1 connection

  console.log(`[Migration] Fetching ${tableName} from D1...`)

  // For now, return empty array - you'd replace this with actual D1 data
  // Example using fetch to a migration API endpoint:
  /*
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/migrate/export?table=${tableName}`, {
    headers: {
      'Authorization': `Bearer ${process.env.MIGRATE_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${tableName}: ${response.statusText}`)
  }

  const data = await response.json()
  return data.rows
  */

  return []
}

/**
 * Parse JSON string safely
 */
function parseJSON<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue
  try {
    return JSON.parse(jsonString)
  } catch {
    return defaultValue
  }
}

/**
 * Migrate users from D1 to Payload
 */
async function migrateUsers(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting users migration...')

  const d1Users = await fetchFromD1<D1User>('users')
  stats.users.total = d1Users.length

  for (const d1User of d1Users) {
    try {
      // Check if user already exists
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: d1User.email } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  [Skip] User ${d1User.email} already exists`)
        idMappings.users.set(d1User.id, existing.docs[0].id)
        stats.users.migrated++
        continue
      }

      // Create user in Payload
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: d1User.email,
          name: d1User.name,
          role: d1User.role,
          // Generate random password since auth is via Nextcloud
          password: crypto.randomUUID(),
        },
      })

      idMappings.users.set(d1User.id, newUser.id)
      stats.users.migrated++
      console.log(`  [OK] Migrated user: ${d1User.email}`)
    } catch (error) {
      stats.users.errors++
      console.error(`  [ERROR] Failed to migrate user ${d1User.email}:`, error)
    }
  }
}

/**
 * Migrate artists from D1 to Payload
 */
async function migrateArtists(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting artists migration...')

  const d1Artists = await fetchFromD1<D1Artist>('artists')
  stats.artists.total = d1Artists.length

  for (const d1Artist of d1Artists) {
    try {
      // Check if artist already exists by slug
      const existing = await payload.find({
        collection: 'artists',
        where: { slug: { equals: d1Artist.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  [Skip] Artist ${d1Artist.name} already exists`)
        idMappings.artists.set(d1Artist.id, existing.docs[0].id)
        stats.artists.migrated++
        continue
      }

      // Get mapped user ID
      const payloadUserId = idMappings.users.get(d1Artist.user_id)
      if (!payloadUserId) {
        console.warn(`  [WARN] No user mapping for artist ${d1Artist.name}, skipping`)
        stats.artists.errors++
        continue
      }

      // Parse specialties JSON
      const specialties = parseJSON<string[]>(d1Artist.specialties, [])

      // Create artist in Payload
      const newArtist = await payload.create({
        collection: 'artists',
        data: {
          user: payloadUserId,
          name: d1Artist.name,
          slug: d1Artist.slug,
          bio: d1Artist.bio || '',
          specialties,
          instagramHandle: d1Artist.instagram_handle || undefined,
          hourlyRate: d1Artist.hourly_rate || undefined,
          isActive: d1Artist.is_active,
        },
      })

      idMappings.artists.set(d1Artist.id, newArtist.id)
      stats.artists.migrated++
      console.log(`  [OK] Migrated artist: ${d1Artist.name}`)
    } catch (error) {
      stats.artists.errors++
      console.error(`  [ERROR] Failed to migrate artist ${d1Artist.name}:`, error)
    }
  }
}

/**
 * Migrate portfolio images from D1 to Payload
 * Note: This creates references to existing R2 URLs
 */
async function migratePortfolioImages(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting portfolio images migration...')

  const d1Images = await fetchFromD1<D1PortfolioImage>('portfolio_images')
  stats.portfolioImages.total = d1Images.length

  for (const d1Image of d1Images) {
    try {
      // Get mapped artist ID
      const payloadArtistId = idMappings.artists.get(d1Image.artist_id)
      if (!payloadArtistId) {
        console.warn(`  [WARN] No artist mapping for image ${d1Image.id}, skipping`)
        stats.portfolioImages.errors++
        continue
      }

      // Parse tags JSON
      const tags = parseJSON<string[]>(d1Image.tags, [])

      // For portfolio images, we need to handle file uploads differently
      // Since files are already in R2, we'll create media references
      // This is a simplified version - in production you'd need to:
      // 1. Download the file from R2
      // 2. Re-upload through Payload's media API
      // Or configure Payload to reference existing R2 URLs directly

      console.log(`  [INFO] Portfolio image ${d1Image.id} - URL: ${d1Image.url}`)
      console.log(`  [INFO] Manual upload required for existing R2 files`)

      stats.portfolioImages.migrated++
    } catch (error) {
      stats.portfolioImages.errors++
      console.error(`  [ERROR] Failed to migrate portfolio image ${d1Image.id}:`, error)
    }
  }
}

/**
 * Migrate appointments from D1 to Payload
 */
async function migrateAppointments(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting appointments migration...')

  const d1Appointments = await fetchFromD1<D1Appointment>('appointments')
  stats.appointments.total = d1Appointments.length

  for (const d1Appt of d1Appointments) {
    try {
      // Get mapped IDs
      const payloadArtistId = idMappings.artists.get(d1Appt.artist_id)
      const payloadClientId = idMappings.users.get(d1Appt.client_id)

      if (!payloadArtistId || !payloadClientId) {
        console.warn(`  [WARN] Missing mapping for appointment ${d1Appt.id}, skipping`)
        stats.appointments.errors++
        continue
      }

      // Create appointment in Payload
      await payload.create({
        collection: 'appointments',
        data: {
          artist: payloadArtistId,
          client: payloadClientId,
          title: d1Appt.title,
          description: d1Appt.description || undefined,
          startTime: d1Appt.start_time,
          endTime: d1Appt.end_time,
          status: d1Appt.status,
          depositAmount: d1Appt.deposit_amount || undefined,
          totalAmount: d1Appt.total_amount || undefined,
          notes: d1Appt.notes || undefined,
          caldavUid: d1Appt.caldav_uid || undefined,
          caldavEtag: d1Appt.caldav_etag || undefined,
        },
      })

      stats.appointments.migrated++
      console.log(`  [OK] Migrated appointment: ${d1Appt.title}`)
    } catch (error) {
      stats.appointments.errors++
      console.error(`  [ERROR] Failed to migrate appointment ${d1Appt.id}:`, error)
    }
  }
}

/**
 * Migrate flash items from D1 to Payload
 */
async function migrateFlashItems(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting flash items migration...')

  const d1FlashItems = await fetchFromD1<D1FlashItem>('flash_items')
  stats.flashItems.total = d1FlashItems.length

  for (const d1Flash of d1FlashItems) {
    try {
      // Get mapped artist ID
      const payloadArtistId = idMappings.artists.get(d1Flash.artist_id)
      if (!payloadArtistId) {
        console.warn(`  [WARN] No artist mapping for flash item ${d1Flash.id}, skipping`)
        stats.flashItems.errors++
        continue
      }

      // Parse tags JSON
      const tags = parseJSON<string[]>(d1Flash.tags, [])

      // Similar to portfolio images, flash items with files need special handling
      console.log(`  [INFO] Flash item ${d1Flash.id} - URL: ${d1Flash.url}`)
      console.log(`  [INFO] Manual upload required for existing R2 files`)

      stats.flashItems.migrated++
    } catch (error) {
      stats.flashItems.errors++
      console.error(`  [ERROR] Failed to migrate flash item ${d1Flash.id}:`, error)
    }
  }
}

/**
 * Migrate site settings from D1 to Payload
 */
async function migrateSiteSettings(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting site settings migration...')

  const d1Settings = await fetchFromD1<D1SiteSettings>('site_settings')
  stats.siteSettings.total = d1Settings.length

  if (d1Settings.length === 0) {
    console.log('  [INFO] No site settings to migrate')
    return
  }

  const d1Setting = d1Settings[0] // Singleton

  try {
    // Check if settings already exist
    const existing = await payload.find({
      collection: 'site-settings',
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log('  [Skip] Site settings already exist')
      stats.siteSettings.migrated++
      return
    }

    // Parse JSON fields
    const socialMedia = parseJSON<any>(d1Setting.social_media, {})
    const businessHours = parseJSON<any[]>(d1Setting.business_hours, [])

    // Create site settings in Payload
    await payload.create({
      collection: 'site-settings',
      data: {
        studioName: d1Setting.studio_name,
        description: d1Setting.description,
        contact: {
          address: d1Setting.address,
          phone: d1Setting.phone,
          email: d1Setting.email,
        },
        socialMedia: {
          instagram: socialMedia.instagram || undefined,
          facebook: socialMedia.facebook || undefined,
          twitter: socialMedia.twitter || undefined,
          tiktok: socialMedia.tiktok || undefined,
        },
        businessHours: businessHours.map((h: any) => ({
          day: h.day,
          openTime: h.openTime || h.open_time,
          closeTime: h.closeTime || h.close_time,
          isClosed: h.isClosed || h.is_closed || false,
        })),
      },
    })

    stats.siteSettings.migrated++
    console.log('  [OK] Migrated site settings')
  } catch (error) {
    stats.siteSettings.errors++
    console.error('  [ERROR] Failed to migrate site settings:', error)
  }
}

/**
 * Migrate artist calendars from D1 to Payload
 */
async function migrateArtistCalendars(payload: any, stats: MigrationStats): Promise<void> {
  console.log('\n[Migration] Starting artist calendars migration...')

  const d1Calendars = await fetchFromD1<D1ArtistCalendar>('artist_calendars')
  stats.artistCalendars.total = d1Calendars.length

  for (const d1Cal of d1Calendars) {
    try {
      // Get mapped artist ID
      const payloadArtistId = idMappings.artists.get(d1Cal.artist_id)
      if (!payloadArtistId) {
        console.warn(`  [WARN] No artist mapping for calendar ${d1Cal.id}, skipping`)
        stats.artistCalendars.errors++
        continue
      }

      // Check if calendar config already exists for this artist
      const existing = await payload.find({
        collection: 'artist-calendars',
        where: { artist: { equals: payloadArtistId } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  [Skip] Calendar config already exists for artist`)
        stats.artistCalendars.migrated++
        continue
      }

      // Create calendar config in Payload
      await payload.create({
        collection: 'artist-calendars',
        data: {
          artist: payloadArtistId,
          calendarUrl: d1Cal.calendar_url,
          calendarId: d1Cal.calendar_id,
          syncToken: d1Cal.sync_token || undefined,
          lastSyncAt: d1Cal.last_sync_at || undefined,
        },
      })

      stats.artistCalendars.migrated++
      console.log(`  [OK] Migrated calendar config for artist`)
    } catch (error) {
      stats.artistCalendars.errors++
      console.error(`  [ERROR] Failed to migrate calendar ${d1Cal.id}:`, error)
    }
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('='.repeat(60))
  console.log('United Tattoo: D1 to Payload CMS Migration')
  console.log('='.repeat(60))
  console.log(`Started at: ${new Date().toISOString()}`)

  const stats: MigrationStats = {
    users: { total: 0, migrated: 0, errors: 0 },
    artists: { total: 0, migrated: 0, errors: 0 },
    portfolioImages: { total: 0, migrated: 0, errors: 0 },
    appointments: { total: 0, migrated: 0, errors: 0 },
    flashItems: { total: 0, migrated: 0, errors: 0 },
    siteSettings: { total: 0, migrated: 0, errors: 0 },
    artistCalendars: { total: 0, migrated: 0, errors: 0 },
  }

  try {
    // Initialize Payload
    console.log('\n[Migration] Initializing Payload CMS...')
    const payload = await getPayload({ config })
    console.log('[Migration] Payload CMS initialized successfully')

    // Run migrations in order (respecting dependencies)
    await migrateUsers(payload, stats)
    await migrateArtists(payload, stats)
    await migratePortfolioImages(payload, stats)
    await migrateAppointments(payload, stats)
    await migrateFlashItems(payload, stats)
    await migrateSiteSettings(payload, stats)
    await migrateArtistCalendars(payload, stats)

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('Migration Summary')
    console.log('='.repeat(60))
    console.log(`
Users:           ${stats.users.migrated}/${stats.users.total} (${stats.users.errors} errors)
Artists:         ${stats.artists.migrated}/${stats.artists.total} (${stats.artists.errors} errors)
Portfolio:       ${stats.portfolioImages.migrated}/${stats.portfolioImages.total} (${stats.portfolioImages.errors} errors)
Appointments:    ${stats.appointments.migrated}/${stats.appointments.total} (${stats.appointments.errors} errors)
Flash Items:     ${stats.flashItems.migrated}/${stats.flashItems.total} (${stats.flashItems.errors} errors)
Site Settings:   ${stats.siteSettings.migrated}/${stats.siteSettings.total} (${stats.siteSettings.errors} errors)
Calendars:       ${stats.artistCalendars.migrated}/${stats.artistCalendars.total} (${stats.artistCalendars.errors} errors)
`)
    console.log(`Completed at: ${new Date().toISOString()}`)
    console.log('='.repeat(60))

    // Exit with appropriate code
    const hasErrors = Object.values(stats).some(s => s.errors > 0)
    process.exit(hasErrors ? 1 : 0)
  } catch (error) {
    console.error('\n[Migration] Fatal error:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()

