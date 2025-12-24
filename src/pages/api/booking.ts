import type { APIRoute } from 'astro';
import { Resend } from 'resend';

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
    const description = formData.get('description') as string;
    const acceptTerms = formData.get('acceptTerms');
    const acceptAge = formData.get('acceptAge');
    const acceptDeposit = formData.get('acceptDeposit');

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
    const BOOKING_TO_EMAIL = import.meta.env.BOOKING_TO_EMAIL || 'ink@unitedtattoo.com';
    const BOOKING_FROM_EMAIL = import.meta.env.BOOKING_FROM_EMAIL || 'bookings@yourdomain.com';

    // Build email content
    const emailHtml = `
      <h1>New Booking Request</h1>

      <h2>Artist Selection</h2>
      <p><strong>Preferred Artist:</strong> ${artist === 'no-preference' ? 'No preference' : artist}</p>

      <h2>Contact Information</h2>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Preferred Contact:</strong> ${preferredContact || 'Email'}</li>
      </ul>

      <h2>Project Details</h2>
      <ul>
        <li><strong>Style:</strong> ${style}</li>
        <li><strong>Placement:</strong> ${placement}</li>
        <li><strong>Size:</strong> ${size}</li>
        <li><strong>Budget:</strong> ${budget || 'Not specified'}</li>
      </ul>

      <h3>Description</h3>
      <p>${description.replace(/\n/g, '<br>')}</p>

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
Preferred Artist: ${artist === 'no-preference' ? 'No preference' : artist}

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

      const { error } = await resend.emails.send({
        from: BOOKING_FROM_EMAIL,
        to: BOOKING_TO_EMAIL,
        replyTo: email,
        subject: `New Booking Request: ${name} - ${style}`,
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
    } else {
      // Dev mode: log the email instead of sending
      console.log('=== BOOKING REQUEST (Dev Mode) ===');
      console.log('Would send email to:', BOOKING_TO_EMAIL);
      console.log('From:', BOOKING_FROM_EMAIL);
      console.log('Reply-To:', email);
      console.log('Subject:', `New Booking Request: ${name} - ${style}`);
      console.log('Attachments:', validFiles.length);
      console.log('---');
      console.log(emailText);
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

