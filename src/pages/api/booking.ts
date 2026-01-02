import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { getCollection } from 'astro:content';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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

    // Get environment variables
    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const BOOKING_FROM_EMAIL = import.meta.env.BOOKING_FROM_EMAIL || 'bookings@yourdomain.com';

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
      <h1>New Booking Request</h1>

      <h2>Artist Selection</h2>
      <p><strong>Preferred Artist:</strong> ${escapeHtml(artistDisplayName)}</p>

      <h2>Contact Information</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Phone:</strong> ${escapeHtml(phone)}</li>
        <li><strong>Preferred Contact:</strong> ${escapeHtml(preferredContact || 'Email')}</li>
      </ul>

      <h2>Project Details</h2>
      <ul>
        <li><strong>Style:</strong> ${escapeHtml(style)}</li>
        <li><strong>Placement:</strong> ${escapeHtml(placement)}</li>
        <li><strong>Size:</strong> ${escapeHtml(size)}</li>
        <li><strong>Budget:</strong> ${escapeHtml(budget || 'Not specified')}</li>
        <li><strong>Availability:</strong> ${escapeHtml(availability || 'Not specified')}</li>
      </ul>

      <h3>Description</h3>
      <p>${escapeHtml(description).replace(/\n/g, '<br>')}</p>

      <h2>Consent</h2>
      <ul>
        <li><strong>Accepted Terms:</strong> Yes</li>
        <li><strong>Confirmed Age:</strong> Yes</li>
        <li><strong>Understands Deposit:</strong> ${acceptDeposit ? 'Yes' : 'No'}</li>
      </ul>

      <h2>Reference Images</h2>
      <p>${validFiles.length > 0 ? `${validFiles.length} image(s) attached` : 'No images attached'}</p>

      <hr>
      <p><em>This booking request was submitted via the United Tattoo website.</em></p>
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
        <h1>Thank You for Your Booking Request!</h1>

        <p>Hi ${escapeHtml(name)},</p>

        <p>We've received your tattoo booking request and our team is excited to work with you! Here's a summary of what you submitted:</p>

        <h2>Your Request Details</h2>
        <ul>
          <li><strong>Preferred Artist:</strong> ${escapeHtml(artistDisplayName)}</li>
          <li><strong>Style:</strong> ${escapeHtml(style)}</li>
          <li><strong>Placement:</strong> ${escapeHtml(placement)}</li>
          <li><strong>Size:</strong> ${escapeHtml(size)}</li>
          ${budget ? `<li><strong>Budget:</strong> ${escapeHtml(budget)}</li>` : ''}
          ${availability ? `<li><strong>Availability:</strong> ${escapeHtml(availability)}</li>` : ''}
          ${validFiles.length > 0 ? `<li><strong>Reference Images:</strong> ${validFiles.length} image(s) uploaded</li>` : ''}
        </ul>

        <h2>What Happens Next?</h2>
        <p>Our team will review your request and get back to you within <strong>24-48 hours</strong>. We'll discuss your design ideas, answer any questions, and help you schedule your appointment.</p>

        <h2>Questions?</h2>
        <p>If you need to reach us before then, feel free to contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:Christyl116@yahoo.com">Christyl116@yahoo.com</a></li>
          <li><strong>Phone:</strong> Check our website for current contact information</li>
        </ul>

        <p>We can't wait to bring your vision to life!</p>

        <p>Best regards,<br>
        <strong>United Tattoo</strong><br>
        Fountain, CO</p>

        <hr>
        <p style="font-size: 12px; color: #666;"><em>This is an automated confirmation. Please do not reply to this email.</em></p>
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
- Email: Christyl116@yahoo.com
- Phone: Check our website for current contact information

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

