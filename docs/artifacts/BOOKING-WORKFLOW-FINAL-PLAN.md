# Booking Workflow - Final Implementation Plan

**Version:** 3.0 FINAL  
**Date:** January 9, 2025  
**Status:** Ready for Implementation with All Decisions Made

---

## ✅ Critical Decisions (LOCKED IN)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Customer Auth** | ❌ NO LOGIN | Zero friction, book in 2 minutes |
| **Staff Auth** | ✅ Nextcloud OAuth2 | Already configured, SSO |
| **Email Service** | ✅ Resend | Free tier, easy, modern |
| **Monitoring** | ✅ Cloudflare + Sentry Free | Best of both worlds |
| **Artist Data** | ✅ D1 (existing) | NO MIGRATION NEEDED |
| **Artist Linking** | ✅ Via users.email | Simple FK join |
| **Timezone** | ✅ America/Denver | Hardcoded for Colorado |

---

## 🎯 Authentication Architecture (FINAL)

### Two-Tier System

```
┌──────────────────────────────────────────────┐
│  CUSTOMERS (Public)                          │
│  ❌ NO ACCOUNT REQUIRED                      │
│  ❌ NO LOGIN                                 │
│  ✅ Just email + phone                       │
│  ✅ Book anonymously                         │
│  ✅ Receive confirmation via email           │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  ARTISTS & ADMINS (Internal)                 │
│  ✅ Nextcloud OAuth2 Login                   │
│  ✅ Already configured!                      │
│  ✅ Client ID: PZmqmi9vxYjtyWzt...           │
│  ✅ Single Sign-On                           │
└──────────────────────────────────────────────┘
```

---

## 🗄️ Artist Data Architecture (SOLVED!)

### Current Schema (NO CHANGES NEEDED!)

```sql
users table:
  ├─ id TEXT (PK)
  ├─ email TEXT (← LINK TO NEXTCLOUD)
  ├─ name TEXT
  ├─ role TEXT (ARTIST, SHOP_ADMIN, etc.)
  └─ ...

artists table:
  ├─ id TEXT (PK)
  ├─ user_id TEXT (FK → users.id)  ← JOIN HERE!
  ├─ name TEXT
  ├─ bio TEXT
  ├─ specialties TEXT (JSON)
  ├─ instagram_handle TEXT
  ├─ is_active BOOLEAN
  └─ ...

artist_calendars table (NEW):
  ├─ id TEXT (PK)
  ├─ artist_id TEXT (FK → artists.id)
  ├─ calendar_url TEXT
  └─ ...
```

### Linking Strategy

```typescript
// To link artist to Nextcloud calendar:
const artist = await db.prepare(`
  SELECT a.*, u.email 
  FROM artists a
  JOIN users u ON a.user_id = u.id
  WHERE a.id = ?
`).bind(artistId).first()

// Now we have artist.email!
// This matches their Nextcloud user email
// Their calendar URL: portal.united-tattoos.com/remote.php/dav/calendars/{email}/personal/
```

**No Migration Needed!** Just use the existing FK relationship.

---

## 👥 Artist Lifecycle Management

### When Artist Joins

**Option 1: Nextcloud First (Recommended)**
```
1. Admin creates Nextcloud user
   - Email: artist@email.com
   - Group: "artist"
   - Calendar created automatically

2. Admin creates User in D1
   - Email: artist@email.com (matches Nextcloud)
   - Role: ARTIST

3. Admin creates Artist profile in D1
   - user_id: [user from step 2]
   - Bio, specialties, etc.

4. Admin links calendar
   - Via /admin/calendars UI
   - Auto-generates calendar URL from user email
```

**Option 2: D1 First**
```
1. Admin creates User + Artist in D1

2. Admin creates Nextcloud user (manually)
   - Must use SAME email as D1 user

3. Admin links calendar via UI
```

### When Artist Leaves

```sql
-- Don't delete! Just deactivate
UPDATE artists SET is_active = FALSE WHERE id = ?;
UPDATE users SET role = 'CLIENT' WHERE id = ?;

-- Keep their:
✅ Portfolio images (history)
✅ Past appointments (records)
✅ Calendar config (can reactivate)

-- They lose:
❌ Access to admin dashboard
❌ Visibility on website
❌ Ability to receive new bookings
```

### Artist Updates

```
Name/Bio change: Update in D1 (web reflects immediately)
Email change: Update users.email AND Nextcloud email (both must match!)
Calendar change: Update via /admin/calendars UI
```

---

## 🔐 Nextcloud OAuth2 Configuration

### Already Configured!

**Nextcloud Details:**
- Base URL: `https://portal.united-tattoos.com`
- Client ID: `PZmqmi9vxYjtyWzt7f8QZk61jtwoAaqZ5bZz6wLvYUu4lYc0PPY6cx9qcBgDh5QI`
- Client Secret: `tkf7Ytc4vQII47OhumKBl3O3p6WhiPFQBzb5DJhw7ZjmJwDE0zTGwYGwF0MJjcsm`

**Callback URLs (need to verify these are set in Nextcloud):**
- Dev: `http://localhost:3000/api/auth/callback/nextcloud`
- Prod: `https://united-tattoos.com/api/auth/callback/nextcloud`

**User Info Endpoint:**
`https://portal.united-tattoos.com/ocs/v2.php/cloud/user?format=json`

---

## 📧 Resend Email Configuration

### Credentials

**API Key:** `re_NkMnKyNY_5eHUS1Ajj24GgmTNajHVeehQ`

### DNS Configuration (Cloudflare)

Add these records to `united-tattoos.com` in Cloudflare DNS:

```
1. Go to Resend Dashboard → Domains → Add united-tattoos.com
2. Resend will show you 3 DNS records to add
3. Add them to Cloudflare:
   
   Type: TXT
   Name: resend._domainkey.united-tattoos.com
   Value: [Resend will provide this - looks like "p=MIGfMA0GCSqGSIb3..."]
   
   Type: TXT  
   Name: _dmarc.united-tattoos.com
   Value: v=DMARC1; p=none;
   
   Type: MX (if you want to receive emails)
   Name: united-tattoos.com
   Priority: 10
   Value: feedback-smtp.us-east-1.amazonses.com
```

**Sender Address:** `bookings@united-tattoos.com`

---

## 📋 FINAL Implementation Plan

## PHASE 0: Foundation (1-2 days)

### 0.1 Database Migration for Anonymous Bookings

**File: `sql/migrations/20250110_anonymous_bookings.sql`**

```sql
-- Allow anonymous bookings - store customer info directly on appointment
ALTER TABLE appointments ADD COLUMN client_name TEXT;
ALTER TABLE appointments ADD COLUMN client_email TEXT;
ALTER TABLE appointments ADD COLUMN client_phone TEXT;

-- client_id becomes optional (NULL for anonymous bookings)
-- In D1/SQLite we can't easily make FK optional, so we'll handle in app logic
```

### 0.2 Set Up Nextcloud OAuth2 Provider

**File: `lib/auth.ts`** (UPDATE)

```typescript
import NextAuth, { NextAuthOptions } from "next-auth"
import { getDB } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "nextcloud",
      name: "Nextcloud",
      type: "oauth",
      authorization: {
        url: "https://portal.united-tattoos.com/apps/oauth2/authorize",
        params: { scope: "openid profile email" },
      },
      token: "https://portal.united-tattoos.com/apps/oauth2/api/v1/token",
      userinfo: "https://portal.united-tattoos.com/ocs/v2.php/cloud/user?format=json",
      clientId: process.env.NEXTCLOUD_CLIENT_ID,
      clientSecret: process.env.NEXTCLOUD_CLIENT_SECRET,
      profile(profile) {
        // Nextcloud returns user info in ocs.data
        return {
          id: profile.ocs.data.id,
          name: profile.ocs.data.displayname,
          email: profile.ocs.data.email,
          image: null, // Nextcloud avatar handling can be added later
        }
      },
    },
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID and role from database
      if (session.user && token.email) {
        const db = getDB()
        const user = await db
          .prepare('SELECT id, role FROM users WHERE email = ?')
          .bind(token.email)
          .first()
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
        }
      }
      
      return session
    },
    async signIn({ user, account, profile }) {
      // Verify user is in allowed Nextcloud groups
      // Could call Nextcloud API to check group membership
      // For now, just allow anyone with Nextcloud account
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

export const handler = NextAuth(authOptions)
```

**Environment Variables:**
```env
NEXTCLOUD_CLIENT_ID=PZmqmi9vxYjtyWzt7f8QZk61jtwoAaqZ5bZz6wLvYUu4lYc0PPY6cx9qcBgDh5QI
NEXTCLOUD_CLIENT_SECRET=tkf7Ytc4vQII47OhumKBl3O3p6WhiPFQBzb5DJhw7ZjmJwDE0zTGwYGwF0MJjcsm
NEXTCLOUD_BASE_URL=https://portal.united-tattoos.com
```

### 0.3 Create Admin Middleware

**File: `middleware.ts`** (UPDATE)

```typescript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes require SHOP_ADMIN or SUPER_ADMIN
    if (path.startsWith('/admin')) {
      if (!token || (token.role !== 'SHOP_ADMIN' && token.role !== 'SUPER_ADMIN')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    // Artist dashboard requires ARTIST role
    if (path.startsWith('/artist-dashboard')) {
      if (!token || token.role !== 'ARTIST') {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public routes - no auth needed
        if (path === '/' || 
            path.startsWith('/artists') || 
            path.startsWith('/book') ||
            path.startsWith('/aftercare') ||
            path.startsWith('/api/artists') ||
            path.startsWith('/api/appointments') && req.method === 'POST' ||
            path.startsWith('/api/caldav/availability')) {
          return true
        }
        
        // Protected routes
        if (path.startsWith('/admin') || path.startsWith('/artist-dashboard')) {
          return !!token
        }
        
        // All other routes public
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/artist-dashboard/:path*'],
}
```

### 0.4 Set Up Resend Email Service

**Install:**
```bash
npm install resend
```

**File: `lib/email.ts`**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'United Tattoo <bookings@united-tattoos.com>'

export async function sendBookingConfirmationEmail(appointment: {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  artist_name: string
  start_time: string
  end_time: string
  description: string
}) {
  const startTime = new Date(appointment.start_time)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Denver',
  }).format(startTime)
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/Denver',
  }).format(startTime)

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.client_email,
      subject: '✨ Your Tattoo Booking Request - United Tattoo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1a1a1a; font-size: 28px; margin-bottom: 10px;">Booking Request Received! ✅</h1>
              <p style="color: #666; font-size: 16px;">We can't wait to create something amazing with you</p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="margin-top: 0; color: #1a1a1a; font-size: 20px;">Appointment Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500;">Artist:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${appointment.artist_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500;">Date:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500;">Time:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: 500; vertical-align: top;">Description:</td>
                  <td style="padding: 8px 0; color: #1a1a1a;">${appointment.description}</td>
                </tr>
              </table>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px;">
              <p style="margin: 0; color: #856404;"><strong>⏳ Pending Approval</strong></p>
              <p style="margin: 5px 0 0; color: #856404; font-size: 14px;">Your request is being reviewed by ${appointment.artist_name}</p>
            </div>

            <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 15px;">What Happens Next?</h2>
            <ol style="color: #666; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Your artist will review your request and check their availability (usually within 24 hours)</li>
              <li style="margin-bottom: 10px;">You'll receive another email when your appointment is confirmed</li>
              <li style="margin-bottom: 10px;">Once confirmed, you can pay your deposit at the shop or via a secure payment link</li>
              <li style="margin-bottom: 10px;">Show up ready! Bring a valid ID and arrive 10 minutes early</li>
            </ol>

            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-top: 25px;">
              <h3 style="margin-top: 0; color: #0066cc; font-size: 18px;">Need to Make Changes?</h3>
              <p style="color: #333; margin-bottom: 10px;">Contact us:</p>
              <p style="margin: 5px 0; color: #333;">📞 <a href="tel:+17195551234" style="color: #0066cc; text-decoration: none;">(719) 555-1234</a></p>
              <p style="margin: 5px 0; color: #333;">✉️ <a href="mailto:info@united-tattoos.com" style="color: #0066cc; text-decoration: none;">info@united-tattoos.com</a></p>
              <p style="margin: 5px 0; color: #333;">📍 123 Main St, Fountain, CO 80817</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">United Tattoo - Fountain, Colorado</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0;">You're receiving this because you requested an appointment</p>
            </div>

          </body>
        </html>
      `,
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Email send failed:', error)
    // Don't throw - we don't want email failure to break booking
    // Just log it and continue
    return null
  }
}

export async function sendBookingStatusChangeEmail(appointment: {
  id: string
  client_name: string
  client_email: string
  artist_name: string
  start_time: string
  status: string
  description: string
}) {
  const startTime = new Date(appointment.start_time)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Denver',
  }).format(startTime)
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/Denver',
  }).format(startTime)

  const statusConfig = {
    CONFIRMED: {
      subject: '✅ Your Tattoo Appointment is Confirmed!',
      title: 'Great News! Your Appointment is Confirmed',
      message: `${appointment.artist_name} has confirmed your tattoo appointment!`,
      action: 'You can pay your deposit at the shop or we\'ll send you a secure payment link separately.',
      color: '#28a745',
    },
    CANCELLED: {
      subject: '📅 Appointment Update - United Tattoo',
      title: 'Appointment Rescheduling Needed',
      message: 'We need to reschedule your appointment due to a scheduling conflict.',
      action: 'Please call us at (719) 555-1234 to find a new time that works for you.',
      color: '#dc3545',
    },
  }

  const config = statusConfig[appointment.status as keyof typeof statusConfig]
  if (!config) return null // Don't send for other statuses

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.client_email,
      subject: config.subject,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: ${config.color}; font-size: 28px; margin-bottom: 10px;">${config.title}</h1>
              <p style="color: #666; font-size: 16px;">${config.message}</p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="margin-top: 0; color: #1a1a1a; font-size: 20px;">Appointment Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Artist:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${appointment.artist_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Date:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Time:</td>
                  <td style="padding: 8px 0; color: #1a1a1a; font-weight: 600;">${formattedTime}</td>
                </tr>
              </table>
            </div>

            <p style="color: #333; font-size: 16px;">${config.action}</p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px;">Questions? Call (719) 555-1234</p>
              <p style="color: #999; font-size: 12px; margin-top: 10px;">United Tattoo - Fountain, CO</p>
            </div>

          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Status change email failed:', error)
    return null
  }
}

// Send notification to artist when new booking received
export async function sendArtistBookingNotification(appointment: {
  id: string
  client_name: string
  artist_email: string
  artist_name: string
  start_time: string
  description: string
}) {
  const startTime = new Date(appointment.start_time)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Denver',
  }).format(startTime)
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/Denver',
  }).format(startTime)

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: appointment.artist_email,
      subject: '🔔 New Booking Request',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1a1a1a;">New Booking Request</h1>
            <p>You have a new tattoo appointment request:</p>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Client:</strong> ${appointment.client_name}</p>
              <p><strong>Requested Date:</strong> ${formattedDate}</p>
              <p><strong>Requested Time:</strong> ${formattedTime}</p>
              <p><strong>Description:</strong> ${appointment.description}</p>
            </div>

            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Check your Nextcloud calendar - this appears as "REQUEST: ${appointment.client_name}"</li>
              <li>Log in to the admin dashboard to approve or reschedule</li>
              <li>Or edit the calendar event in Nextcloud (remove "REQUEST:" to approve)</li>
            </ol>

            <p>
              <a href="https://united-tattoos.com/admin/bookings" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
                View in Dashboard
              </a>
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              United Tattoo Admin System
            </p>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Artist notification email failed:', error)
    return null
  }
}
```

**Environment Variable:**
```env
RESEND_API_KEY=re_NkMnKyNY_5eHUS1Ajj24GgmTNajHVeehQ
```

### 0.5 Install Dependencies

```bash
npm install resend date-fns-tz @sentry/nextjs
```

---

## PHASE 1: Anonymous Customer Booking (2-3 days)

### 1.1 Update Appointments API for Anonymous Bookings

**File: `app/api/appointments/route.ts`** (MAJOR UPDATE)

```typescript
const createAppointmentSchema = z.object({
  artistId: z.string().min(1),
  // NO clientId - this is anonymous!
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().min(10, "Phone number is required"),
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  depositAmount: z.number().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest, ...) {
  try {
    // NO AUTHENTICATION CHECK - Public endpoint for customer bookings
    
    if (!Flags.BOOKING_ENABLED) {
      return bookingDisabledResponse()
    }

    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    const db = getDB(context?.env)

    // Check CalDAV availability (Nextcloud is source of truth)
    const startDate = new Date(validatedData.startTime)
    const endDate = new Date(validatedData.endTime)
    
    const availabilityCheck = await checkArtistAvailability(
      validatedData.artistId,
      startDate,
      endDate,
      context
    )

    if (!availabilityCheck.available) {
      return NextResponse.json(
        { 
          error: 'Time slot not available',
          reason: availabilityCheck.reason || 'Selected time slot conflicts with existing booking.'
        },
        { status: 409 }
      )
    }

    // Create appointment with customer contact info (no user ID)
    const appointmentId = crypto.randomUUID()
    const insertStmt = db.prepare(`
      INSERT INTO appointments (
        id, artist_id, client_id, client_name, client_email, client_phone,
        title, description, start_time, end_time,
        status, deposit_amount, notes, created_at, updated_at
      ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    await insertStmt.bind(
      appointmentId,
      validatedData.artistId,
      validatedData.clientName,
      validatedData.clientEmail,
      validatedData.clientPhone,
      validatedData.title,
      validatedData.description || null,
      validatedData.startTime,
      validatedData.endTime,
      validatedData.depositAmount || null,
      validatedData.notes || null
    ).run()

    // Fetch created appointment with artist info
    const appointment = await db.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.email as artist_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON ar.user_id = u.id
      WHERE a.id = ?
    `).bind(appointmentId).first()

    // Sync to CalDAV (non-blocking)
    try {
      await syncAppointmentToCalendar(appointment as any, context)
    } catch (syncError) {
      console.error('CalDAV sync failed:', syncError)
    }

    // Send emails (non-blocking)
    try {
      // Email to customer
      await sendBookingConfirmationEmail(appointment as any)
      
      // Email to artist
      await sendArtistBookingNotification({
        id: appointment.id,
        client_name: appointment.client_name,
        artist_email: appointment.artist_email,
        artist_name: appointment.artist_name,
        start_time: appointment.start_time,
        description: appointment.description,
      })
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    // ... error handling
  }
}
```

### 1.2 Update Booking Form (Remove All Auth!)

**File: `components/booking-form.tsx`**

REMOVE these lines:
```typescript
// DELETE THIS:
import { useSession } from 'next-auth/react'
const { data: session } = useSession()

// DELETE THIS:
if (!session?.user) {
  toast.error('Please sign in')
  router.push('/auth/signin')
  return
}
```

UPDATE handleSubmit:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!bookingEnabled) {
    toast.error('Booking temporarily unavailable')
    return
  }

  // NO SESSION CHECK!

  if (!selectedArtist || !appointmentStart || !appointmentEnd) {
    toast.error('Please complete all required fields')
    return
  }

  createBooking.mutate({
    artistId: selectedArtist.id,
    clientName: `${formData.firstName} ${formData.lastName}`,
    clientEmail: formData.email,
    clientPhone: formData.phone,
    title: `Tattoo: ${formData.tattooDescription.substring(0, 50)}`,
    description: formData.tattooDescription,
    startTime: appointmentStart,
    endTime: appointmentEnd,
    depositAmount: formData.depositAmount,
    notes: formData.specialRequests,
  }, {
    onSuccess: (data) => {
      router.push(`/book/confirm/${data.appointment.id}`)
    }
  })
}
```

### 1.3 Update Confirmation Page (Public, No Auth!)

**File: `app/book/confirm/[id]/page.tsx`**

```typescript
// NO getServerSession!
// NO authentication check!
// Page is PUBLIC - anyone with link can view

async function getBooking(id: string) {
  const db = getDB()
  
  const booking = await db.prepare(`
    SELECT 
      a.*,
      ar.name as artist_name,
      ar.instagram_handle
    FROM appointments a
    JOIN artists ar ON a.artist_id = ar.id
    WHERE a.id = ?
  `).bind(id).first()

  return booking
}

export default async function BookingConfirmationPage({ params }) {
  const booking = await getBooking(params.id)

  if (!booking) {
    notFound()
  }

  // Uses client_name, client_email from appointment (no user table needed!)
  // ... rest of confirmation page
}
```

---

## 🔄 Artist Lifecycle Workflows

### New Artist Joins

**Step 1: Create in Nextcloud**
```
Admin → Nextcloud Users → Add User
  Name: Artist Name
  Email: artist@email.com
  Groups: [artist]
  → Nextcloud auto-creates personal calendar
```

**Step 2: Create in D1**
```sql
-- Create user record
INSERT INTO users (id, email, name, role, created_at)
VALUES ('uuid', 'artist@email.com', 'Artist Name', 'ARTIST', CURRENT_TIMESTAMP);

-- Create artist profile  
INSERT INTO artists (id, user_id, name, bio, specialties, is_active, created_at)
VALUES ('uuid', 'user_id_from_above', 'Artist Name', 'Bio...', '["Style1","Style2"]', TRUE, CURRENT_TIMESTAMP);
```

**Step 3: Link Calendar**
```
Admin → /admin/calendars → Configure
  Artist: [Select from dropdown]
  Calendar URL: https://portal.united-tattoos.com/remote.php/dav/calendars/artist@email.com/personal/
  → Saves to artist_calendars table
```

### Artist Leaves

```sql
-- Deactivate (don't delete - preserve history)
UPDATE artists SET is_active = FALSE WHERE id = 'artist_id';

-- Optional: Change user role so they can't access admin
UPDATE users SET role = 'CLIENT' WHERE id = 'user_id';

-- Calendar config stays (for historical bookings)
-- Portfolio images stay (preserved history)
-- Past appointments stay (records)
```

**Result:**
- ✅ Artist disappears from website
- ✅ Can't receive new bookings
- ✅ Can't log into admin dashboard
- ✅ Historical data preserved
- ✅ Can reactivate later if they return

### Artist Email Changes

```sql
-- Update in BOTH places
UPDATE users SET email = 'new@email.com' WHERE id = 'user_id';

-- Nextcloud: Admin must change email there too
-- Then update calendar URL:
UPDATE artist_calendars 
SET calendar_url = 'https://portal.united-tattoos.com/remote.php/dav/calendars/new@email.com/personal/'
WHERE artist_id = 'artist_id';
```

**Important:** Email must match in both systems!

---

## 🎯 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────┐
│  CUSTOMER JOURNEY (No Login!)                       │
└─────────────────────────────────────────────────────┘
1. Visit united-tattoos.com/book
2. Select artist (from D1 database)
3. Fill form: name, email, phone, tattoo details
4. Select date/time → Real-time availability check (CalDAV)
5. Submit → Creates PENDING appointment in D1
6. Redirect to /book/confirm/[id] (public page)
7. Receive confirmation email via Resend

┌─────────────────────────────────────────────────────┐
│  SYSTEM AUTOMATION                                   │
└─────────────────────────────────────────────────────┘
8. Appointment syncs to Nextcloud calendar
   Title: "REQUEST: John Doe - Dragon Tattoo"
9. Artist receives email notification
10. Artist sees request in Nextcloud calendar app

┌─────────────────────────────────────────────────────┐
│  ARTIST/ADMIN APPROVAL (Via Web)                    │
└─────────────────────────────────────────────────────┘
11. Artist/admin logs in via Nextcloud OAuth2
12. Views /admin/bookings dashboard
13. Clicks "Approve" on pending request
14. Status → CONFIRMED in D1
15. Syncs to Nextcloud (removes "REQUEST:" prefix)
16. Customer receives "Confirmed" email

OR

┌─────────────────────────────────────────────────────┐
│  ARTIST/ADMIN APPROVAL (Via Nextcloud)              │
└─────────────────────────────────────────────────────┘
11. Artist opens Nextcloud calendar on phone/desktop
12. Sees "REQUEST: John Doe - Dragon Tattoo"
13. Edits event, removes "REQUEST:" prefix
14. Saves event
15. Background worker (every 5 min) detects change
16. Status → CONFIRMED in D1
17. Customer receives "Confirmed" email
```

---

## 🎯 Implementation Order (FINAL)

### Phase 0: Foundation (Days 1-2)
- [ ] Run database migration for anonymous bookings
- [ ] Set up Resend email (add DNS records)
- [ ] Test email sending
- [ ] Configure Nextcloud OAuth2 in NextAuth
- [ ] Test OAuth2 login
- [ ] Create admin middleware
- [ ] Install Sentry (optional)

### Phase 1: Customer Booking (Days 3-5)
- [ ] Create use-bookings.ts hook
- [ ] Update booking form (remove auth, add API call)
- [ ] Update appointments API for anonymous bookings
- [ ] Create confirmation page (public)
- [ ] Test full booking flow

### Phase 2: Admin Dashboards (Days 6-9)
- [ ] Create use-calendar-configs.ts hook
- [ ] Build calendar configuration UI
- [ ] Build bookings dashboard with DataTable
- [ ] Add approve/reject functionality
- [ ] Test admin workflows

### Phase 3: Background Sync (Days 10-12)
- [ ] Add status detection to calendar-sync.ts
- [ ] Create background sync worker
- [ ] Configure wrangler.toml with cron
- [ ] Deploy worker
- [ ] Test Nextcloud → Web sync

### Phase 4: Testing & Deploy (Days 13-15)
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Deploy to production
- [ ] Monitor for 48 hours

---

## 🔧 Artist Linking - HOW IT WORKS

### The Connection Chain

```
Website Booking Form:
  ↓
  Selects artist (from D1 artists table)
  ↓
  Artist has user_id (FK to users table)
  ↓
  Users table has email
  ↓
  Email matches Nextcloud user
  ↓
  Nextcloud user has calendar
  ↓
  artist_calendars table links artist.id → calendar URL
```

### Example Query

```sql
-- Get artist with calendar info
SELECT 
  a.id as artist_id,
  a.name as artist_name,
  u.email as artist_email,
  ac.calendar_url
FROM artists a
JOIN users u ON a.user_id = u.id
LEFT JOIN artist_calendars ac ON a.id = ac.artist_id
WHERE a.id = ?;
```

**Result:**
```
artist_id: "uuid-123"
artist_name: "Christy Lumberg"
artist_email: "christy@example.com"  ← Links to Nextcloud!
calendar_url: "https://portal.united-tattoos.com/remote.php/dav/calendars/christy@example.com/personal/"
```

---

## 📝 Pre-Implementation Checklist

### ✅ You Need To Do:

1. **Set up Resend domain** (15 minutes)
   - Go to resend.com/domains
   - Add united-tattoos.com
   - Copy the 3 DNS records
   - Add to Cloudflare DNS
   - Verify domain

2. **Verify Nextcloud OAuth2 callback URLs** (2 minutes)
   - Log into portal.united-tattoos.com
   - Settings → Security → OAuth 2.0
   - Check callback URLs include:
     - `https://united-tattoos.com/api/auth/callback/nextcloud`
     - `http://localhost:3000/api/auth/callback/nextcloud`

3. **Verify users table has emails** (1 minute)
   ```sql
   -- Run in Wrangler D1:
   SELECT u.email, a.name 
   FROM artists a
   JOIN users u ON a.user_id = u.id
   WHERE a.is_active = TRUE;
   ```
   - Should show all artists with their emails
   - These emails MUST match Nextcloud user emails

4. **Optional: Set up Sentry** (10 minutes)
   - Go to sentry.io
   - Create project
   - Copy DSN
   - Add to environment variables

---

## 🚀 Ready to Implement?

I have everything I need:
- ✅ Resend API key
- ✅ Nextcloud OAuth2 credentials  
- ✅ Domain ownership confirmed
- ✅ Architecture decided

**Just need confirmation on:**
1. Are there emails for all current artists in the users table?
2. Do those emails match their Nextcloud accounts?

Once confirmed, I'll start Phase 0!

