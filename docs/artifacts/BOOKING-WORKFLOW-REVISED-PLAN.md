# Booking Workflow - Revised Implementation Plan

**Version:** 2.0 (Revised with Nextcloud OAuth2)  
**Date:** January 9, 2025  
**Status:** Ready for Implementation

---

## Critical Architectural Decisions

### 1. Authentication Strategy: TWO-TIER SYSTEM

**Customers (Public):**
- ❌ NO LOGIN REQUIRED
- ✅ Anonymous booking with email + phone
- ✅ Receive confirmation via email
- ✅ Simple, fast, no friction

**Artists & Admins (Internal):**
- ✅ Nextcloud OAuth2 authentication
- ✅ Single sign-on (SSO)
- ✅ Access to admin dashboards + calendars

### 2. Artist Data: HYBRID MODEL (No Migration Needed!)

**Cloudflare D1 + R2:**
- ✅ Source of truth for artist PROFILES
- ✅ Name, bio, specialties, portfolio images
- ✅ Used by public website (existing code stays as-is)
- ✅ Booking form artist selection
- ✅ **NO CHANGES TO EXISTING SYSTEM**

**Nextcloud:**
- ✅ Source of truth for AUTHENTICATION
- ✅ Source of truth for CALENDAR availability
- ✅ Artists are users in "artist" Nextcloud group

**Link Between Them:**
- Simple: Match via email address
- Robust: Add optional `nextcloud_user_id` to artists table
- No complex sync needed!

### 3. Services Confirmed

**Email:** Resend (free tier - 3,000/month)
- Domain: `united-tattoos.com` (owned, on Cloudflare)
- Sender: `bookings@united-tattoos.com`
- Easy ownership transfer via team feature

**Monitoring:** 
- Cloudflare Workers Analytics (free, built-in)
- Sentry (free tier - 5k errors/month)

**Authentication:**
- Nextcloud OAuth2 (already configured!)
- Client ID: `PZmqmi9vxYjtyWzt7f8QZk61jtwoAaqZ5bZz6wLvYUu4lYc0PPY6cx9qcBgDh5QI`
- Secret: `tkf7Ytc4vQII47OhumKBl3O3p6WhiPFQBzb5DJhw7ZjmJwDE0zTGwYGwF0MJjcsm`
- Base URL: `https://portal.united-tattoos.com`

---

## Revised Implementation Phases

## PHASE 0: Foundation Setup (NEW - FIRST!)

**Duration:** 1-2 days  
**Priority:** BLOCKING - Must complete before other phases

### 0.1 Set Up Resend Email Service

**Steps:**
1. Sign up at resend.com (free tier)
2. Add domain `united-tattoos.com`
3. Add DNS records to Cloudflare:
   ```
   TXT  resend._domainkey  [value from Resend]
   TXT  _dmarc            "v=DMARC1; p=none;"
   ```
4. Verify domain
5. Test send email
6. Add API key to environment variables

**Environment Variable:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 0.2 Configure Nextcloud OAuth2 Provider

**Already Done! Just need to integrate:**

**Update `lib/auth.ts` (NextAuth config):**

```typescript
import NextAuth, { NextAuthOptions } from "next-auth"
import { D1Adapter } from "@next-auth/d1-adapter"

export const authOptions: NextAuthOptions = {
  adapter: D1Adapter(process.env.DB), // Existing D1 adapter
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
        return {
          id: profile.ocs.data.id,
          name: profile.ocs.data.displayname,
          email: profile.ocs.data.email,
          image: profile.ocs.data.avatar || null,
        }
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user role from database
      const db = getDB()
      const dbUser = await db
        .prepare('SELECT role FROM users WHERE email = ?')
        .bind(session.user.email)
        .first()
      
      session.user.id = user.id
      session.user.role = dbUser?.role || 'CLIENT'
      
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if user is in Nextcloud "artist" or "admin" group
      // This can be checked via Nextcloud API if needed
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
```

**Environment Variables:**
```env
NEXTCLOUD_CLIENT_ID=PZmqmi9vxYjtyWzt7f8QZk61jtwoAaqZ5bZz6wLvYUu4lYc0PPY6cx9qcBgDh5QI
NEXTCLOUD_CLIENT_SECRET=tkf7Ytc4vQII47OhumKBl3O3p6WhiPFQBzb5DJhw7ZjmJwDE0zTGwYGwF0MJjcsm
NEXTCLOUD_BASE_URL=https://portal.united-tattoos.com
```

**Callback URL (already configured in Nextcloud):**
- Production: `https://united-tattoos.com/api/auth/callback/nextcloud`
- Dev: `http://localhost:3000/api/auth/callback/nextcloud`

### 0.3 Create Admin Middleware

**File: `middleware.ts`** (Update existing or create)

```typescript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes require SHOP_ADMIN or SUPER_ADMIN role
    if (path.startsWith('/admin')) {
      if (!token || (token.role !== 'SHOP_ADMIN' && token.role !== 'SUPER_ADMIN')) {
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + path, req.url))
      }
    }

    // Artist dashboard requires ARTIST role
    if (path.startsWith('/artist-dashboard')) {
      if (!token || token.role !== 'ARTIST') {
        return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + path, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all API routes (they handle their own auth)
        if (req.nextUrl.pathname.startsWith('/api')) {
          return true
        }
        
        // Require auth for admin/artist routes
        if (req.nextUrl.pathname.startsWith('/admin') || 
            req.nextUrl.pathname.startsWith('/artist-dashboard')) {
          return !!token
        }
        
        // All other routes are public
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/artist-dashboard/:path*', '/api/:path*'],
}
```

### 0.4 Add Sentry Error Tracking

**Install:**
```bash
npm install @sentry/nextjs
```

**File: `sentry.client.config.js`**
```javascript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

**Environment Variable:**
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

## PHASE 1: Customer Booking Flow (REVISED)

**Duration:** 3-4 days  
**Changes:** No customer authentication required!

### 1.1 Update Database Schema for Anonymous Bookings

**Add to migrations:**
```sql
-- Allow client_id to be NULL for anonymous bookings
-- Store email/phone directly on appointment
ALTER TABLE appointments ADD COLUMN client_email TEXT;
ALTER TABLE appointments ADD COLUMN client_phone TEXT;
ALTER TABLE appointments ADD COLUMN client_name TEXT;

-- Make client_id optional
-- (In SQLite, we'd need to recreate the table, but for now just allow NULL in app logic)
```

### 1.2 Update Booking Form (No Login Required!)

**File: `components/booking-form.tsx`**

Remove all session checks! Update to:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!bookingEnabled) {
    toast.error('Booking temporarily unavailable')
    return
  }

  // NO SESSION CHECK - Customers book anonymously!
  
  if (!selectedArtist) {
    toast.error('Please select an artist')
    return
  }

  if (!appointmentStart || !appointmentEnd) {
    toast.error('Please select a date, time, and tattoo size')
    return
  }

  // Create booking without authentication
  createBooking.mutate({
    artistId: selectedArtist.id,
    // No clientId - this is anonymous!
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

### 1.3 Update Appointments API for Anonymous Bookings

**File: `app/api/appointments/route.ts`** (UPDATE)

```typescript
const createAppointmentSchema = z.object({
  artistId: z.string().min(1),
  clientId: z.string().optional(), // Now optional!
  clientName: z.string().min(1),   // NEW - Required
  clientEmail: z.string().email(),  // NEW - Required
  clientPhone: z.string().min(1),   // NEW - Required
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  depositAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest, ...) {
  try {
    // NO AUTHENTICATION CHECK for booking creation!
    // This is intentionally public for customer bookings
    
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

    const appointmentId = crypto.randomUUID()
    
    // Create appointment with customer contact info
    const insertStmt = db.prepare(`
      INSERT INTO appointments (
        id, artist_id, client_id, client_name, client_email, client_phone,
        title, description, start_time, end_time,
        status, deposit_amount, total_amount, notes, created_at, updated_at
      ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
      validatedData.totalAmount || null,
      validatedData.notes || null
    ).run()

    // Fetch the created appointment
    const appointment = await db.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      WHERE a.id = ?
    `).bind(appointmentId).first()

    // Sync to CalDAV
    try {
      await syncAppointmentToCalendar(appointment as any, context)
    } catch (syncError) {
      console.error('Failed to sync to calendar:', syncError)
    }

    // Send email confirmation to customer
    try {
      await sendBookingConfirmationEmail(appointment as any)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    // ... error handling
  }
}
```

### 1.4 Create Email Service

**File: `lib/email.ts`**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingConfirmationEmail(appointment: {
  id: string
  client_name: string
  client_email: string
  artist_name: string
  start_time: string
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
    await resend.emails.send({
      from: 'United Tattoo <bookings@united-tattoos.com>',
      to: appointment.client_email,
      subject: 'Your Tattoo Booking Request - United Tattoo',
      html: `
        <h1>Booking Request Received!</h1>
        <p>Hi ${appointment.client_name},</p>
        <p>We've received your tattoo appointment request. Here are the details:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Artist:</strong> ${appointment.artist_name}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedTime}</p>
          <p><strong>Description:</strong> ${appointment.description}</p>
        </div>

        <h2>What's Next?</h2>
        <ol>
          <li>Your artist will review your request (usually within 24 hours)</li>
          <li>You'll receive an email when your appointment is confirmed</li>
          <li>Bring a valid ID and arrive 10 minutes early</li>
        </ol>

        <p>Questions? Call us at (719) 555-1234 or reply to this email.</p>
        
        <p>Thanks,<br>United Tattoo Team</p>
      `,
    })
  } catch (error) {
    console.error('Email send failed:', error)
    throw error
  }
}

export async function sendBookingStatusChangeEmail(appointment: {
  client_name: string
  client_email: string
  artist_name: string
  start_time: string
  status: string
}) {
  const statusMessages = {
    CONFIRMED: {
      subject: 'Your Tattoo Appointment is Confirmed!',
      message: 'Great news! Your appointment has been confirmed.',
      action: 'You can now pay your deposit at the shop or via the link below.',
    },
    CANCELLED: {
      subject: 'Appointment Update - United Tattoo',
      message: 'Unfortunately, we need to reschedule your appointment.',
      action: 'Please contact us to find a new time that works for you.',
    },
  }

  const config = statusMessages[appointment.status as keyof typeof statusMessages]
  if (!config) return // Don't send email for other statuses

  try {
    await resend.emails.send({
      from: 'United Tattoo <bookings@united-tattoos.com>',
      to: appointment.client_email,
      subject: config.subject,
      html: `
        <h1>${config.message}</h1>
        <p>Hi ${appointment.client_name},</p>
        <p><strong>Artist:</strong> ${appointment.artist_name}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
        <p>${config.action}</p>
        <p>Questions? Call us at (719) 555-1234</p>
      `,
    })
  } catch (error) {
    console.error('Status change email failed:', error)
    throw error
  }
}
```

### 1.5 Update Confirmation Page (No Auth Required)

**File: `app/book/confirm/[id]/page.tsx`**

Remove authentication check - make it public with just the booking ID:

```typescript
// NO getServerSession call!
// Anyone with the link can view their confirmation

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

  // No auth check - confirmation is public!
  // Security by obscurity (UUID is hard to guess)

  return (
    // ... existing confirmation page content
  )
}
```

---

## PHASE 2 & 3: Admin Dashboards (PROTECTED)

**These stay mostly the same, but NOW:**
- ✅ Protected by middleware
- ✅ Require Nextcloud OAuth2 login
- ✅ Check user role from database

All the code from the original plan applies here, just add middleware protection!

---

## Artist Data Linking Strategy

### How to Link D1 Artists with Nextcloud Users

**Option 1: Email Matching (Simple - Start Here)**

```typescript
// When admin configures calendar, we match by email
async function linkArtistToNextcloud(artistId: string) {
  const db = getDB()
  
  // Get artist email from D1
  const artist = await db
    .prepare('SELECT email FROM artists WHERE id = ?')
    .bind(artistId)
    .first()
  
  // Calendar URL pattern for this artist
  const calendarUrl = `https://portal.united-tattoos.com/remote.php/dav/calendars/${artist.email}/personal/`
  
  // Save configuration
  await db.prepare(`
    INSERT INTO artist_calendars (id, artist_id, calendar_url, calendar_id)
    VALUES (?, ?, ?, 'personal')
  `).bind(crypto.randomUUID(), artistId, calendarUrl).run()
}
```

**Option 2: Add Nextcloud User ID (Robust - Later)**

```sql
-- Migration: Add optional nextcloud_user_id
ALTER TABLE artists ADD COLUMN nextcloud_user_id TEXT;
CREATE INDEX idx_artists_nextcloud_user ON artists(nextcloud_user_id);
```

Then query Nextcloud API to get user ID and store it.

### Migration Path (Non-Breaking!)

```
Current State:
✅ D1 artists table exists with all data
✅ R2 has portfolio images
✅ Website displays artists from D1
✅ Booking form uses artists from D1

Step 1: Create Nextcloud users for each artist
  - Email must match artists.email in D1
  - Add to "artist" group in Nextcloud

Step 2: Artists log in via OAuth2
  - They use Nextcloud credentials
  - System matches by email to D1 artist record

Step 3: Admin links calendars
  - Use calendar config UI
  - Matches D1 artist → Nextcloud calendar via email

✅ No data migration needed
✅ Existing site keeps working
✅ Just add authentication layer on top
```

---

## Environment Variables Summary

```env
# Existing
DATABASE_URL=...
NEXTAUTH_URL=https://united-tattoos.com
NEXTAUTH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...

# NEW - Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# NEW - Nextcloud OAuth2
NEXTCLOUD_CLIENT_ID=PZmqmi9vxYjtyWzt7f8QZk61jtwoAaqZ5bZz6wLvYUu4lYc0PPY6cx9qcBgDh5QI
NEXTCLOUD_CLIENT_SECRET=tkf7Ytc4vQII47OhumKBl3O3p6WhiPFQBzb5DJhw7ZjmJwDE0zTGwYGwF0MJjcsm
NEXTCLOUD_BASE_URL=https://portal.united-tattoos.com

# NEW - CalDAV (for background sync)
NEXTCLOUD_USERNAME=admin_or_service_account
NEXTCLOUD_PASSWORD=app_password
NEXTCLOUD_CALENDAR_BASE_PATH=/remote.php/dav/calendars

# NEW - Monitoring (optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

---

## Testing Strategy

### Phase 0 Testing
- [ ] Resend email sends successfully
- [ ] DNS records verified in Cloudflare
- [ ] Nextcloud OAuth2 login works
- [ ] Middleware protects admin routes
- [ ] Sentry captures test error

### Phase 1 Testing (No Customer Login)
- [ ] Customer can book WITHOUT logging in
- [ ] Booking form submits successfully
- [ ] Customer receives confirmation email
- [ ] Booking syncs to Nextcloud
- [ ] Confirmation page accessible via link

### Admin Testing (With Login)
- [ ] Admin can log in via Nextcloud
- [ ] Admin sees bookings dashboard
- [ ] Admin can approve/reject bookings
- [ ] Status changes sync to Nextcloud
- [ ] Email sent on status change

---

## Key Benefits of This Approach

✅ **No customer friction** - Book in 2 minutes without account  
✅ **Single sign-on for staff** - One password (Nextcloud)  
✅ **No artist data migration** - D1 + R2 stays as-is  
✅ **Clean separation** - Profiles vs Authentication vs Calendar  
✅ **Existing site untouched** - All current features keep working  
✅ **Secure** - Middleware protects admin routes automatically  

---

## Next Steps

1. **Review this plan** - Does the two-tier auth + hybrid data model work for you?
2. **Set up Resend** - Add domain, get API key
3. **I implement Phase 0** - Foundation (OAuth2 + Email + Middleware)
4. **Test authentication** - Make sure Nextcloud login works
5. **Proceed with booking flow** - Anonymous customer bookings

**Ready to proceed?**

