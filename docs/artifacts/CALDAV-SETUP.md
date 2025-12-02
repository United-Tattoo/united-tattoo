# CalDAV Nextcloud Integration Setup Guide

This document provides instructions for setting up and configuring the bidirectional CalDAV integration with Nextcloud.

## Overview

The CalDAV integration allows your tattoo booking system to:
- Sync appointments FROM the web app TO Nextcloud calendars in real-time
- Check availability FROM Nextcloud calendars to prevent double-bookings
- Pull events FROM Nextcloud TO the database (for manual calendar entries)
- Handle conflicts automatically (Nextcloud is the source of truth)

## Prerequisites

1. A Nextcloud instance with CalDAV enabled
2. Admin access to Nextcloud to create app-specific passwords
3. Individual calendars set up for each artist in Nextcloud

## Environment Variables

Add these variables to your `.env.local` file:

```env
# CalDAV / Nextcloud Integration
NEXTCLOUD_BASE_URL=https://your-nextcloud-instance.com
NEXTCLOUD_USERNAME=admin_or_service_account
NEXTCLOUD_PASSWORD=app_specific_password
NEXTCLOUD_CALENDAR_BASE_PATH=/remote.php/dav/calendars
```

### Getting Nextcloud Credentials

1. Log in to your Nextcloud instance
2. Go to **Settings** → **Security**
3. Scroll to **Devices & Sessions**
4. Under **App passwords**, create a new app password named "Tattoo Booking System"
5. Copy the generated password (it will look like: `xxxxx-xxxxx-xxxxx-xxxxx-xxxxx`)
6. Use this as your `NEXTCLOUD_PASSWORD` value

## Database Migration

The CalDAV integration requires new database tables. Run the migration:

```bash
# For local development
npm run db:migrate:local -- --file=./sql/migrations/20250109_add_caldav_support.sql

# For production
wrangler d1 execute united-tattoo --remote --file=./sql/migrations/20250109_add_caldav_support.sql
```

This creates the following tables:
- `artist_calendars` - Stores calendar configuration for each artist
- `calendar_sync_logs` - Tracks sync operations for monitoring
- Adds `caldav_uid` and `caldav_etag` columns to `appointments` table

## Configuring Artist Calendars

After setting up the environment variables, you need to configure which Nextcloud calendar belongs to each artist.

### Step 1: Get Calendar URLs from Nextcloud

1. Log in to Nextcloud
2. Go to the **Calendar** app
3. For each artist calendar:
   - Click the **⋮** (three dots) menu next to the calendar name
   - Select **Settings**
   - Copy the **Calendar Link** (WebDAV URL)
   - It should look like: `https://your-nextcloud.com/remote.php/dav/calendars/username/calendar-name/`

### Step 2: Configure in Admin Dashboard

1. Log in to your tattoo booking admin dashboard
2. Navigate to **Admin** → **Calendars**
3. Click **Add Calendar Configuration**
4. Fill in the form:
   - **Artist**: Select the artist from dropdown
   - **Calendar URL**: Paste the WebDAV URL from Nextcloud
   - **Calendar ID**: Enter the calendar name (last part of URL)
5. Click **Test Connection** to verify
6. Save the configuration

### API Method (Alternative)

You can also configure calendars via API:

```bash
curl -X POST https://your-domain.com/api/admin/calendars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "artistId": "artist-uuid-here",
    "calendarUrl": "https://nextcloud.com/remote.php/dav/calendars/user/artist-name/",
    "calendarId": "artist-name"
  }'
```

## How It Works

### Booking Flow

1. **User submits booking** → Creates `PENDING` appointment in database
2. **Real-time sync** → Event created in Nextcloud with title "REQUEST: [Client Name] - [Description]"
3. **Artist/admin reviews** → Sees pending request in their calendar app
4. **Admin approves** → Status changes to `CONFIRMED`, event updated in Nextcloud
5. **Any conflicts** → Detected automatically before booking is created

### Conflict Resolution

- **Before booking creation**: System checks Nextcloud calendar for conflicts
- **Nextcloud is source of truth**: If an event exists in Nextcloud, that time slot is blocked
- **User feedback**: Clear messaging if selected time is unavailable
- **Alternative times**: Users can provide backup date/time preferences

### Event Syncing

**Web → Nextcloud (Real-time)**
- Appointment created → Event created in CalDAV
- Appointment updated → Event updated in CalDAV
- Appointment cancelled → Event deleted from CalDAV

**Nextcloud → Web (Manual/Scheduled)**
- Use the admin sync button for manual sync
- Background worker (future implementation) will sync periodically
- Any calendar event blocks that time slot for web bookings

## API Endpoints

### Check Availability

```http
GET /api/caldav/availability?artistId=UUID&startTime=ISO_DATE&endTime=ISO_DATE
```

Returns:
```json
{
  "artistId": "uuid",
  "startTime": "2025-01-15T14:00:00Z",
  "endTime": "2025-01-15T16:00:00Z",
  "available": true,
  "reason": null
}
```

### Manual Sync

```http
POST /api/caldav/sync
```

Body:
```json
{
  "artistId": "uuid-or-omit-for-all",
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-03-31T23:59:59Z"
}
```

### Manage Calendar Configurations

```http
GET /api/admin/calendars
POST /api/admin/calendars
PUT /api/admin/calendars
DELETE /api/admin/calendars?id=UUID
```

## Testing

### 1. Test Calendar Connection

```bash
# Using the admin UI
1. Go to Admin → Calendars
2. Click "Test Connection" on any calendar
3. Verify green checkmark appears

# Or via curl
curl -X GET https://your-nextcloud.com/remote.php/dav/calendars/username/ \
  -u "username:app-password"
```

### 2. Test Booking Flow

1. Create a test appointment via the booking form
2. Check Nextcloud calendar - event should appear with "REQUEST:" prefix
3. Update appointment status to CONFIRMED in admin dashboard
4. Check Nextcloud - event title should update (no "REQUEST:" prefix)
5. Delete appointment - event should disappear from Nextcloud

### 3. Test Conflict Detection

1. Manually create an event in Nextcloud for a specific time
2. Try to book the same time slot via the web form
3. Verify error message appears: "Time slot not available"

### 4. Test Availability Checking

1. Open booking form
2. Select an artist, date, and time
3. Wait for availability indicator (green checkmark or red X)
4. Verify real-time feedback as you change selections

## Troubleshooting

### "CalDAV not configured" warnings

**Problem**: Environment variables not set or incorrect

**Solution**:
1. Verify all NEXTCLOUD_* variables are in `.env.local`
2. Restart your development server
3. Check credentials are correct (test with curl)

### "Calendar configuration not found"

**Problem**: Artist doesn't have a calendar configured

**Solution**:
1. Go to Admin → Calendars
2. Add calendar configuration for the artist
3. Test the connection

### Sync fails with 401/403 errors

**Problem**: Authentication issue with Nextcloud

**Solution**:
1. Verify app password is correct (regenerate if needed)
2. Check username matches Nextcloud username
3. Ensure calendar permissions allow API access

### Events not appearing in Nextcloud

**Problem**: Sync is failing silently

**Solution**:
1. Check Admin → Calendars → Sync Logs
2. Look for error messages in logs
3. Verify calendar URL is correct (trailing slash matters!)
4. Test connection manually with curl

### Availability always shows "not available"

**Problem**: CalDAV client returning errors

**Solution**:
1. Check browser console for errors
2. Verify API endpoint works: `/api/caldav/availability`
3. Check network tab for failed requests
4. Ensure artist has calendar configured

## Monitoring

### View Sync Logs

```sql
-- In Wrangler D1 console
SELECT * FROM calendar_sync_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

Or via the admin dashboard:
- Go to **Admin** → **Calendars**
- Click on any artist
- View **Recent Sync History**

### Key Metrics to Monitor

- **Sync success rate**: Should be >95%
- **Events processed**: Track volume over time
- **Error patterns**: Look for repeating errors
- **Sync duration**: Should be <2 seconds per artist

## Best Practices

1. **Use app-specific passwords**: Never use main Nextcloud password
2. **Test before production**: Verify with test appointments first
3. **Monitor sync logs**: Check regularly for failures
4. **Calendar naming**: Use clear, consistent artist names
5. **Backup strategy**: Export calendars regularly from Nextcloud
6. **User communication**: Inform users that Nextcloud is authoritative

## Future Enhancements

- [ ] Background worker for automatic periodic sync (every 5 minutes)
- [ ] Webhook support for instant sync when Nextcloud calendar changes
- [ ] Bulk calendar configuration import
- [ ] Sync status dashboard with real-time updates
- [ ] Email notifications for sync failures
- [ ] Two-way sync for appointment details (not just create/delete)

## Security Considerations

- ✅ Credentials stored in environment variables (never in code)
- ✅ App-specific passwords (not main password)
- ✅ Admin-only calendar configuration endpoints
- ✅ CalDAV responses validated before database updates
- ✅ Rate limiting on API endpoints
- ✅ Sanitized event data before storing

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review sync logs in admin dashboard
3. Test with curl commands to isolate issues
4. Check Nextcloud server logs if needed

## References

- [CalDAV RFC 4791](https://datatracker.ietf.org/doc/html/rfc4791)
- [Nextcloud CalDAV Documentation](https://docs.nextcloud.com/server/latest/user_manual/en/groupware/calendar.html)
- [tsdav Library](https://github.com/natelindev/tsdav)
- [ical.js Library](https://github.com/kewisch/ical.js)

