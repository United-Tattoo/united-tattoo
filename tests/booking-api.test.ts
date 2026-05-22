import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCollection } from 'astro:content';

const getCollectionMock = vi.mocked(getCollection);

function createBookingForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values = {
    artist: 'christy-lumberg',
    name: 'Dev Test',
    email: 'dev@example.com',
    phone: '555-555-5555',
    preferredContact: 'email',
    style: 'fine-line',
    placement: 'arm',
    size: 'small',
    description: 'A small fine line tattoo.',
    acceptTerms: 'on',
    acceptAge: 'on',
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

async function postBooking(formData: FormData, headers?: HeadersInit) {
  const { POST } = await import('../src/pages/api/booking');
  const request = new Request('http://localhost/api/booking', {
    method: 'POST',
    headers,
    body: formData,
  });

  return POST(({
    request,
    locals: { runtime: { env: {} } },
  } as unknown) as Parameters<typeof POST>[0]);
}

describe('POST /api/booking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCollectionMock.mockResolvedValue([
      {
        id: 'christy-lumberg',
        collection: 'artists',
        data: {
          name: 'Christy Lumberg',
          portrait: '/artists/Christy-Lumberg/portrait.avif',
          galleryDir: '/artists/Christy-Lumberg',
          acceptingBookings: true,
          bufferMinutes: 30,
          bookingEmailCc: 'christy@example.com',
        },
      },
    ]);
  });

  it('rejects incomplete booking requests before email work runs', async () => {
    const response = await postBooking(createBookingForm({ email: '' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Missing required fields',
    });
  });

  it('uses selected calendar slots as the availability text in dev mode', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const formData = createBookingForm({
      selected_slots: JSON.stringify([
        { date: '2026-05-22', startTime: '00:30', endTime: '01:00', available: true },
      ]),
    });

    const response = await postBooking(formData);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Booking request submitted successfully',
    });
    expect(logSpy.mock.calls.flat().join('\n')).toContain(
      'Availability: Choice #1: Fri, May 22 at 12:30 AM MT',
    );
  });

  it('rejects text fields that exceed server-side length limits', async () => {
    const response = await postBooking(createBookingForm({ description: 'x'.repeat(4001) }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Description must be 4000 characters or fewer',
    });
  });

  it('rejects values outside the booking form allowlists', async () => {
    const response = await postBooking(createBookingForm({ style: 'free tattoos<script>' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Invalid tattoo style',
    });
  });

  it('rejects spoofed artist ids that are not in the content collection', async () => {
    const response = await postBooking(createBookingForm({ artist: 'unknown-artist' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Invalid artist selection',
    });
  });

  it('accepts honeypot bot submissions without sending booking email', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const response = await postBooking(createBookingForm({ website: 'https://spam.example' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: 'Booking request submitted successfully',
    });
    expect(logSpy.mock.calls.flat().join('\n')).not.toContain('BOOKING REQUEST');
  });

  it('rejects oversized requests before parsing form data', async () => {
    const response = await postBooking(createBookingForm(), {
      'content-length': String(56 * 1024 * 1024),
    });

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Booking request is too large',
    });
  });

  it('rejects uploaded images whose bytes do not match an allowed image signature', async () => {
    const formData = createBookingForm();
    formData.set(
      'references',
      new File(['not really an image'], 'proof.jpg', { type: 'image/jpeg' }),
    );

    const response = await postBooking(formData);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Invalid image content: proof.jpg',
    });
  });
});
