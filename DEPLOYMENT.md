# Deployment Guide

## Cloudflare Pages Deployment

This project is configured for deployment to Cloudflare Pages using the `@astrojs/cloudflare` adapter.

### Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://www.cloudflare.com/)
2. **Resend Account** - Create account at [resend.com](https://resend.com/) and verify your sender domain
3. **Wrangler CLI** (optional) - Install with `pnpm install -g wrangler`

---

## Environment Variables Setup

### Required Variables

Configure these environment variables in your Cloudflare Pages dashboard:

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | Your Resend API key (starts with `re_`) | Get from [resend.com/api-keys](https://resend.com/api-keys) |
| `BOOKING_FROM_EMAIL` | `bookings@unitedtattoo.com` | Must be a verified sender domain in Resend |

### Setting Up Environment Variables in Cloudflare Pages

1. **Navigate to your Cloudflare Pages project**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/)
   - Select **Workers & Pages**
   - Choose your project (or create a new one)

2. **Add environment variables**
   - Click **Settings** → **Environment variables**
   - Click **Add variable** for each:
     - **Variable name:** `RESEND_API_KEY`
       **Value:** `re_xxxxxxxxxx` (your actual API key)
     - **Variable name:** `BOOKING_FROM_EMAIL`
       **Value:** `bookings@unitedtattoo.com`

3. **Deploy scope**
   - Set variables for **Production** environment
   - Optionally set different values for **Preview** environment (for testing)

---

## Email Configuration

### Admin Email Recipients

Admin emails are configured directly in the code at `/src/pages/api/booking.ts`:

```typescript
const ADMIN_EMAILS = ['Christyl116@yahoo.com', 'ashtonjl.work@gmail.com'];
```

**To update admin emails:** Edit this array in the booking API file and redeploy.

### Artist Email Notifications

Artists can receive booking notifications when they're selected in a booking request.

**To enable for an artist:**

1. Open the artist's MDX file (e.g., `/src/content/artists/christy-lumberg.mdx`)
2. Add the `bookingEmailCc` field to the frontmatter:

```yaml
---
name: Christy Lumberg
portrait: /artists/christy-lumberg-portrait.jpg
galleryDir: artists/Christy-Lumberg
bookingEmailCc: christy@example.com  # Add this line
specialties:
  - Fine Line
  - Botanical
---
```

3. Commit and deploy the changes

**Note:** If an artist doesn't have `bookingEmailCc` configured, they won't receive individual notifications (only shop admins will).

### Client Confirmation Emails

Clients automatically receive a confirmation email at the address they provide in the booking form. This email includes:

- Summary of their booking request
- Next steps (24-48 hour response time)
- Contact information
- Welcoming message

**No configuration needed** - this is automatic for all booking submissions.

---

## Resend Setup

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Verify Your Domain

**Important:** You must verify your sender domain in Resend before emails will send.

1. Go to **Domains** in the Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `unitedtattoo.com`)
4. Follow the DNS verification instructions:
   - Add the provided DNS records to your domain
   - Wait for DNS propagation (can take up to 24 hours)
   - Resend will automatically verify once records are detected

**For development/testing:** Resend provides a sandbox domain you can use immediately without verification.

### 3. Get API Key

1. Go to **API Keys** in the Resend dashboard
2. Click **Create API Key**
3. Name it (e.g., "United Tattoo Production")
4. Copy the key (starts with `re_`)
5. Add it to Cloudflare Pages environment variables

### 4. Configure Sender Email

The `BOOKING_FROM_EMAIL` must be one of:
- An email at your verified domain (e.g., `bookings@unitedtattoo.com`)
- The Resend sandbox email (for testing only)

---

## Deployment Methods

### Option 1: Cloudflare Pages Git Integration (Recommended)

1. **Connect your Git repository**
   - In Cloudflare Pages, click **Create a project**
   - Connect to your Git provider (GitHub, GitLab, etc.)
   - Select the `united-tattoo` repository

2. **Configure build settings**
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Framework preset:** Astro

3. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy on every push to your main branch

### Option 2: Wrangler CLI

```bash
# Build the project
pnpm build

# Deploy with Wrangler
pnpm deploy
```

**Note:** Requires `wrangler` to be installed and authenticated with `wrangler login`.

---

## Testing Email Functionality

### Local Development

When `RESEND_API_KEY` is not set (local dev), the booking API will:
- Log email details to the console
- Not actually send emails
- Still validate all form inputs and file uploads

**To test locally with real emails:**
1. Create a `.env` file in the project root
2. Add your Resend API key
3. Run `pnpm dev`
4. Submit a test booking

### Production Testing

1. **Check Cloudflare Pages logs**
   - Go to your project → **Deployments** → Select deployment → **Functions**
   - Check for any API errors

2. **Monitor Resend dashboard**
   - Go to [resend.com/emails](https://resend.com/emails)
   - See all sent emails, open rates, and delivery status

3. **Test booking flow**
   - Submit a test booking through the live site
   - Verify all 3 emails are sent:
     - ✅ Admin notification to `Christyl116@yahoo.com`
     - ✅ Admin notification to `ashtonjl.work@gmail.com`
     - ✅ Client confirmation to the submitted email
     - ✅ Artist notification (if artist has `bookingEmailCc`)

---

## Troubleshooting

### Emails Not Sending

1. **Check environment variables are set in Cloudflare**
   - Verify `RESEND_API_KEY` is correctly configured
   - Ensure no extra spaces or quotes

2. **Verify sender domain in Resend**
   - Make sure your domain is verified (green checkmark)
   - Check that `BOOKING_FROM_EMAIL` matches your verified domain

3. **Check Cloudflare Functions logs**
   - Look for errors in the `/api/booking` function logs
   - Common issues: Invalid API key, unverified domain, rate limits

4. **Check Resend API key permissions**
   - Ensure the API key has "Sending access" enabled
   - Try regenerating the API key if issues persist

### Missing Client Confirmation Email

- Check the client's spam/junk folder
- Verify the email address was valid in the booking form
- Check Resend dashboard for delivery failures

### Artist Not Receiving Notification

- Verify the artist's MDX file has `bookingEmailCc` field
- Check the email address is valid
- Confirm the artist was actually selected in the booking (not "No preference")

---

## Security Notes

- **Never commit API keys** to Git - always use environment variables
- **Rotate API keys** periodically for security
- **Use different API keys** for production vs. preview environments
- **Monitor Resend usage** to detect unusual activity

---

## Additional Resources

- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Resend Documentation](https://resend.com/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
