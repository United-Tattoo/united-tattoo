import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getCollection } from 'astro:content';
import bookingForm from '../../data/booking-form.json';
import { getPublicArtists } from '../../services/artists';
import { formatSelectedSlots } from '../../services/booking-format';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// Reject obviously oversized submissions before parsing multipart data.
// The form allows five 10MB files, so this leaves a small buffer for text fields
// and multipart boundaries without letting a single request consume unbounded memory.
const MAX_REQUEST_SIZE = 55 * 1024 * 1024; // Allow 5 x 10MB files plus form overhead.
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// This in-memory limiter is a lightweight abuse guard for repeated POSTs from
// the same IP in one Worker isolate/dev process. Cloudflare Turnstile or WAF
// rules should still be preferred if bot traffic becomes persistent.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Select inputs are controlled in the UI, but every value is still client input.
// Source allowlists from the same Decap-editable file used by the booking page.
const toAllowedSet = (options: { value: string }[]) => new Set(options.map((option) => option.value));
const ALLOWED_CONTACT_METHODS = toAllowedSet(bookingForm.contactOptions);
const ALLOWED_STYLES = toAllowedSet(bookingForm.styleOptions);
const ALLOWED_SIZES = toAllowedSet(bookingForm.sizeOptions);
const ALLOWED_BUDGETS = toAllowedSet(bookingForm.budgetOptions);

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export const prerender = false;

type RuntimeEnv = Record<string, string | undefined>;
type RuntimeContext = Parameters<APIRoute>[0] & {
  platform?: { env?: RuntimeEnv };
  locals: Parameters<APIRoute>[0]['locals'] & {
    runtime?: { env?: RuntimeEnv };
  };
};

// Keep all API responses JSON-shaped so client-side error handling can stay
// predictable and tests can assert exact behavior.
function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function successResponse() {
  return jsonResponse({ success: true, message: 'Booking request submitted successfully' }, 200);
}

function validationError(error: string) {
  return jsonResponse({ success: false, error }, 400);
}

function getString(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

// Strip control characters before using form values in logs, email text, or
// headers. Newlines are allowed only for fields that are expected to be prose.
function stripControlCharacters(value: string, allowNewline = false): string {
  return Array.from(value).filter((char) => {
    const code = char.charCodeAt(0);
    if (allowNewline && code === 10) return true;
    return code >= 32 && code !== 127;
  }).join('');
}

function cleanSingleLine(value: string): string {
  return stripControlCharacters(value).replace(/\s+/g, ' ').trim();
}

function cleanMultiline(value: string): string {
  return stripControlCharacters(value.replace(/\r\n?/g, '\n'), true)
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

function validateLength(value: string, max: number, label: string): Response | null {
  return value.length > max ? validationError(`${label} must be ${max} characters or fewer`) : null;
}

function getClientIp(request: Request): string | null {
  // Cloudflare supplies cf-connecting-ip in production. The fallback headers
  // make the same guard work in local/proxy-style environments.
  return request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null;
}

function rateLimitResponse(request: Request): Response | null {
  const clientIp = getClientIp(request);
  if (!clientIp) return null;

  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientIp);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return new Response(JSON.stringify({ success: false, error: 'Too many booking requests. Please try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    });
  }

  bucket.count += 1;
  return null;
}

function isAllowedImageSignature(type: string, buffer: Buffer): boolean {
  // MIME type and extension are user-controlled metadata. These magic-byte
  // checks are not malware scanning, but they prevent obvious disguised files
  // from being emailed to the shop as image attachments.
  if (type === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (type === 'image/png') {
    return buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a;
  }

  if (type === 'image/gif') {
    return buffer.length >= 6 && buffer.subarray(0, 4).toString('ascii') === 'GIF8';
  }

  if (type === 'image/webp') {
    return buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return false;
}

function sanitizeFilename(name: string): string {
  // Attachment filenames can appear in mail clients. Collapse path segments,
  // remove control characters, and restrict to a conservative printable set.
  const baseName = cleanSingleLine(name.split(/[\\/]/).pop() || 'reference-image');
  const safeName = baseName.replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 120).trim();
  return safeName || 'reference-image';
}

export const POST: APIRoute = async (context) => {
  const runtimeContext = context as RuntimeContext;
  const { request } = runtimeContext;

  try {
    // Fast-fail oversized multipart requests before request.formData() allocates
    // buffers for file bodies.
    const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
      return jsonResponse({ success: false, error: 'Booking request is too large' }, 413);
    }

    const limited = rateLimitResponse(request);
    if (limited) return limited;

    const formData = await request.formData();

    // Honeypot field: humans never see/fill this. Bots often populate every
    // text field, so we return a normal success without sending email to avoid
    // teaching the bot which validation failed.
    if (cleanSingleLine(getString(formData, 'website'))) {
      return successResponse();
    }

    // Normalize all text before validation and email rendering. This keeps
    // length checks honest and avoids control characters reaching email headers,
    // logs, or admin inboxes.
    const artist = cleanSingleLine(getString(formData, 'artist'));
    const name = cleanSingleLine(getString(formData, 'name'));
    const email = cleanSingleLine(getString(formData, 'email')).toLowerCase();
    const phone = cleanSingleLine(getString(formData, 'phone'));
    const preferredContact = cleanSingleLine(getString(formData, 'preferredContact')) || 'email';
    const style = cleanSingleLine(getString(formData, 'style'));
    const placement = cleanSingleLine(getString(formData, 'placement'));
    const size = cleanSingleLine(getString(formData, 'size'));
    const budget = cleanSingleLine(getString(formData, 'budget'));
    const availabilityInput = cleanMultiline(getString(formData, 'availability'));
    const selectedSlotsJson = getString(formData, 'selected_slots');

    let availability = availabilityInput;

    const formattedSelectedSlots = formatSelectedSlots(selectedSlotsJson);
    if (formattedSelectedSlots) {
      availability = formattedSelectedSlots;
    }
    const description = cleanMultiline(getString(formData, 'description'));
    const acceptTerms = formData.get('acceptTerms');
    const acceptAge = formData.get('acceptAge');
    const acceptDeposit = formData.get('acceptDeposit');
    const subscribeToNewsletter = formData.get('subscribeToNewsletter');

    const escapeHtml = (input: string) =>
      input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    // Required-field validation happens after normalization so whitespace-only
    // values cannot satisfy the booking requirements.
    if (!artist || !name || !email || !phone || !style || !placement || !size || !description) {
      return validationError('Missing required fields');
    }

    if (!acceptTerms || !acceptAge) {
      return validationError('You must accept the terms and confirm your age');
    }

    // Bound free-text fields to keep email payloads and Worker memory usage
    // predictable. These limits are intentionally generous for a booking form.
    const lengthError =
      validateLength(artist, 80, 'Artist') ||
      validateLength(name, 120, 'Name') ||
      validateLength(email, 254, 'Email') ||
      validateLength(phone, 40, 'Phone') ||
      validateLength(preferredContact, 20, 'Preferred contact') ||
      validateLength(style, 40, 'Style') ||
      validateLength(placement, 120, 'Placement') ||
      validateLength(size, 40, 'Size') ||
      validateLength(budget, 40, 'Budget') ||
      validateLength(availability, 1000, 'Availability') ||
      validateLength(description, 4000, 'Description');
    if (lengthError) return lengthError;

    // Server-side allowlists protect the email workflow from forged form values.
    // The client select controls improve UX only; they are not security controls.
    if (!ALLOWED_CONTACT_METHODS.has(preferredContact)) {
      return validationError('Invalid contact method');
    }

    if (!ALLOWED_STYLES.has(style)) {
      return validationError('Invalid tattoo style');
    }

    if (!ALLOWED_SIZES.has(size)) {
      return validationError('Invalid tattoo size');
    }

    if (budget && !ALLOWED_BUDGETS.has(budget)) {
      return validationError('Invalid budget range');
    }

    // Normalize and validate email before using it in replyTo, newsletter opt-in,
    // and the customer confirmation recipient.
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return validationError('Invalid email address');
    }

    const artists = getPublicArtists(await getCollection('artists'));
    const selectedArtist =
      artist === 'no-preference' ? undefined : artists.find((a) => a.id === artist);

    // A forged artist id should not route mail to arbitrary labels or bypass the
    // content model. No-preference is the only non-content artist value allowed.
    if (artist !== 'no-preference' && !selectedArtist) {
      return validationError('Invalid artist selection');
    }

    if (selectedArtist && !selectedArtist.data.acceptingBookings) {
      return validationError('Selected artist is not accepting bookings');
    }

    // Process uploads only after the cheap text validation has passed. Files are
    // held in memory long enough to validate signatures and pass them to Resend.
    const files = formData.getAll('references') as File[];
    const attachments: Array<{ filename: string; content: Buffer }> = [];

    for (const file of files) {
      // Skip empty file inputs
      if (!file || file.size === 0) continue;

      // Check count before buffering file bytes.
      if (attachments.length >= MAX_FILES) {
        return validationError(`Maximum ${MAX_FILES} files allowed`);
      }

      // Check type and declared size before reading the file into memory.
      if (!ALLOWED_TYPES.includes(file.type)) {
        return validationError(`Invalid file type: ${sanitizeFilename(file.name)}. Only JPG, PNG, WebP, and GIF are allowed.`);
      }

      if (file.size > MAX_FILE_SIZE) {
        return validationError(`File too large: ${sanitizeFilename(file.name)}. Maximum size is 10MB.`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      if (!isAllowedImageSignature(file.type, buffer)) {
        return validationError(`Invalid image content: ${sanitizeFilename(file.name)}`);
      }

      attachments.push({
        filename: sanitizeFilename(file.name),
        content: buffer,
      });
    }

    // Cloudflare exposes runtime bindings differently between adapter versions,
    // wrangler dev, and local Astro dev. Keep all supported access paths here.
    const env = runtimeContext.platform?.env ||
                runtimeContext.locals.runtime?.env ||
                {};

    const RESEND_API_KEY = env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const BOOKING_FROM_EMAIL = env.BOOKING_FROM_EMAIL || import.meta.env.BOOKING_FROM_EMAIL || 'bookings@yourdomain.com';
    const RESEND_AUDIENCE_ID = env.RESEND_AUDIENCE_ID || import.meta.env.RESEND_AUDIENCE_ID;

    // Shop admin emails
    const ADMIN_EMAILS = ['Christyl116@yahoo.com', 'ashtonjl.work@gmail.com'];

    // Keep reception/admin on every booking, then CC the selected artist when
    // the artist frontmatter includes bookingEmailCc.
    const artistDisplayName =
      artist === 'no-preference' ? 'No preference' : (selectedArtist?.data.name || artist);
    const artistEmail = selectedArtist?.data.bookingEmailCc;

    const recipients = artistEmail ? [...ADMIN_EMAILS, artistEmail] : ADMIN_EMAILS;

    // Build email content
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request - United Tattoo</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #050505;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #050505;">
    <tr>
      <td align="center" style="padding: 44px 18px;">
        <!-- Main Container -->
        <table role="presentation" style="width: 100%; max-width: 640px; border-collapse: collapse; background-color: #f7f4ee; border: 1px solid #d8d2c8;">

          <!-- Header -->
          <tr>
            <td style="background-color: #050505; padding: 30px 40px 34px 40px; border-bottom: 1px solid #333333;">
              <p style="margin: 0 0 18px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #b8b2a8;">
                United Tattoo / Admin Notification
              </p>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 32px; line-height: 1.05; font-weight: 400; color: #f7f4ee;">
                New Booking Request
              </h1>
              <p style="margin: 14px 0 0 0; font-size: 14px; line-height: 1.6; color: #b8b2a8;">
                A new client inquiry has been submitted from the booking form.
              </p>
            </td>
          </tr>

          <!-- Client Contact (Prominent) -->
          <tr>
            <td style="padding: 32px 40px 26px 40px; background-color: #ffffff; border-bottom: 1px solid #d8d2c8;">
              <p style="margin: 0 0 14px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                01 // Client Contact
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                <tr>
                  <td style="padding: 7px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; width: 35%;">Name</td>
                  <td style="padding: 7px 0; font-size: 16px; color: #111111; font-weight: 700;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Email</td>
                  <td style="padding: 7px 0; font-size: 16px; color: #111111; font-weight: 700;">
                    <a href="mailto:${escapeHtml(email)}" style="color: #111111; text-decoration: underline; text-decoration-color: #b8b2a8; text-underline-offset: 4px;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Phone</td>
                  <td style="padding: 7px 0; font-size: 16px; color: #111111; font-weight: 700;">${escapeHtml(phone)}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Preferred Contact</td>
                  <td style="padding: 7px 0; font-size: 15px; color: #333333;">${escapeHtml(preferredContact || 'Email')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Artist Selection -->
          <tr>
            <td style="padding: 26px 40px; border-bottom: 1px solid #d8d2c8;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                02 // Artist Selection
              </p>
              <p style="margin: 0; font-family: Georgia, serif; font-size: 24px; line-height: 1.2; color: #111111; font-weight: 400;">
                ${escapeHtml(artistDisplayName)}
              </p>
            </td>
          </tr>

          <!-- Project Details -->
          <tr>
            <td style="padding: 30px 40px; border-bottom: 1px solid #d8d2c8;">
              <p style="margin: 0 0 14px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                03 // Project Details
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; width: 35%;">Style</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(style)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Placement</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(placement)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Size</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(size)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Budget</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(budget || 'Not specified')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Availability</td>
                  <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(availability || 'Not specified').replace(/\n/g, '<br>')}</td>
                </tr>
              </table>

              <div style="margin-top: 22px; padding: 18px 20px; background-color: #ffffff; border: 1px solid #d8d2c8;">
                <p style="margin: 0 0 10px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2.4px; color: #7e7a72; font-weight: 700; text-transform: uppercase;">Description</p>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #111111;">${escapeHtml(description).replace(/\n/g, '<br>')}</p>
              </div>
            </td>
          </tr>

          <!-- Reference Images -->
          <tr>
            <td style="padding: 26px 40px; border-bottom: 1px solid #d8d2c8;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                04 // Reference Images
              </p>
              <p style="margin: 0; font-size: 15px; color: #111111;">
                ${attachments.length > 0 ? `<strong>${attachments.length} image(s) attached</strong> to this email` : '<em>No reference images provided</em>'}
              </p>
            </td>
          </tr>

          <!-- Consent Info -->
          <tr>
            <td style="padding: 26px 40px; border-bottom: 1px solid #d8d2c8;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                05 // Consent
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Accepted Terms</td>
                  <td style="padding: 5px 0; font-size: 14px; color: #111111;">Yes</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Confirmed Age (18+)</td>
                  <td style="padding: 5px 0; font-size: 14px; color: #111111;">Yes</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72;">Understands Deposit</td>
                  <td style="padding: 5px 0; font-size: 14px; color: #111111;">${acceptDeposit ? 'Yes' : 'No'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 40px; background-color: #111111; text-align: center;">
              <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2.6px; line-height: 1.6; color: #b8b2a8; text-transform: uppercase;">
                Submitted via unitedtattoo.com/booking
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const emailText = `
New Booking Request

Artist Selection
Preferred Artist: ${artistDisplayName}

Contact Information
Name: ${name}
Email: ${email}
Phone: ${phone}
Preferred Contact: ${preferredContact || 'Email'}

Project Details
Style: ${style}
Placement: ${placement}
Size: ${size}
Budget: ${budget || 'Not specified'}
Availability: ${availability || 'Not specified'}

Description:
${description}

Consent
Accepted Terms: Yes
Confirmed Age: Yes
Understands Deposit: ${acceptDeposit ? 'Yes' : 'No'}

Reference Images: ${attachments.length > 0 ? `${attachments.length} image(s) attached` : 'No images attached'}

---
This booking request was submitted via the United Tattoo website.
    `;

    // Send email via Resend
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);

      // Send notification to admin/artist
      const { error } = await resend.emails.send({
        from: BOOKING_FROM_EMAIL,
        to: recipients,
        replyTo: email,
        subject: `New Booking Request: ${name} · ${style} · ${artistDisplayName}`,
        html: emailHtml,
        text: emailText,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      if (error) {
        console.error('Resend error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to send booking request. Please try again later.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Send confirmation email to client
      const clientEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - United Tattoo</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #050505;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #050505;">
    <tr>
      <td align="center" style="padding: 44px 18px;">
        <!-- Main Container -->
        <table role="presentation" style="width: 100%; max-width: 640px; border-collapse: collapse; background-color: #f7f4ee; border: 1px solid #d8d2c8;">

          <!-- Header -->
          <tr>
            <td style="background-color: #050505; padding: 34px 40px 38px 40px; text-align: center; border-bottom: 1px solid #333333;">
              <p style="margin: 0 0 18px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #b8b2a8;">
                United Tattoo / Fountain, Colorado
              </p>
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 34px; line-height: 1.05; font-weight: 400; color: #f7f4ee;">
                Booking Request Received
              </h1>
              <p style="margin: 14px auto 0 auto; max-width: 420px; font-size: 14px; line-height: 1.6; color: #b8b2a8;">
                We have your details and will review the request with the studio team.
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 40px 34px 40px;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 28px; line-height: 1.15; font-weight: 400; color: #111111;">
                Thank You, ${escapeHtml(name)}
              </h2>
              <p style="margin: 0 0 26px 0; font-size: 16px; line-height: 1.75; color: #333333;">
                We have received your booking request. Here is a summary of what you submitted:
              </p>

              <!-- Booking Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #d8d2c8; margin: 0 0 34px 0;">
                <tr>
                  <td style="padding: 26px;">
                    <p style="margin: 0 0 16px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #7e7a72;">
                      Your Request Details
                    </p>

                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top; width: 35%;">Preferred Artist</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(artistDisplayName)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Style</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(style)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Placement</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(placement)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Size</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(size)}</td>
                      </tr>
                      ${budget ? `
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Budget</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(budget)}</td>
                      </tr>
                      ` : ''}
                      ${availability ? `
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Availability</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${escapeHtml(availability).replace(/\n/g, '<br>')}</td>
                      </tr>
                      ` : ''}
                      ${attachments.length > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #7e7a72; vertical-align: top;">Reference Images</td>
                        <td style="padding: 8px 0; font-size: 15px; color: #111111; font-weight: 700;">${attachments.length} image(s) uploaded</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <div style="margin: 0 0 30px 0; padding-bottom: 30px; border-bottom: 1px solid #d8d2c8;">
                <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #111111;">
                  What Happens Next?
                </h3>
                <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #333333;">
                  Our team will review your request and get back to you within <strong style="color: #111111;">24-48 hours</strong>. We will discuss your design ideas, answer questions, and help schedule the next step.
                </p>
              </div>

              <!-- Contact Section -->
              <div style="margin: 0 0 32px 0;">
                <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #111111;">
                  Questions?
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.75; color: #333333;">
                  If you need to reach us before then, contact the studio:
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #333333;">
                  <strong style="color: #111111;">Email:</strong> <a href="mailto:ink@united-tattoos.com" style="color: #111111; text-decoration: underline; text-decoration-color: #b8b2a8; text-underline-offset: 4px;">ink@united-tattoos.com</a>
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.75; color: #111111;">
                Thank you for trusting us with your idea.
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.75; color: #333333;">
                <strong>United Tattoo</strong><br>
                Fountain, CO
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 22px 40px; background-color: #111111; text-align: center;">
              <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2.6px; line-height: 1.6; color: #b8b2a8; text-transform: uppercase;">
                Automated confirmation / Please do not reply
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      const clientEmailText = `
Booking Request Received

Hi ${name},

We have received your tattoo booking request. Here is a summary of what you submitted:

YOUR REQUEST DETAILS
- Preferred Artist: ${artistDisplayName}
- Style: ${style}
- Placement: ${placement}
- Size: ${size}${budget ? `\n- Budget: ${budget}` : ''}${availability ? `\n- Availability: ${availability}` : ''}${attachments.length > 0 ? `\n- Reference Images: ${attachments.length} image(s) uploaded` : ''}

WHAT HAPPENS NEXT?
Our team will review your request and get back to you within 24-48 hours. We will discuss your design ideas, answer questions, and help schedule the next step.

QUESTIONS?
If you need to reach us before then, contact the studio:
- Email: ink@united-tattoos.com

Thank you for trusting us with your idea.

United Tattoo
Fountain, CO

---
This is an automated confirmation. Please do not reply to this email.
      `;

      const { error: clientError } = await resend.emails.send({
        from: BOOKING_FROM_EMAIL,
        to: email,
        subject: `Booking Request Received - United Tattoo`,
        html: clientEmailHtml,
        text: clientEmailText,
      });

      if (clientError) {
        console.error('Client confirmation email error:', clientError);
        // Don't fail the request if client email fails - admin email was sent successfully
      }

      // Add to mailing list if opted in
      if (subscribeToNewsletter && RESEND_AUDIENCE_ID) {
        try {
          const nameParts = name.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ') || '';

          await resend.contacts.create({
            email: email,
            firstName: firstName,
            lastName: lastName || undefined,
            audienceId: RESEND_AUDIENCE_ID,
            unsubscribed: false,
          });

          console.log(`Newsletter subscription: ${email} added to audience ${RESEND_AUDIENCE_ID}`);
        } catch (contactError) {
          // Log but don't fail the booking if newsletter signup fails
          console.error('Newsletter subscription error:', contactError);
        }
      }
    } else {
      // Dev mode: log the email instead of sending
      console.log('=== BOOKING REQUEST (Dev Mode) ===');
      console.log('Would send email to:', recipients.join(', '));
      console.log('From:', BOOKING_FROM_EMAIL);
      console.log('Reply-To:', email);
      console.log('Subject:', `New Booking Request: ${name} · ${style} · ${artistDisplayName}`);
      console.log('Attachments:', attachments.length);
      console.log('---');
      console.log(emailText);
      console.log('=================================');
      console.log('');
      console.log('=== CLIENT CONFIRMATION (Dev Mode) ===');
      console.log('Would send email to:', email);
      console.log('From:', BOOKING_FROM_EMAIL);
      console.log('Subject: Booking Request Received - United Tattoo');
      console.log('=================================');
      console.log('');
      console.log('=== NEWSLETTER OPT-IN (Dev Mode) ===');
      console.log('Newsletter Opt-in:', subscribeToNewsletter ? 'Yes' : 'No');
      if (subscribeToNewsletter) {
        console.log('Would add contact:', email);
        console.log('Audience ID:', RESEND_AUDIENCE_ID || 'NOT SET');
      }
      console.log('=================================');
    }

    return successResponse();

  } catch (error) {
    console.error('Booking API error:', error);
    return jsonResponse({ success: false, error: 'An unexpected error occurred. Please try again.' }, 500);
  }
};
