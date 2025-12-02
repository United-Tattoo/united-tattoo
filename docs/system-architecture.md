# United Tattoo System Architecture

Complete documentation of the database setup, Nextcloud/CalDAV integration, and admin CMS capabilities.

**Last Updated:** December 2025

---

## Table of Contents

1. [Database Setup & Architecture](#database-setup--architecture)
2. [Nextcloud Integration](#nextcloud-integration)
3. [CalDAV Integration](#caldav-integration)
4. [Admin CMS Capabilities](#admin-cms-capabilities)
5. [Architecture Patterns](#architecture-patterns)
6. [Environment Configuration](#environment-configuration)

---

## Database Setup & Architecture

### Overview

United Tattoo uses **Cloudflare D1** (SQLite database) for persistent data storage, with **Cloudflare R2** for file storage. All database interactions go through a type-safe abstraction layer in `lib/db.ts` that provides namespace-style exports.

### Database Schema

#### Users Table

Stores all user accounts with role-based access control.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `email` | TEXT | UNIQUE, NOT NULL | Unique identifier for login |
| `name` | TEXT | NOT NULL | Display name |
| `role` | TEXT | CHECK(SUPER_ADMIN, SHOP_ADMIN, ARTIST, CLIENT) | Role hierarchy |
| `avatar` | TEXT | | URL to user avatar image |
| `created_at` | DATETIME | | ISO timestamp |
| `updated_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_users_email` (unique)
- `idx_users_role`

**Role Hierarchy:**
```
CLIENT (0) < ARTIST (1) < SHOP_ADMIN (2) < SUPER_ADMIN (3)
```

#### Artists Table

Stores artist profiles linked to user accounts.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `user_id` | TEXT | NOT NULL, FK(users.id) | Link to user account |
| `name` | TEXT | NOT NULL | Artist display name |
| `slug` | TEXT | UNIQUE | URL-friendly identifier (auto-generated from name, incremented if duplicate) |
| `bio` | TEXT | NOT NULL | Artist biography/description |
| `specialties` | TEXT | | JSON array string: `["blackwork","portrait","color"]` |
| `instagram_handle` | TEXT | | Instagram username without @ |
| `is_active` | BOOLEAN | DEFAULT TRUE | Soft delete flag |
| `hourly_rate` | REAL | | Hourly rate in USD |
| `created_at` | DATETIME | | ISO timestamp |
| `updated_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_artists_user_id`
- `idx_artists_slug` (unique)
- `idx_artists_is_active`

**Example specialties JSON:**
```json
["blackwork", "traditional", "portrait", "geometric"]
```

#### Portfolio Images Table

Stores artist portfolio work images.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | NOT NULL, FK(artists.id) | Artist who created work |
| `url` | TEXT | NOT NULL | R2 public URL |
| `caption` | TEXT | | Image description/caption |
| `tags` | TEXT | | JSON array: `["black-and-gray","arm","2024"]` |
| `order_index` | INTEGER | DEFAULT 0 | Display order in portfolio |
| `is_public` | BOOLEAN | DEFAULT TRUE | Visibility toggle |
| `created_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_portfolio_images_artist_id`
- `idx_portfolio_images_is_public`
- `idx_portfolio_order` (artist_id, order_index)

**Example tags JSON:**
```json
["black-and-gray", "sleeve", "arm", "2024", "traditional"]
```

#### Appointments Table

Stores booking appointments with CalDAV sync metadata.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | NOT NULL, FK(artists.id) | Booked artist |
| `client_id` | TEXT | NOT NULL, FK(users.id) | Client user |
| `title` | TEXT | NOT NULL | Appointment title (e.g., "Sleeve Tattoo") |
| `description` | TEXT | | Detailed description |
| `start_time` | DATETIME | NOT NULL | Appointment start (UTC) |
| `end_time` | DATETIME | NOT NULL | Appointment end (UTC) |
| `status` | TEXT | CHECK(PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED) | Appointment status |
| `deposit_amount` | REAL | | Deposit collected |
| `total_amount` | REAL | | Total appointment cost |
| `notes` | TEXT | | Internal notes/placement info |
| `caldav_uid` | TEXT | | CalDAV event UID for sync tracking |
| `caldav_etag` | TEXT | | CalDAV ETag for versioning |
| `created_at` | DATETIME | | ISO timestamp |
| `updated_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_appointments_artist_id`
- `idx_appointments_client_id`
- `idx_appointments_start_time`
- `idx_appointments_status`
- `idx_appointments_caldav_uid`

**Status Flow:**
```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
        → CANCELLED (any state)
```

#### Flash Items Table

Stores pre-designed tattoo flash available for booking.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | NOT NULL, FK(artists.id) | Artist who designed flash |
| `url` | TEXT | NOT NULL | R2 image URL |
| `title` | TEXT | NOT NULL | Flash design title |
| `description` | TEXT | | Design description |
| `price` | INTEGER | | Price in cents |
| `size_hint` | TEXT | | Suggested size (e.g., "3x3 inches") |
| `tags` | TEXT | | JSON array: `["flash","color","small"]` |
| `order_index` | INTEGER | DEFAULT 0 | Display order |
| `is_available` | INTEGER | DEFAULT 1 | Availability flag |
| `created_at` | TEXT | | ISO timestamp |

**Indexes:**
- `idx_flash_artist` (artist_id, is_available, order_index)

#### Availability Table

Stores regular artist availability windows (e.g., "Open Tuesday-Friday, 10am-6pm").

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | NOT NULL, FK(artists.id) | Artist |
| `day_of_week` | INTEGER | CHECK(0-6) | 0=Sunday, 1=Monday, etc. |
| `start_time` | TEXT | | Time in HH:mm format (24h) |
| `end_time` | TEXT | | Time in HH:mm format (24h) |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether this slot is active |

**Indexes:**
- `idx_availability_artist_id`

**Example:**
```sql
INSERT INTO availability (id, artist_id, day_of_week, start_time, end_time, is_active)
VALUES (uuid(), 'artist-1', 1, '10:00', '18:00', true); -- Monday 10am-6pm
```

#### Site Settings Table

Global configuration for the studio.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | Always "default" |
| `studio_name` | TEXT | NOT NULL | Studio display name |
| `description` | TEXT | NOT NULL | Studio description |
| `address` | TEXT | NOT NULL | Physical address |
| `phone` | TEXT | NOT NULL | Contact phone |
| `email` | TEXT | NOT NULL | Contact email |
| `social_media` | TEXT | | JSON object with social links |
| `business_hours` | TEXT | | JSON array of daily hours |
| `hero_image` | TEXT | | Hero section image URL |
| `logo_url` | TEXT | | Studio logo URL |
| `updated_at` | DATETIME | | Last update timestamp |

**Example social_media JSON:**
```json
{
  "instagram": "https://instagram.com/united.tattoos",
  "facebook": "https://facebook.com/unitedtattoos",
  "twitter": "https://twitter.com/unitedtattoos",
  "tiktok": "https://tiktok.com/@unitedtattoos"
}
```

**Example business_hours JSON:**
```json
[
  { "day": "Monday", "open": "10:00", "close": "18:00", "closed": false },
  { "day": "Tuesday", "open": "10:00", "close": "18:00", "closed": false },
  { "day": "Wednesday", "open": "10:00", "close": "18:00", "closed": false },
  { "day": "Thursday", "open": "10:00", "close": "20:00", "closed": false },
  { "day": "Friday", "open": "10:00", "close": "20:00", "closed": false },
  { "day": "Saturday", "open": "11:00", "close": "17:00", "closed": false },
  { "day": "Sunday", "open": null, "close": null, "closed": true }
]
```

#### File Uploads Table

Tracks all files uploaded to R2.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `filename` | TEXT | NOT NULL | Generated filename in R2 |
| `original_name` | TEXT | NOT NULL | Original filename from upload |
| `mime_type` | TEXT | NOT NULL | MIME type (e.g., "image/jpeg") |
| `size` | INTEGER | NOT NULL | File size in bytes |
| `url` | TEXT | NOT NULL | Public R2 URL |
| `uploaded_by` | TEXT | NOT NULL, FK(users.id) | User who uploaded |
| `created_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_file_uploads_uploaded_by`

#### Artist Calendars Table

Per-artist CalDAV configuration for Nextcloud integration.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | NOT NULL UNIQUE, FK(artists.id) | One calendar per artist |
| `calendar_url` | TEXT | NOT NULL | WebDAV URL to calendar |
| `calendar_id` | TEXT | NOT NULL | Calendar name/identifier |
| `sync_token` | TEXT | | Token for incremental sync |
| `last_sync_at` | DATETIME | | Timestamp of last successful sync |
| `created_at` | DATETIME | | ISO timestamp |
| `updated_at` | DATETIME | | ISO timestamp |

**Example calendar_url:**
```
https://portal.united-tattoos.com/remote.php/dav/calendars/username/appointments/
```

#### Calendar Sync Logs Table

Audit trail for calendar synchronization operations.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | TEXT | PRIMARY KEY | UUID v4 generated |
| `artist_id` | TEXT | FK(artists.id) | Artist synced |
| `sync_type` | TEXT | CHECK(PUSH, PULL, FULL) | Type of sync operation |
| `status` | TEXT | CHECK(SUCCESS, FAILED, PARTIAL) | Sync result |
| `error_message` | TEXT | | Error details if failed |
| `events_processed` | INTEGER | DEFAULT 0 | Total events examined |
| `events_created` | INTEGER | DEFAULT 0 | New events created |
| `events_updated` | INTEGER | DEFAULT 0 | Events modified |
| `events_deleted` | INTEGER | DEFAULT 0 | Events removed |
| `duration_ms` | INTEGER | | Sync duration in milliseconds |
| `created_at` | DATETIME | | ISO timestamp |

**Indexes:**
- `idx_sync_logs_artist_created` (artist_id, created_at DESC)
- `idx_sync_logs_status` (status)

### Database Access Layer (lib/db.ts)

All database operations use a namespace-style abstraction:

```typescript
// Users
db.users.findByEmail(email: string) => User | null
db.users.findById(id: string) => User | null
db.users.create(data: UserInsert) => User
db.users.update(id: string, data: UserUpdate) => User
db.users.delete(id: string) => boolean

// Artists
db.artists.findMany(filters?: {isActive?: boolean}) => Artist[]
db.artists.findUnique(id: string | slug: string) => Artist | null
db.artists.create(data: ArtistInsert) => Artist
db.artists.update(id: string, data: ArtistUpdate) => Artist
db.artists.delete(id: string) => boolean (soft delete)
db.artists.getPublicArtists() => Artist[] (with portfolio images)

// Portfolio Images
db.portfolioImages.findMany(artistId: string) => PortfolioImage[]
db.portfolioImages.findPublic(artistId: string) => PortfolioImage[]
db.portfolioImages.create(artistId: string, data: PortfolioImageInsert) => PortfolioImage
db.portfolioImages.update(id: string, data: PortfolioImageUpdate) => PortfolioImage
db.portfolioImages.delete(id: string) => boolean

// Appointments
db.appointments.findMany(filters?: {artistId?, clientId?, status?, dateRange?}) => Appointment[]
db.appointments.findUnique(id: string) => Appointment | null
db.appointments.create(data: AppointmentInsert) => Appointment
db.appointments.update(id: string, data: AppointmentUpdate) => Appointment
db.appointments.delete(id: string) => boolean
db.appointments.checkConflicts(artistId, startTime, endTime) => Appointment[]

// Flash Items
db.flashItems.findMany(artistId: string) => FlashItem[]
db.flashItems.findAvailable(artistId: string) => FlashItem[]
db.flashItems.create(artistId: string, data: FlashItemInsert) => FlashItem
db.flashItems.update(id: string, data: FlashItemUpdate) => FlashItem
db.flashItems.delete(id: string) => boolean

// Site Settings
db.siteSettings.findFirst() => SiteSettings | null
db.siteSettings.update(data: SiteSettingsUpdate) => SiteSettings

// Artist Calendars
db.artistCalendars.findByArtistId(artistId: string) => ArtistCalendar | null
db.artistCalendars.create(data: ArtistCalendarInsert) => ArtistCalendar
db.artistCalendars.update(id: string, data: ArtistCalendarUpdate) => ArtistCalendar
db.artistCalendars.delete(id: string) => boolean
```

**Key Features:**

- **JSON field auto-parsing:** `specialties`, `tags`, `social_media`, `business_hours` are automatically parsed from JSON strings to objects and vice versa
- **Error handling:** All queries throw `DatabaseError` with context
- **Type safety:** Full TypeScript types in `types/database.ts`
- **Binding access:** `getDB(env)` retrieves D1 from Cloudflare Worker bindings via OpenNext's global symbol
- **R2 access:** `getR2Bucket(env)` retrieves R2 bucket binding for file uploads

### Migrations

**Two migration systems:**

1. **Manual migrations** (`/sql/migrations/`):
   - Naming: `YYYYMMDD_NNNN_description.sql`
   - Applied with `npm run db:migrate:local/preview/prod`
   - Contains full schema changes with descriptive comments

2. **Wrangler migrations** (`/sql/migrations_up/`):
   - Tracked by Wrangler's built-in system
   - Auto-applied on deployment
   - Referenced in `wrangler.toml`

**Key Migrations:**

| File | Purpose |
|------|---------|
| `20250918_0001_initial.sql` | Core schema (users, artists, portfolio, appointments) |
| `20250918_0002_add_artist_slug.sql` | Add slug field for artist URLs |
| `20251021_0002_add_flash_items.sql` | Flash tattoo designs table |
| `20250109_add_caldav_support.sql` | CalDAV integration tables |
| `20251202_0001_add_performance_indexes.sql` | Query optimization indexes |

**Migration Commands:**

```bash
# Local development
npm run db:migrate:local

# Preview environment
npm run db:migrate:latest:preview

# Production
npm run db:migrate:latest:prod

# Direct Wrangler
wrangler d1 execute united-tattoo --local --command="SELECT * FROM artists"
```

### Performance Optimization

**Indexes Strategy:**

- Foreign key lookups (`artist_id`, `user_id`, `client_id`)
- Unique constraints (`slug`, `email`, `caldav_uid`)
- Common filter paths (`is_active`, `is_public`, `status`)
- Range queries (`start_time`, `created_at`)
- Composite indexes for multi-column filters

**N+1 Prevention:**

- `getPublicArtists()` fetches artists + images in 2 queries total
- Batch operations use `INNER JOIN` for efficiency
- Pagination built into list endpoints

### Storage Integration

**Cloudflare R2:**
- Images uploaded via `/api/upload` multipart handler
- Automatic HEIC → JPEG conversion
- Resizing for mobile/desktop
- AVIF format support for modern browsers
- Public URLs served directly from R2
- Bindings referenced as `R2_BUCKET` in `wrangler.toml`

---

## Nextcloud Integration

### Overview

United Tattoo uses **Nextcloud OAuth 2.0** for primary authentication and authorization. This provides:

- Central user management in Nextcloud
- Group-based role assignment (admin, shop_admins, artists)
- Automatic artist profile creation
- Integration with Nextcloud CalDAV for scheduling

### OAuth Flow

**Step-by-step authentication process:**

```
1. User clicks "Sign in with Nextcloud"
   ↓
2. Redirect to Nextcloud OAuth consent:
   GET https://portal.united-tattoos.com/index.php/apps/oauth2/authorize
   ?client_id=...&response_type=code&redirect_uri=...&state=...
   ↓
3. User authenticates and grants permission
   ↓
4. Nextcloud redirects back with authorization code:
   https://united-tattoos.com/api/auth/nextcloud/callback?code=...&state=...
   ↓
5. Backend exchanges code for access token:
   POST https://portal.united-tattoos.com/index.php/apps/oauth2/api/v1/token
   {client_id, client_secret, code, redirect_uri}
   ↓
6. Backend uses token to fetch user profile:
   GET https://portal.united-tattoos.com/ocs/v2.php/apps/admin_audit/api/v1/users/{userId}
   Authorization: Bearer {access_token}
   ↓
7. Determine role based on group membership:
   - admin/admins group → SUPER_ADMIN
   - shop_admins group → SHOP_ADMIN
   - artists group → ARTIST
   ↓
8. Create user in database (or link existing):
   - If ARTIST: Auto-create artist profile
   ↓
9. Generate one-time token and set in cookie
   ↓
10. Redirect to /auth/nextcloud/complete
    ↓
11. Auto-submit to NextAuth credentials provider
    ↓
12. JWT session created and cookie set
```

### Configuration

**Required Environment Variables:**

```bash
# Nextcloud OAuth App (create in Nextcloud admin settings)
NEXTCLOUD_BASE_URL="https://portal.united-tattoos.com"
NEXTCLOUD_OAUTH_CLIENT_ID="your-client-id"
NEXTCLOUD_OAUTH_CLIENT_SECRET="your-client-secret"

# Nextcloud Group Names (must exist in Nextcloud)
NEXTCLOUD_ARTISTS_GROUP="artists"           # Customizable
NEXTCLOUD_ADMINS_GROUP="shop_admins"        # Customizable

# NextAuth Configuration
NEXTAUTH_URL="https://united-tattoos.com"
NEXTAUTH_SECRET="your-random-secret-key"
```

### Nextcloud OAuth App Setup

**In Nextcloud Admin Panel:**

1. Go to Settings → OAuth 2.0 / OpenID Connect Clients
2. Create new application:
   - Name: "United Tattoo Studio"
   - Redirect URI: `https://united-tattoos.com/api/auth/nextcloud/callback`
3. Copy Client ID and Client Secret
4. Store in environment variables

### Group-Based Role Assignment

**Nextcloud Group Hierarchy:**

| Nextcloud Group | Database Role | Permissions |
|-----------------|---------------|-------------|
| admin, admins | SUPER_ADMIN | Full system access, all artist management |
| shop_admins | SHOP_ADMIN | Artist/appointment/portfolio management |
| artists | ARTIST | Edit own profile, portfolio, view calendar |
| (none/other) | CLIENT | (OAuth blocked, clients use public booking) |

**Flow in `lib/nextcloud-client.ts`:**

```typescript
async function determineUserRole(userId: string): Promise<Role> {
  const groups = await getNextcloudUserGroups(userId);

  if (groups.includes('admin') || groups.includes('admins')) {
    return 'SUPER_ADMIN';
  }
  if (groups.includes(process.env.NEXTCLOUD_ADMINS_GROUP || 'shop_admins')) {
    return 'SHOP_ADMIN';
  }
  if (groups.includes(process.env.NEXTCLOUD_ARTISTS_GROUP || 'artists')) {
    return 'ARTIST';
  }

  // Non-whitelisted users rejected at NextAuth callback
  return null;
}
```

### User Provisioning

**First-time login flow:**

1. User authenticates via Nextcloud OAuth
2. Backend fetches user profile from Nextcloud OCS API:
   ```typescript
   GET /ocs/v2.php/apps/admin_audit/api/v1/users/{userId}
   {
     ocs: {
       data: {
         id: "user123",
         enabled: true,
         email: "artist@example.com",
         displayname: "Artist Name",
         quota: "unlimited",
         lastLogin: 1702000000000,
         groups: ["artists"]
       }
     }
   }
   ```

3. Check if user exists in database:
   - **Yes:** Update with latest Nextcloud data
   - **No:** Create new user record

4. **If ARTIST role:**
   ```typescript
   await db.artists.create({
     userId: user.id,
     name: user.displayName,
     bio: '',
     specialties: [],
     instagramHandle: null,
     hourlyRate: null,
     isActive: true,
     slug: generateSlug(user.displayName),
   });
   ```

5. **If SUPER_ADMIN or SHOP_ADMIN:**
   - Just create user record, no artist profile

### API Client Functions

**Location:** `lib/nextcloud-client.ts`

**Available functions:**

```typescript
// Fetch user profile from Nextcloud OCS
async getNextcloudUserProfile(userId: string): Promise<{
  id: string;
  enabled: boolean;
  email: string;
  displayname: string;
  groups: string[];
  quota?: string;
  lastLogin?: number;
}>

// Get array of group memberships
async getNextcloudUserGroups(userId: string): Promise<string[]>

// Check if user belongs to group
async isUserInGroup(userId: string, groupName: string): Promise<boolean>

// Determine role based on group membership
async determineUserRole(userId: string): Promise<Role>

// Service account API access (for calendar sync)
async getNextcloudHeaders(): Promise<{
  Authorization: string;
  'OCS-APIRequest': string;
}>
```

**Example API call:**

```typescript
const userGroups = await getNextcloudUserGroups('user@example.com');
console.log(userGroups); // ["artists", "users"]

const role = await determineUserRole('admin@example.com');
console.log(role); // "SUPER_ADMIN"
```

### Service Account Access

For background operations (CalDAV sync), use service account credentials:

```bash
NEXTCLOUD_USERNAME="service-account"
NEXTCLOUD_PASSWORD="app-specific-password-or-password"
```

These credentials are used in `lib/caldav-client.ts` for CalDAV operations without user interaction.

### Fallback Authentication

**Emergency admin access via credentials provider:**

URL: `/auth/signin?admin=true`

**Dev Mode:**
- Any email/password combination creates a SUPER_ADMIN user
- Useful for local development

**Production:**
- Hardcoded seed: `nicholai@biohazardvfx.com` → SUPER_ADMIN
- Only use in emergency (lost Nextcloud access)

### Implementation Details

**Key Files:**

- `lib/nextcloud-client.ts` - OCS API wrapper
- `lib/auth.ts` - NextAuth.js configuration
- `app/api/auth/nextcloud/authorize/route.ts` - OAuth initiation
- `app/api/auth/nextcloud/callback/route.ts` - OAuth callback
- `app/auth/nextcloud/complete/page.tsx` - Session completion

**Authorization Hook:**

```typescript
import { requireAuth, getArtistSession } from '@/lib/auth';

// Protect route, require ARTIST or above
export const runtime = 'nodejs';

export default async function MyPage() {
  const session = await getArtistSession();
  if (!session) redirect('/auth/signin');

  return <div>Hello {session.user.name}</div>;
}
```

---

## CalDAV Integration

### Overview

United Tattoo implements **bidirectional CalDAV synchronization** with Nextcloud calendars:

- **Push:** Appointments created/updated/deleted in the app → Synced to Nextcloud calendars
- **Pull:** Events in Nextcloud calendars → Pulled back into the database (manual/scheduled)
- **Conflict Detection:** Real-time availability checking via CalDAV queries
- **Per-Artist Calendars:** Each artist can have their own Nextcloud calendar

### Architecture

**Technology Stack:**

- **tsdav** - WebDAV/CalDAV client library
- **ical.js** - iCalendar (ICS) format parsing and generation

**Core Libraries:**

- `lib/caldav-client.ts` - Low-level CalDAV operations
- `lib/calendar-sync.ts` - High-level sync logic
- `db.artistCalendars` - Configuration storage

### CalDAV Configuration

**Per-artist setup in admin:**

| Field | Example | Purpose |
|-------|---------|---------|
| Artist ID | `artist-uuid` | Link to artist record |
| Calendar URL | `https://portal.united-tattoos.com/remote.php/dav/calendars/username/appointments/` | WebDAV collection URL |
| Calendar ID | `appointments` | Calendar identifier |
| Sync Token | `https://...;cal-sync=...` | For incremental sync |
| Last Sync | 2024-12-01T14:23:00Z | Timestamp of last successful sync |

**Admin API for configuration:**

```typescript
// List all calendar configurations
GET /api/admin/calendars
→ [{artistId, calendarUrl, calendarId, lastSyncAt, syncLogs}]

// Create new calendar config (with connection test)
POST /api/admin/calendars
{
  artistId: string;
  calendarUrl: string;
  calendarId: string;
}
→ {id, message: "Connected successfully"}

// Update existing config
PUT /api/admin/calendars
{
  id: string;
  calendarUrl?: string;
  calendarId?: string;
}

// Delete configuration
DELETE /api/admin/calendars?id=calendar-uuid
```

### Event Format (iCalendar)

**Properties for appointments:**

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//United Tattoo//EN
BEGIN:VEVENT
UID:united-tattoo-appointment-uuid
DTSTAMP:20241201T142300Z
DTSTART:20241205T140000Z
DTEND:20241205T160000Z
SUMMARY:Client Name - Sleeve Tattoo (PENDING)
DESCRIPTION:Artist: Artist Name
Client: Client Name
Email: client@example.com
Phone: (123) 456-7890
Placement: Upper arm
Design Notes: Black and gray sleeve design

Status: PENDING
Deposit: $200
Total: $800
Notes: First session of 3-part series

X-APPOINTMENT-ID:appointment-uuid
X-ARTIST-ID:artist-uuid
X-CLIENT-ID:client-uuid
X-APPOINTMENT-STATUS:PENDING
STATUS:TENTATIVE
END:VEVENT
END:VCALENDAR
```

**Key fields:**

- `SUMMARY`: Shows client name and status
  - PENDING appointments: "REQUEST: Client Name - Title"
  - CONFIRMED/COMPLETED: "Client Name - Title"
- `STATUS`: Maps appointment status to iCalendar
  - PENDING → TENTATIVE
  - CONFIRMED → CONFIRMED
  - CANCELLED → CANCELLED
  - IN_PROGRESS/COMPLETED → CONFIRMED
- Custom X-properties for metadata

### Sync Operations

#### 1. Push to Calendar (Create/Update)

**When:** Appointment created or updated in app

```typescript
// lib/calendar-sync.ts
async syncAppointmentToCalendar(
  appointment: Appointment,
  context?: RequestContext
): Promise<{uid: string; etag: string} | null>
```

**Flow:**

```
1. Check if artist has CalDAV config
2. Get CalDAV client connection
3. Convert appointment to iCalendar format
4. If first sync: Create new event (POST)
5. If update: Modify existing event with ETag (PUT)
6. Store caldav_uid and caldav_etag in appointment record
7. Log sync operation
```

**Called from:**

- `POST /api/appointments` - After create
- `PUT /api/appointments/{id}` - After update status
- Admin calendar UI - When rescheduling

**Example:**

```typescript
const appointment = await db.appointments.create({
  artistId: 'artist-1',
  clientId: 'client-1',
  title: 'Full Sleeve',
  startTime: new Date('2024-12-10T14:00:00Z'),
  endTime: new Date('2024-12-10T16:00:00Z'),
  status: 'PENDING',
});

// Auto-synced:
await syncAppointmentToCalendar(appointment);
// → Event created in Nextcloud calendar
// → appointment.caldav_uid = "united-tattoo-uuid"
// → appointment.caldav_etag = "W/"123abc123abc""
```

#### 2. Delete from Calendar

**When:** Appointment cancelled or deleted

```typescript
async deleteAppointmentFromCalendar(
  appointment: Appointment,
  context?: RequestContext
): Promise<boolean>
```

**Flow:**

```
1. Check if caldav_uid exists
2. Get calendar event URL
3. Delete event using ETag
4. Clear caldav_uid from record
5. Log sync operation
```

#### 3. Pull from Nextcloud

**When:** Manual trigger or scheduled background job

```typescript
async pullCalendarEventsToDatabase(
  artistId: string,
  startDate: Date,
  endDate: Date,
  context?: RequestContext
): Promise<SyncResult>
```

**Flow:**

```
1. Get artist's CalDAV config
2. Fetch all events in date range from Nextcloud
3. For each event:
   - Check if appointment exists (by caldav_uid)
   - If exists: Compare and update if changed
   - If new: Create appointment record
4. Check for deleted appointments (in DB but not in calendar)
5. Return sync statistics
```

**Use Cases:**

- Artist creates event directly in Nextcloud calendar
- Events shared from other calendars
- Manual syncing after calendar migrations

#### 4. Real-time Availability Checking

**When:** User selects date/time during booking

**Endpoint:**

```typescript
GET /api/caldav/availability
?artistId=artist-uuid
&startTime=2024-12-10T14:00:00Z
&endTime=2024-12-10T16:00:00Z

→ {
  available: true | false,
  reason?: string,
  conflicts?: [{title, start, end}]
}
```

**Implementation:**

```typescript
async checkArtistAvailability(
  artistId: string,
  startTime: Date,
  endTime: Date,
  context?: RequestContext
): Promise<{available: boolean; reason?: string}>
```

**Logic:**

```
1. Check database appointments (faster)
2. If CalDAV configured: Query calendar
3. Apply 15-minute buffer before/after
4. Return availability + conflicting events
```

**Example response if conflict:**

```json
{
  "available": false,
  "reason": "Conflicts with existing appointment",
  "conflicts": [
    {
      "title": "Client Name - Sleeve Tattoo",
      "start": "2024-12-10T13:30:00Z",
      "end": "2024-12-10T15:30:00Z"
    }
  ]
}
```

### Conflict Detection

**15-Minute Buffer:**

- If requesting 2pm-4pm slot
- Actually checks 1:45pm-4:15pm availability
- Prevents back-to-back appointments

**Sources checked:**

1. Database appointments (instant)
2. Nextcloud calendar (if configured)
3. Artist availability rules (day of week restrictions)

### Sync Logging

**Every sync operation logged to `calendar_sync_logs`:**

```typescript
{
  id: uuid,
  artistId: 'artist-uuid',
  syncType: 'PUSH' | 'PULL' | 'FULL',
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL',
  errorMessage: null | 'Error details',
  eventsProcessed: 10,
  eventsCreated: 2,
  eventsUpdated: 3,
  eventsDeleted: 0,
  durationMs: 450,
  createdAt: '2024-12-01T14:23:00Z'
}
```

**Admin dashboard shows:**

- Last sync timestamp per artist
- Success/failure rate
- Number of events affected
- Error patterns

### Error Handling

**If CalDAV unavailable:**

```typescript
// Falls back to database-only availability checking
async checkDatabaseAvailability(
  artistId: string,
  startTime: Date,
  endTime: Date,
): Promise<{available: boolean}>
```

**Partial sync failures:**

- If sync fails for 1 event, others continue
- Logs error with event details
- Status marked as PARTIAL
- Admin notified to retry

**Connection testing:**

```typescript
// Admin can test connection before saving
POST /api/admin/calendars
{
  artistId: string,
  calendarUrl: string,
  calendarId: string
}
// Returns error if unreachable
```

### API Endpoints

**Appointment sync (automatic):**

```typescript
POST /api/appointments
// Auto-calls syncAppointmentToCalendar()

PUT /api/appointments/{id}
// Auto-calls syncAppointmentToCalendar() on status change

DELETE /api/appointments/{id}
// Auto-calls deleteAppointmentFromCalendar()
```

**Manual sync operations:**

```typescript
POST /api/caldav/sync
{
  artistId: string,
  startDate: string, // ISO date
  endDate: string,
  type: 'PUSH' | 'PULL' | 'FULL'
}
→ {success: true, result: SyncResult}

GET /api/caldav/availability
?artistId=...&startTime=...&endTime=...
→ {available: true/false, conflicts?: []}
```

**Configuration (admin only):**

```typescript
GET /api/admin/calendars
→ [{id, artistId, calendarUrl, calendarId, lastSyncAt, syncLogs: []}]

POST /api/admin/calendars
{artistId, calendarUrl, calendarId}

PUT /api/admin/calendars
{id, calendarUrl?, calendarId?}

DELETE /api/admin/calendars?id=...
```

---

## Admin CMS Capabilities

### Access Control

All admin features require role-based authentication:

- **SUPER_ADMIN:** Full access to all admin features
- **SHOP_ADMIN:** Artist, appointment, portfolio, and calendar management (not system settings)
- **ARTIST:** Dashboard for own profile and portfolio only
- **CLIENT:** Public booking interface only

**Protection:**

```typescript
// Admin routes
export const runtime = 'nodejs';

export default async function AdminPage() {
  const session = await requireAuth('SHOP_ADMIN');
  if (!session) redirect('/auth/signin');
  // ...
}
```

### Main Admin Dashboard (/app/admin/page.tsx)

**Layout:**

1. **Header:** Studio name, user menu, breadcrumbs
2. **Quick Action Cards:**
   - Manage Artists
   - Manage Appointments
   - Portfolio Manager
   - Settings

3. **Analytics Dashboard:**
   - Dynamically imported stats component
   - Fetches from `/api/admin/stats`

4. **Recent Activity Feed:**
   - Latest appointments created
   - Portfolio uploads
   - Artist profile changes

**Key Components:**

- `AdminSidebar` - Navigation menu
- `AdminHeader` - Top bar with user menu
- `StatCard` - Metric display with trend
- `ActivityFeed` - Recent actions log

### 1. Analytics Dashboard (/app/admin/analytics)

**Overview Tab:**

- Monthly appointment bookings chart
- Service type distribution pie chart
- Key statistics cards

**Cards:**

| Metric | Shows |
|--------|-------|
| Total Revenue | Sum of completed appointment amounts + trend |
| Total Bookings | Count of all appointments + trend |
| Active Artists | Count of is_active=true artists |
| Average Session Value | Total revenue / total bookings + trend |

**Revenue Tab:**

- 6-month revenue trend line chart
- Monthly breakdown
- Compare to previous period

**Artists Tab:**

- Top artists by bookings
- Top artists by revenue
- Performance rankings
- Filter by date range

**Services Tab:**

- Appointment styles breakdown (from tags)
- Popular placements (from notes)
- Most-requested artists
- Seasonal trends

**Data Source:**

```typescript
GET /api/admin/stats
→ {
  totalRevenue: number,
  totalAppointments: number,
  activeArtists: number,
  avgSessionValue: number,
  revenueByMonth: {month: string, amount: number}[],
  appointmentsByMonth: {month: string, count: number}[],
  artistPerformance: {artistId, name, bookings, revenue}[],
  serviceBreakdown: {service, count, percentage}[],
  trendData: {...}
}
```

### 2. Artists Management (/app/admin/artists)

**Listing Table:**

Features:
- Sortable columns (name, specialties, rate, status, created)
- Searchable by artist name
- Filterable by active status
- Pagination (25 rows per page)
- Column visibility toggle (TanStack Table)

**Columns:**

| Column | Content | Actions |
|--------|---------|---------|
| Name | Artist name | Click to edit |
| Specialties | Badge list | - |
| Hourly Rate | USD amount | - |
| Status | Active/Inactive badge | Toggle button |
| Created | Date | - |

**Actions per artist:**

- **Edit** → `/admin/artists/{id}` form
- **Manage Portfolio** → `/admin/artists/{id}/portfolio`
- **View Calendar** → Artist's upcoming appointments
- **Toggle Active** → Instantly changes is_active flag
- **Delete** → Soft delete (sets is_active=false)

**Add New Artist:**

Route: `/admin/artists/new`

**Form fields:**

```typescript
{
  name: string;        // Required
  email: string;       // Required, unique (creates user)
  bio: string;         // Required
  specialties: string[]; // Multi-select dropdown
  instagramHandle: string; // Optional, without @
  hourlyRate: number;  // Optional USD amount
  avatar: File?;       // Optional image upload
}
```

**On submit:**

1. Create user account (if new email)
2. Create artist profile
3. Auto-generate slug from name
4. Upload avatar to R2 if provided
5. Redirect to edit page

**Edit Artist:**

Route: `/admin/artists/{id}`

Same form as create, pre-filled with existing data.

**API:**

```typescript
GET /api/artists?limit=25&offset=0&search=name
→ {artists: Artist[], total: number}

GET /api/artists/{id}
→ Artist

POST /api/artists
{name, email, bio, specialties, instagramHandle, hourlyRate, avatar}
→ Artist

PUT /api/artists/{id}
{name, bio, specialties, instagramHandle, hourlyRate, isActive, avatar}
→ Artist

DELETE /api/artists/{id}
→ {success: true}
```

### 3. Portfolio Manager (/app/admin/portfolio)

**Component:** `<PortfolioManager />` (dynamically imported)

**Features:**

- **Grid view** with image thumbnails
- **Filter by artist** dropdown
- **Search by caption/tags** input
- **Upload area** (drag-drop or click)
- **Bulk operations** (select multiple + delete)
- **Edit metadata** (caption, tags, visibility)

**Image Card:**

```
┌─────────────────┐
│   [Image]       │
│   Caption       │
│   tags: tag1,   │
│   Visibility:   │
│   [Edit] [⊗]    │
└─────────────────┘
```

**Edit Dialog:**

```typescript
{
  caption: string;    // Image description
  tags: string[];     // Multi-select tag input
  isPublic: boolean;  // Toggle visibility
  orderIndex: number; // Manual sort order
}
```

**Upload:**

- Multipart form data
- Accepts JPEG, PNG, HEIC, WebP
- Auto-converts HEIC to JPEG
- Auto-resizes for mobile/desktop
- Generates AVIF variant
- Stores filename + original name + MIME type
- Returns public R2 URL

**Portfolio Stats Card:**

- Total public images
- Total private images
- Total storage used
- Last upload date

**API:**

```typescript
GET /api/portfolio
?artistId=artist-uuid
&isPublic=true
&limit=50
&offset=0
→ {images: PortfolioImage[], total: number}

GET /api/portfolio/stats
→ {
  totalPublic: number,
  totalPrivate: number,
  storageMB: number,
  lastUploadAt: ISO8601
}

POST /api/portfolio
FormData: {file, artistId, caption, tags}
→ PortfolioImage

PUT /api/portfolio/{id}
{caption, tags, isPublic, orderIndex}
→ PortfolioImage

DELETE /api/portfolio/{id}
→ {success: true}

POST /api/portfolio/bulk-delete
{ids: string[]}
→ {deleted: number}
```

### 4. Appointment Calendar (/app/admin/calendar)

**Stats Bar:**

```
┌──────────────────────────────────────┐
│ Total: 24 │ Pending: 3 │ Confirmed: 18 │
│ In Progress: 2 │ Completed: 1       │
└──────────────────────────────────────┘
```

**Calendar Component:**

Features:
- Month/week/day view toggle
- Drag-and-drop rescheduling
- Click date to create appointment
- Color-coded by status:
  - Yellow: PENDING
  - Blue: CONFIRMED
  - Green: COMPLETED
  - Red: CANCELLED
- Artist filter dropdown
- Navigate month/year

**Appointment Click:**

Shows detail popup:
```
Client: John Doe
Artist: Artist Name
Title: Full Sleeve Tattoo
Time: Dec 10, 2024 - 2:00 PM to 4:00 PM
Status: [PENDING → CONFIRMED → IN PROGRESS → COMPLETED]
Deposit: $200 / Total: $800
Notes: Black and gray, upper arm placement
[Edit] [Cancel] [Close]
```

**Create Appointment Dialog:**

Triggered by:
- Click on calendar date
- "New Appointment" button

**Form:**

```typescript
{
  artistId: string;        // Required, dropdown
  clientName: string;      // Required
  clientEmail: string;     // Required
  clientPhone: string;     // Optional
  title: string;           // Required (e.g., "Full Sleeve")
  description: string;     // Optional
  startTime: DateTime;     // Required date/time picker
  endTime: DateTime;       // Required (auto-calculates duration)
  depositAmount: number;   // Optional
  totalAmount: number;     // Optional
  notes: string;           // Optional (placement, design notes)
}
```

**On submit:**

1. Create/find client user (CLIENT role)
2. Create appointment
3. Check availability (real-time CalDAV query)
4. Sync to Nextcloud calendar
5. Calendar updates in real-time
6. Confirmation notification

**Drag-to-Reschedule:**

1. Drag appointment to new time slot
2. Check availability at new time
3. Show conflict dialog if blocked
4. Update appointment + sync calendar
5. Animate success

**Status Updates:**

Click status dropdown to:
- PENDING → CONFIRMED
- CONFIRMED → IN PROGRESS
- IN PROGRESS → COMPLETED
- (Any) → CANCELLED

**API:**

```typescript
GET /api/appointments
?artistId=...
&startDate=2024-12-01
&endDate=2024-12-31
&status=PENDING|CONFIRMED
→ {appointments: Appointment[], total: number}

POST /api/appointments
{artistId, clientId|clientName, title, startTime, endTime, ...}
→ Appointment

PUT /api/appointments/{id}
{title, startTime, endTime, status, depositAmount, totalAmount, notes}
→ Appointment

DELETE /api/appointments/{id}
→ {success: true}

GET /api/caldav/availability
?artistId=...&startTime=...&endTime=...
→ {available: boolean, conflicts?: []}

POST /api/users
{email, name, role: 'CLIENT'}
→ User
```

### 5. Settings Manager (/app/admin/settings)

**Component:** `<SettingsManager />` (dynamically imported)

**Tabs:**

#### Studio Information

```typescript
{
  studioName: string;      // Display name
  description: string;     // Long description
  address: string;         // Physical address
  phone: string;           // Contact phone
  email: string;           // Contact email
  heroImage: File?;        // Hero section image
  logoUrl: string?;        // Logo image URL
}
```

#### Business Hours

```typescript
businessHours: [
  {day: "Monday", open: "10:00", close: "18:00", closed: false},
  {day: "Tuesday", open: "10:00", close: "18:00", closed: false},
  // ... rest of week
  {day: "Sunday", open: null, close: null, closed: true}
]
```

**UI:**
- Day-by-day selector
- Time pickers (24-hour format)
- "Closed" checkbox per day
- Copy hours to multiple days

#### Social Media

```typescript
{
  instagram: string?;      // URL
  facebook: string?;       // URL
  twitter: string?;        // URL
  tiktok: string?;         // URL
}
```

#### User Permissions

*Future expansion for role customization*

#### System Configuration

- CalDAV settings status (connected/disconnected)
- Last sync timestamp per artist
- SMTP email settings (future)
- Backup status (future)

**On save:**

1. Validate all fields
2. Upload hero image if changed
3. Update site_settings table
4. Clear cache
5. Show success notification

**API:**

```typescript
GET /api/admin/settings
→ SiteSettings

PUT /api/admin/settings
{studioName, description, address, phone, email, socialMedia, businessHours, heroImage, logoUrl}
→ SiteSettings
```

### 6. File Manager (/app/admin/uploads)

**Component:** `<FileManager />` (dynamically imported)

**Features:**

- **View toggle:** Grid or list view
- **File type filter:** All files, images only
- **Search by filename**
- **Sort by:** Date, size, name
- **Upload area:** Drag-drop or click

**File Card (Grid):**

```
┌─────────────────────┐
│    [Thumbnail]      │
│  filename.jpg       │
│  2.4 MB             │
│  12/01/2024 2:30pm  │
│  [Copy URL] [⊗]     │
└─────────────────────┘
```

**File Row (List):**

```
filename.jpg | 2.4 MB | JPG | 12/01/2024 2:30pm | [Copy URL] [⊗]
```

**Upload:**

```typescript
POST /api/upload
FormData: {file}
Headers: Authorization: Bearer token
→ {
  id: string,
  filename: string,
  originalName: string,
  mimeType: string,
  size: number,
  url: string,
  uploadedBy: userId,
  createdAt: ISO8601
}
```

**Features:**

- Drag-drop upload
- Progress indicator
- Multiple file upload
- Upload history
- File metadata display

**Actions:**

- Copy public URL to clipboard
- Delete file (removes from R2)
- Download file
- Open in new tab
- Preview images inline

**API:**

```typescript
GET /api/uploads
?type=images|all
&search=filename
&sort=date|size|name
&limit=50
&offset=0
→ {files: FileUpload[], total: number}

POST /api/upload
FormData: {file}
→ FileUpload

DELETE /api/uploads/{id}
→ {success: true}
```

### 7. Calendar Configuration (Implied)

**Location:** Admin dashboard, settings section or dedicated page

**List:**

Shows all artist calendar configurations:

```
┌────────────────────────────────────────────┐
│ Artist | Calendar | Last Sync | Status     │
├────────────────────────────────────────────┤
│ Artist 1 | appointments | 1 min ago | ✓   │
│ Artist 2 | schedule | 5 mins ago | ✓       │
│ Artist 3 | - | - | (Not configured)        │
│ [+ Add Calendar]                           │
└────────────────────────────────────────────┘
```

**Add/Edit Dialog:**

```typescript
{
  artistId: string;        // Required, dropdown
  calendarUrl: string;     // Required, WebDAV URL
  calendarId: string;      // Required, calendar name
}
```

**Test connection button:**

- Before saving, tests CalDAV connection
- Shows error if unreachable
- Confirms credentials work

**Sync Info:**

- Last sync timestamp
- Sync status (success/failed)
- Number of events synced
- Recent sync logs

**Manual sync button:**

- Trigger full sync for artist
- Shows progress
- Displays results (events created/updated/deleted)

### Artist Dashboard (/app/artist-dashboard)

**Accessible by:** ARTIST role users

#### Dashboard Home

- Welcome message with artist name
- Quick stats:
  - Upcoming appointments count
  - Total portfolio images
  - Total flash designs
- Recent appointments (next 7 days)
- Quick action links

**API:**

```typescript
GET /api/artists/me
→ {
  id, userId, name, slug, bio, specialties, instagramHandle,
  hourlyRate, isActive, portfolio: PortfolioImage[],
  flashItems: FlashItem[], upcomingAppointments: Appointment[]
}
```

#### Profile Editor (/artist-dashboard/profile)

**Form:**

```typescript
{
  bio: string;              // Artist biography
  specialties: string[];    // Multi-select
  instagramHandle: string;  // No @ prefix
  hourlyRate: number;       // USD
  avatar: File?;            // Profile picture
}
```

**On save:**

1. Validate fields
2. Upload avatar if changed
3. Update artist record
4. Show success notification

#### Portfolio Manager (/artist-dashboard/portfolio)

**Features:**

- Upload new images
- View all portfolio images
- Edit captions and tags
- Toggle public/private visibility
- Delete images
- Reorder with drag-drop
- View public portfolio preview

**Upload:**

```typescript
POST /api/portfolio
{file, caption, tags}
```

**Bulk Actions:**

- Select multiple images
- Delete selected
- Change visibility for selected
- Add tags to selected

**Tips Card:**

- High-quality images work best
- Recommended aspect ratios
- Portfolio optimization tips

### API Summary

**Public APIs:**

```typescript
GET /api/artists              // List public artists
GET /api/artists/{id|slug}    // Get artist + portfolio
```

**Protected Artist APIs:**

```typescript
GET /api/artists/me
POST /api/portfolio
PUT /api/portfolio/{id}
DELETE /api/portfolio/{id}
GET /api/appointments         // Own appointments only
```

**Admin APIs:**

```typescript
GET /api/artists
POST /api/artists
PUT /api/artists/{id}
DELETE /api/artists/{id}

GET /api/portfolio
PUT /api/portfolio/{id}
POST /api/portfolio/bulk-delete

GET /api/appointments
POST /api/appointments
PUT /api/appointments/{id}
DELETE /api/appointments/{id}

GET /api/admin/stats
GET /api/admin/settings
PUT /api/admin/settings

GET /api/admin/calendars
POST /api/admin/calendars
PUT /api/admin/calendars
DELETE /api/admin/calendars

GET /api/caldav/availability
POST /api/caldav/sync

GET /api/uploads
POST /api/upload
DELETE /api/uploads/{id}
```

---

## Architecture Patterns

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Server & client components, API routes |
| Language | TypeScript | Type safety across stack |
| Database | Cloudflare D1 (SQLite) | Data persistence |
| Storage | Cloudflare R2 | File storage (images, uploads) |
| Authentication | NextAuth.js | Session management, OAuth |
| OAuth Provider | Nextcloud | Central auth, user provisioning |
| Calendar | CalDAV (tsdav) | Bidirectional sync with Nextcloud |
| UI Components | ShadCN UI | Pre-built, customizable components |
| Styling | Tailwind CSS | Utility-first CSS framework |
| State Management | TanStack Query | Data fetching, caching, mutations |
| Testing | Vitest | Unit and integration tests |
| Deployment | Cloudflare Workers | Serverless edge computing |

### Key Patterns

**Server Components for Data:**

```typescript
// app/admin/page.tsx
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function AdminPage() {
  const session = await requireAuth('SHOP_ADMIN');
  const stats = await db.appointments.getStats();

  return <AdminDashboard stats={stats} />;
}
```

**Client Components for Interactivity:**

```typescript
'use client';

import { useMutation } from '@tanstack/react-query';

export function ArtistForm() {
  const mutation = useMutation({
    mutationFn: (data) => fetch('/api/artists', {method: 'POST', body: JSON.stringify(data)}),
  });

  return <Form onSubmit={(data) => mutation.mutate(data)} />;
}
```

**Namespace-Style DB Exports:**

```typescript
// Consistent API across all tables
await db.artists.findMany()
await db.appointments.create(data)
await db.portfolioImages.update(id, data)
await db.siteSettings.findFirst()
```

**Dynamic Imports for Code Splitting:**

```typescript
const PortfolioManager = dynamic(() => import('@/components/admin/portfolio-manager'), {
  loading: () => <LoadingSkeleton />,
});

export default function AdminPortfolio() {
  return <PortfolioManager />;
}
```

**Error Boundaries:**

```typescript
<ErrorBoundary fallback={<ErrorCard />}>
  <PortfolioManager />
</ErrorBoundary>
```

**Optimistic Updates:**

```typescript
const mutation = useMutation({
  mutationFn: updateAppointment,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({queryKey: ['appointments']});
    const previous = queryClient.getQueryData(['appointments']);
    queryClient.setQueryData(['appointments'], (old) => [...old, newData]);
    return {previous};
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(['appointments'], context.previous);
  },
});
```

**Real-Time Validation:**

```typescript
const form = useForm({
  resolver: zodResolver(appointmentSchema),
  mode: 'onChange',
});

// Validates as user types
const email = form.watch('email');
```

**Role-Based Access Control:**

```typescript
export async function requireAuth(requiredRole?: Role) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Unauthorized');
  if (requiredRole && !hasRole(session.user.role, requiredRole)) {
    throw new Error('Forbidden');
  }
  return session;
}
```

---

## Environment Configuration

### Required Variables

**Core Application:**

```bash
# Authentication
NEXTAUTH_URL="https://united-tattoos.com"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Nextcloud OAuth (Required for artist auth)
NEXTCLOUD_BASE_URL="https://portal.united-tattoos.com"
NEXTCLOUD_OAUTH_CLIENT_ID="your-client-id"
NEXTCLOUD_OAUTH_CLIENT_SECRET="your-client-secret"
NEXTCLOUD_ARTISTS_GROUP="artists"           # Customizable
NEXTCLOUD_ADMINS_GROUP="shop_admins"        # Customizable
```

**Database (Legacy, actual runtime uses D1 bindings):**

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

**Cloudflare R2 Storage:**

```bash
AWS_ACCESS_KEY_ID="your-r2-access-key"
AWS_SECRET_ACCESS_KEY="your-r2-secret"
AWS_REGION="auto"
AWS_BUCKET_NAME="united-tattoo"
AWS_ENDPOINT_URL="https://your-account.r2.cloudflarestorage.com"
```

**Nextcloud CalDAV (Optional, for calendar sync):**

```bash
NEXTCLOUD_USERNAME="service-account"
NEXTCLOUD_PASSWORD="app-specific-password"
NEXTCLOUD_CALENDAR_BASE_PATH="/remote.php/dav/calendars"
```

**Migration Token (For protected endpoints):**

```bash
MIGRATE_TOKEN="ut_migrate_20251006_rotated_1a2b3c"
```

### Wrangler Configuration

**wrangler.toml:**

```toml
name = "united-tattoo"
type = "service-worker"
compatibility_date = "2024-12-01"

# Cloudflare D1 Database
[[d1_databases]]
binding = "DB"
database_name = "united-tattoo"
database_id = "7191a4c4-e3b2-49c6-bd8d-9cc3394977ec"
migrations_dir = "sql/migrations_up"

# Cloudflare R2 Bucket
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "united-tattoo"
jurisdiction = "eu"

# Build Configuration
[build]
command = "npm run pages:build"
cwd = "./"
watch_paths = ["src/**/*.ts", "src/**/*.tsx"]

# Env Configuration
[env.production]
routes = [
  { pattern = "united-tattoos.com/*", zone_name = "united-tattoos.com" }
]

# Node.js Compatibility
[nodejs_compat]
enabled = true
```

### Development Setup

**Create `.env.local`:**

```bash
cp .env.example .env.local
```

**Required for local dev:**

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key"
NEXTCLOUD_BASE_URL="https://portal.united-tattoos.com"
# ... other Nextcloud vars from production
```

**Local database:**

```bash
# Create local D1 database
npm run db:migrate:local

# View tables
npm run db:studio:local

# Run dev server
npm run dev
```

---

## Deployment

### Build Process

```bash
# Build with OpenNext for Cloudflare
npm run pages:build

# Builds to .vercel/output/static

# Deploy to Cloudflare Pages
wrangler pages deploy .vercel/output/static
```

### CI/CD Pipeline

**Located in** `.gitea/workflows/`:

1. **ci.yaml** - Main pipeline
   - ESLint
   - TypeScript type checking
   - Vitest unit/integration tests
   - Build verification
   - Bundle size budgets

2. **deploy.yaml** - Deploy on merge to main
   - Build with OpenNext
   - Deploy to Cloudflare

3. **security.yaml** - Security audits
   - npm audit
   - Dependency scanning

### Production Checklist

- [ ] Database migrations applied
- [ ] Nextcloud OAuth app configured
- [ ] R2 bucket created and credentials added
- [ ] Environment variables set in Cloudflare
- [ ] CalDAV service account credentials (optional)
- [ ] Domain SSL certificate
- [ ] Email sending configured (future)
- [ ] Backup strategy in place

---

## Troubleshooting

### Database Connection Issues

**Error: "Cannot find D1 binding"**

- Check `wrangler.toml` has `[[d1_databases]]` section
- Verify database_id matches Cloudflare account
- Run migrations: `npm run db:migrate:latest:prod`

### Nextcloud OAuth Issues

**"Invalid redirect URI"**

- Verify redirect URI in Nextcloud matches deployment URL
- Format: `https://united-tattoos.com/api/auth/nextcloud/callback`

**"User not found in groups"**

- Verify user is in Nextcloud `artists` or `shop_admins` group
- Check group names match environment variables
- Service account must have permission to read groups

### CalDAV Sync Issues

**"Calendar not found"**

- Verify calendar URL is accessible from worker
- Test connection in admin settings
- Check artist calendar configuration exists

**"ETag mismatch"**

- Clear `caldav_etag` from appointment record
- Next sync will create fresh event

**"Connection timeout"**

- Check Nextcloud instance is responding
- Increase timeout in `lib/caldav-client.ts`
- May need to disable CalDAV temporarily

---

**Document Version:** 1.0
**Last Updated:** December 2025
**Maintained By:** Development Team
