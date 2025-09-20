import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/flags', () => ({
  Flags: { BOOKING_ENABLED: false },
}))
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}))
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}))

describe('Booking appointments mutations with BOOKING_ENABLED=false', () => {
  it('POST returns 503 without invoking booking logic', async () => {
    const { POST } = await import('../../app/api/appointments/route')
    const response = await POST({} as any)
    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Booking disabled' })
  })

  it('PUT returns 503 without invoking booking logic', async () => {
    const { PUT } = await import('../../app/api/appointments/route')
    const response = await PUT({} as any)
    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Booking disabled' })
  })

  it('DELETE returns 503 without invoking booking logic', async () => {
    const { DELETE } = await import('../../app/api/appointments/route')
    const response = await DELETE({} as any)
    expect(response.status).toBe(503)
    await expect(response.json()).resolves.toEqual({ error: 'Booking disabled' })
  })
})
