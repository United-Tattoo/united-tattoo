import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/flags', () => ({
  Flags: { UPLOADS_ADMIN_ENABLED: false },
}))
vi.mock('@/lib/auth', () => ({
  authOptions: {},
  requireAuth: vi.fn(),
}))
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(async () => null),
}))

describe('Uploads admin disabled', () => {
  it('returns 503 for files bulk-delete when UPLOADS_ADMIN_ENABLED=false', async () => {
    const { POST } = await import('../../app/api/files/bulk-delete/route')
    const fakeReq: any = { json: async () => ({ fileIds: ['1'] }) }
    const res = await POST(fakeReq as any)
    const body = await res.json()
    expect(res.status).toBe(503)
    expect(body).toHaveProperty('error')
  })
})
