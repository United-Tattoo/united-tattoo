import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getCollection } from 'astro:content';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, platform }) => {
  try {
    const formData = await request.formData();

    // Extract form fields
    const artist = formData.get('artist') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const preferredContact = formData.get('preferredContact') as string;
    const style = formData.get('style') as string;
    const placement = formData.get('placement') as string;
    const size = formData.get('size') as string;
    const budget = formData.get('budget') as string;
    const availability = formData.get('availability') as string;
    const description = formData.get('description') as string;
    const acceptTerms = formData.get('acceptTerms');
    const acceptAge = formData.get('acceptAge');
    const acceptDeposit = formData.get('acceptDeposit');

    const escapeHtml = (input: string) =>
      input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    // Validate required fields
    if (!artist || !name || !email || !phone || !style || !placement || !size || !description) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!acceptTerms || !acceptAge) {
      return new Response(
        JSON.stringify({ success: false, error: 'You must accept the terms and confirm your age' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process file uploads
    const files = formData.getAll('references') as File[];
    const validFiles: File[] = [];

    for (const file of files) {
      // Skip empty file inputs
      if (!file || file.size === 0) continue;

      if (validFiles.length >= MAX_FILES) {
        return new Response(
          JSON.stringify({ success: false, error: `Maximum ${MAX_FILES} files allowed` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ success: false, error: `Invalid file type: ${file.name}. Only JPG, PNG, WebP, and GIF are allowed.` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ success: false, error: `File too large: ${file.name}. Maximum size is 10MB.` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      validFiles.push(file);
    }

    // Prepare attachments for email
    const attachments = await Promise.all(
      validFiles.map(async (file) => {
        const buffer = await file.arrayBuffer();
        return {
          filename: file.name,
          content: Buffer.from(buffer),
        };
      })
    );

    // Get environment variables (Cloudflare Workers runtime)
    // Try multiple access patterns for Cloudflare env vars
    const env = (platform?.env as Record<string, string>) ||
                (locals?.runtime?.env as Record<string, string>) ||
                {};

    const RESEND_API_KEY = env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const BOOKING_FROM_EMAIL = env.BOOKING_FROM_EMAIL || import.meta.env.BOOKING_FROM_EMAIL || 'bookings@yourdomain.com';

    // Debug logging (remove after testing)
    console.log('Environment check:', {
      hasApiKey: !!RESEND_API_KEY,
      fromEmail: BOOKING_FROM_EMAIL,
      platformEnv: !!platform?.env,
      localsEnv: !!locals?.runtime?.env
    });

    // Shop admin emails
    const ADMIN_EMAILS = ['Christyl116@yahoo.com', 'ashtonjl.work@gmail.com'];

    // Lookup artist (to notify both reception + artist, per booking flow)
    const artists = await getCollection('artists');
    const selectedArtist =
      artist === 'no-preference' ? undefined : artists.find((a) => a.id === artist);
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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #E67E50; padding: 24px 40px;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #ffffff;">
                New Booking Request
              </h1>
              <p style="margin: 8px 0 0 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.9);">
                United Tattoo · Admin Notification
              </p>
            </td>
          </tr>

          <!-- Client Contact (Prominent) -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; background-color: #fff7ec; border-left: 4px solid #D87850;">
              <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                01 // Client Contact
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 12px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49; width: 35%;">Name</td>
                  <td style="padding: 6px 0; font-size: 15px; color: #1c1915; font-weight: 600;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Email</td>
                  <td style="padding: 6px 0; font-size: 15px; color: #E67E50; font-weight: 600;">
                    <a href="mailto:${escapeHtml(email)}" style="color: #E67E50; text-decoration: none;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Phone</td>
                  <td style="padding: 6px 0; font-size: 15px; color: #1c1915; font-weight: 600;">${escapeHtml(phone)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Preferred Contact</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915;">${escapeHtml(preferredContact || 'Email')}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Artist Selection -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                02 // Artist Selection
              </p>
              <p style="margin: 0; font-size: 16px; color: #1c1915; font-weight: 600;">
                ${escapeHtml(artistDisplayName)}
              </p>
            </td>
          </tr>

          <!-- Project Details -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                03 // Project Details
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49; width: 35%;">Style</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(style)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Placement</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(placement)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Size</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(size)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Budget</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(budget || 'Not specified')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #6f5c49;">Availability</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(availability || 'Not specified')}</td>
                </tr>
              </table>

              <div style="margin-top: 20px; padding: 16px; background-color: #f9f9f9; border-left: 2px solid #D87850;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #6f5c49; font-weight: 600; text-transform: uppercase;">Description</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1c1915;">${escapeHtml(description).replace(/\n/g, '<br>')}</p>
              </div>
            </td>
          </tr>

          <!-- Reference Images -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                04 // Reference Images
              </p>
              <p style="margin: 0; font-size: 14px; color: #1c1915;">
                ${validFiles.length > 0 ? `<strong>${validFiles.length} image(s) attached</strong> to this email` : '<em>No reference images provided</em>'}
              </p>
            </td>
          </tr>

          <!-- Consent Info -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0 0 12px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                05 // Consent
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6f5c49;">Accepted Terms</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #1c1915;">✓ Yes</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6f5c49;">Confirmed Age (18+)</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #1c1915;">✓ Yes</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6f5c49;">Understands Deposit</td>
                  <td style="padding: 4px 0; font-size: 13px; color: #1c1915;">${acceptDeposit ? '✓ Yes' : '✗ No'}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #6f5c49;">
                <em>Submitted via unitedtattoo.com/booking</em>
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

Reference Images: ${validFiles.length > 0 ? `${validFiles.length} image(s) attached` : 'No images attached'}

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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #E67E50; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; font-weight: 400; font-style: italic; color: #ffffff; letter-spacing: 0.5px;">
                United Tattoo
              </h1>
              <p style="margin: 8px 0 0 0; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.9);">
                Fountain, Colorado
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #1c1915;">
                Thank You, ${escapeHtml(name)}
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.7; color: #1c1915;">
                We've received your booking request and our team is excited to work with you! Here's a summary of what you submitted:
              </p>

              <!-- Booking Details Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fff7ec; border-left: 3px solid #D87850; margin: 0 0 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 4px 0; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #6f5c49;">
                      Your Request Details
                    </p>

                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top; width: 35%;">Preferred Artist</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(artistDisplayName)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Style</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(style)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Placement</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(placement)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Size</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(size)}</td>
                      </tr>
                      ${budget ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Budget</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(budget)}</td>
                      </tr>
                      ` : ''}
                      ${availability ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Availability</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${escapeHtml(availability)}</td>
                      </tr>
                      ` : ''}
                      ${validFiles.length > 0 ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6f5c49; vertical-align: top;">Reference Images</td>
                        <td style="padding: 8px 0; font-size: 14px; color: #1c1915; font-weight: 600;">${validFiles.length} image(s) uploaded</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next Section -->
              <div style="margin: 0 0 32px 0; padding-bottom: 32px; border-bottom: 1px solid #f2e3d0;">
                <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1c1915;">
                  What Happens Next?
                </h3>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1c1915;">
                  Our team will review your request and get back to you within <strong>24-48 hours</strong>. We'll discuss your design ideas, answer any questions, and help you schedule your appointment.
                </p>
              </div>

              <!-- Contact Section -->
              <div style="margin: 0 0 32px 0;">
                <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #1c1915;">
                  Questions?
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.7; color: #1c1915;">
                  If you need to reach us before then, feel free to contact us:
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1c1915;">
                  <strong>Email:</strong> <a href="mailto:ink@united-tattoos.com" style="color: #E67E50; text-decoration: none;">ink@united-tattoos.com</a>
                </p>
              </div>

              <!-- Closing -->
              <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.7; color: #1c1915;">
                We can't wait to bring your vision to life!
              </p>
              <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #1c1915;">
                <strong>United Tattoo</strong><br>
                Fountain, CO
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #f2e3d0;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #6f5c49;">
                <em>This is an automated confirmation. Please do not reply to this email.</em>
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
Thank You for Your Booking Request!

Hi ${name},

We've received your tattoo booking request and our team is excited to work with you! Here's a summary of what you submitted:

YOUR REQUEST DETAILS
- Preferred Artist: ${artistDisplayName}
- Style: ${style}
- Placement: ${placement}
- Size: ${size}${budget ? `\n- Budget: ${budget}` : ''}${availability ? `\n- Availability: ${availability}` : ''}${validFiles.length > 0 ? `\n- Reference Images: ${validFiles.length} image(s) uploaded` : ''}

WHAT HAPPENS NEXT?
Our team will review your request and get back to you within 24-48 hours. We'll discuss your design ideas, answer any questions, and help you schedule your appointment.

QUESTIONS?
If you need to reach us before then, feel free to contact us:
- Email: ink@united-tattoos.com

We can't wait to bring your vision to life!

Best regards,
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
    } else {
      // Dev mode: log the email instead of sending
      console.log('=== BOOKING REQUEST (Dev Mode) ===');
      console.log('Would send email to:', recipients.join(', '));
      console.log('From:', BOOKING_FROM_EMAIL);
      console.log('Reply-To:', email);
      console.log('Subject:', `New Booking Request: ${name} · ${style} · ${artistDisplayName}`);
      console.log('Attachments:', validFiles.length);
      console.log('---');
      console.log(emailText);
      console.log('=================================');
      console.log('');
      console.log('=== CLIENT CONFIRMATION (Dev Mode) ===');
      console.log('Would send email to:', email);
      console.log('From:', BOOKING_FROM_EMAIL);
      console.log('Subject: Booking Request Received - United Tattoo');
      console.log('=================================');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Booking request submitted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Booking API error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

