# Nextcloud OAuth Authentication Setup Guide

This guide explains how to set up Nextcloud OAuth authentication for United Tattoo Studio and migrate existing artist accounts.

## Table of Contents

1. [Nextcloud OAuth App Registration](#nextcloud-oauth-app-registration)
2. [Environment Configuration](#environment-configuration)
3. [Nextcloud Group Setup](#nextcloud-group-setup)
4. [Migrating Existing Artists](#migrating-existing-artists)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)

---

## Nextcloud OAuth App Registration

### Step 1: Access OAuth Settings in Nextcloud

1. Log in to your Nextcloud instance as an administrator: https://portal.united-tattoos.com
2. Navigate to **Settings** → **Security** → **OAuth 2.0 clients** (bottom of the page)

### Step 2: Create New OAuth App

1. Click **"Add client"**
2. Fill in the following details:
   - **Name**: `United Tattoo Studio` (or any descriptive name)
   - **Redirection URI**: `https://united-tattoos.com/api/auth/callback/nextcloud`
     - For local development: `http://localhost:3000/api/auth/callback/nextcloud`
     - For preview/staging: `https://your-preview-url.pages.dev/api/auth/callback/nextcloud`
3. Click **"Add"**

### Step 3: Save Credentials

After creating the OAuth app, Nextcloud will display:
- **Client Identifier** (Client ID)
- **Secret** (Client Secret)

**IMPORTANT**: Copy these values immediately and store them securely. The secret will not be shown again.

---

## Environment Configuration

### Step 1: Update Environment Variables

Add the following variables to your `.env.local` file (or production environment):

```bash
# Nextcloud Configuration
NEXTCLOUD_BASE_URL="https://portal.united-tattoos.com"

# Nextcloud OAuth Authentication
NEXTCLOUD_OAUTH_CLIENT_ID="your-client-id-from-step-3"
NEXTCLOUD_OAUTH_CLIENT_SECRET="your-client-secret-from-step-3"

# Group names for auto-provisioning (customize if needed)
NEXTCLOUD_ARTISTS_GROUP="artists"
NEXTCLOUD_ADMINS_GROUP="shop_admins"

# Nextcloud CalDAV Integration (existing, for calendar sync)
NEXTCLOUD_USERNAME="your-service-account-username"
NEXTCLOUD_PASSWORD="your-service-account-app-password"
NEXTCLOUD_CALENDAR_BASE_PATH="/remote.php/dav/calendars"
```

### Step 2: Verify Configuration

Run the following command to check for configuration errors:

```bash
npm run build
```

If there are missing environment variables, the build will fail with a helpful error message from `lib/env.ts`.

---

## Nextcloud Group Setup

### Step 1: Create Required Groups

1. In Nextcloud, navigate to **Settings** → **Users**
2. Click **"Add group"** and create the following groups:
   - `artists` - For tattoo artists who need access to their portfolios
   - `shop_admins` - For shop administrators

### Step 2: Assign Users to Groups

For each existing artist or admin:

1. Go to **Settings** → **Users**
2. Find the user in the list
3. Click on their row and select the appropriate group(s):
   - Artists: Add to `artists` group
   - Shop admins: Add to `shop_admins` group
   - Super admins: Add to both `shop_admins` AND `admins` (or `admin`) group

**Note**: Users can be in multiple groups. For example, a shop owner who is also an artist should be in both `artists` and `shop_admins`.

---

## Migrating Existing Artists

### Understanding the Migration

When an artist signs in via Nextcloud OAuth for the first time:

1. The system checks if a user with that email already exists in the database
2. **If user exists**: The existing user account is linked to the Nextcloud OAuth session
3. **If user doesn't exist**: A new user and artist profile are auto-created based on Nextcloud group membership

### Step 1: Match Email Addresses

Ensure that each artist's email in Nextcloud matches their email in the United Tattoo database:

```sql
-- Query to check existing artist emails in D1 database
SELECT u.email, a.name, a.slug
FROM users u
JOIN artists a ON u.id = a.user_id
WHERE u.role = 'ARTIST';
```

Run this via:
```bash
wrangler d1 execute united-tattoo --command="SELECT u.email, a.name, a.slug FROM users u JOIN artists a ON u.id = a.user_id WHERE u.role = 'ARTIST';"
```

### Step 2: Create Nextcloud Accounts (If Needed)

If an artist doesn't have a Nextcloud account yet:

1. Go to **Settings** → **Users** in Nextcloud
2. Click **"New user"**
3. Fill in:
   - **Username**: Artist's preferred username (e.g., `amari.kyss`)
   - **Display name**: Artist's full name (e.g., "Amari Kyss")
   - **Email**: **Must match** the email in the database
   - **Groups**: Add to `artists` group
4. Set a temporary password and send it to the artist
5. Ask the artist to change their password on first login

### Step 3: Notify Artists

Send an email to all artists with the following information:

**Email Template:**

```
Subject: New Login Process for United Tattoo Studio Dashboard

Hello [Artist Name],

We've updated the artist dashboard login process to use your Nextcloud account for easier access.

What's Changed:
- You now sign in using your Nextcloud credentials (same account you use for [calendar/files/etc])
- No need to remember a separate password for the artist dashboard
- More secure authentication via OAuth

How to Sign In:
1. Go to https://united-tattoos.com/auth/signin
2. Click "Sign in with Nextcloud"
3. Use your Nextcloud username and password
4. You'll be redirected to your artist dashboard

Your Nextcloud Credentials:
- Username: [their Nextcloud username]
- Email: [their email]
- If you forgot your Nextcloud password, you can reset it at: https://portal.united-tattoos.com/login

Need Help?
Contact [admin contact] if you have any issues signing in.

Thanks,
United Tattoo Studio Team
```

---

## Testing the Integration

### Test 1: New Artist Sign In

1. Ensure a test user is in the `artists` group in Nextcloud
2. Go to `/auth/signin` on your website
3. Click "Sign in with Nextcloud"
4. Authorize the OAuth app
5. Verify:
   - User is created in the `users` table
   - Artist profile is created in the `artists` table
   - Redirect to `/artist-dashboard` works
   - Artist can view/edit their profile

### Test 2: Existing Artist Sign In

1. Use an artist whose email matches an existing database record
2. Follow the same sign-in process
3. Verify:
   - No duplicate user/artist created
   - Existing artist profile is accessible
   - Portfolio images are preserved

### Test 3: Admin Sign In

1. Ensure a test user is in the `shop_admins` group
2. Sign in via Nextcloud OAuth
3. Verify:
   - User is created with `SHOP_ADMIN` role
   - Redirect to `/admin` dashboard works
   - Admin can access all admin features

### Test 4: Unauthorized User

1. Create a Nextcloud user NOT in any authorized group
2. Attempt to sign in via OAuth
3. Verify:
   - Sign-in is **rejected** with an error message
   - User is **not** created in the database
   - Error message suggests joining the 'artists' or 'shop_admins' group

### Test 5: Admin Fallback (Emergency Access)

1. Go to `/auth/signin?admin=true`
2. Verify the credentials form is shown
3. Sign in with `nicholai@biohazardvfx.com` (or any email in dev mode)
4. Verify admin access works

---

## Troubleshooting

### Issue: "Unable to sign in with Nextcloud"

**Possible causes:**
- User not in `artists` or `shop_admins` group
- OAuth app not configured correctly in Nextcloud
- Redirect URI mismatch

**Solution:**
1. Check user's group membership in Nextcloud
2. Verify `NEXTCLOUD_OAUTH_CLIENT_ID` and `NEXTCLOUD_OAUTH_CLIENT_SECRET` are correct
3. Ensure redirect URI in Nextcloud matches your domain exactly

### Issue: "Nextcloud API error" in server logs

**Possible causes:**
- Service account credentials (`NEXTCLOUD_USERNAME`/`NEXTCLOUD_PASSWORD`) are incorrect
- Nextcloud OCS API is not accessible

**Solution:**
1. Test service account credentials manually:
   ```bash
   curl -u "username:password" https://portal.united-tattoos.com/ocs/v1.php/cloud/users/testuser
   ```
2. Ensure the service account has admin privileges in Nextcloud
3. Check Nextcloud logs for any API access errors

### Issue: Duplicate artist profiles created

**Possible causes:**

- Email mismatch between Nextcloud and database
- User signed in before email was matched

**Solution:**

1. Identify duplicate records:

   ```sql
   SELECT * FROM artists WHERE user_id IN (
     SELECT user_id FROM artists GROUP BY user_id HAVING COUNT(*) > 1
   );
   ```

2. Manually merge duplicates by updating portfolio images to point to the correct artist
3. Delete the duplicate artist profile

### Issue: Artist can't access dashboard after sign-in

**Possible causes:**

- Artist profile not created during auto-provisioning
- Database transaction failed

**Solution:**

1. Check if user exists:

   ```sql
   SELECT * FROM users WHERE email = 'artist@example.com';
   ```

2. Check if artist profile exists:

   ```sql
   SELECT * FROM artists WHERE user_id = 'user-id-from-above';
   ```

3. If user exists but artist doesn't, manually create artist:

   ```sql
   INSERT INTO artists (id, user_id, name, bio, specialties, is_active, slug)
   VALUES ('uuid', 'user-id', 'Artist Name', '', '[]', 1, 'artist-name');
   ```

---

## Next Steps

After completing this setup:

1. **Monitor sign-ins**: Check server logs for any authentication errors
2. **Gather feedback**: Ask artists about their experience with the new login process
3. **Update documentation**: Keep this guide updated with any changes to the process
4. **Consider enhancements**:
   - Sync artist profile photos from Nextcloud
   - Enable calendar integration for all artists
   - Add two-factor authentication requirement

---

## Support

For technical support or questions about this integration, contact the development team or file an issue in the project repository.

Last updated: 2025-10-22
