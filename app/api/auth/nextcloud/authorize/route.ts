import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Custom Nextcloud OAuth Authorization Handler
 *
 * This route initiates the OAuth flow by redirecting to Nextcloud's authorization endpoint.
 * Uses native fetch API instead of NextAuth's OAuth provider (which doesn't work in Cloudflare Workers).
 */
export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTCLOUD_BASE_URL
  const clientId = process.env.NEXTCLOUD_OAUTH_CLIENT_ID

  if (!baseUrl || !clientId) {
    return NextResponse.json(
      { error: 'Nextcloud OAuth is not configured' },
      { status: 500 }
    )
  }

  // Get callback URL from request or use default
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/admin'

  // Generate random state for CSRF protection
  const state = crypto.randomUUID()

  // Store state and callback URL in cookies
  const cookieStore = await cookies()
  cookieStore.set('nextcloud_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  cookieStore.set('nextcloud_oauth_callback', callbackUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  // Build authorization URL
  const authUrl = new URL(`${baseUrl}/index.php/apps/oauth2/authorize`)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/nextcloud/callback`)
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('scope', 'openid profile email')

  // Redirect to Nextcloud
  return NextResponse.redirect(authUrl.toString())
}
