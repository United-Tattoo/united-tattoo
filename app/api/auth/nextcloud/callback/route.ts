import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { determineUserRole, getNextcloudUserProfile } from '@/lib/nextcloud-client'
import { getUserByEmail, createUser, createArtist } from '@/lib/db'
import { UserRole } from '@/types/database'

/**
 * Custom Nextcloud OAuth Callback Handler
 *
 * Handles the OAuth callback from Nextcloud, exchanges code for token,
 * fetches user info, auto-provisions users/artists, and creates a session.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
    )
  }

  // Validate state (CSRF protection)
  const cookieStore = await cookies()
  const storedState = cookieStore.get('nextcloud_oauth_state')?.value
  const callbackUrl = cookieStore.get('nextcloud_oauth_callback')?.value || '/admin'

  if (!storedState || storedState !== state) {
    console.error('State mismatch - possible CSRF attack')
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
    )
  }

  // Clear state cookies
  cookieStore.delete('nextcloud_oauth_state')
  cookieStore.delete('nextcloud_oauth_callback')

  const baseUrl = process.env.NEXTCLOUD_BASE_URL
  const clientId = process.env.NEXTCLOUD_OAUTH_CLIENT_ID
  const clientSecret = process.env.NEXTCLOUD_OAUTH_CLIENT_SECRET

  if (!baseUrl || !clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Nextcloud OAuth is not configured' },
      { status: 500 }
    )
  }

  try {
    // Step 1: Exchange authorization code for access token
    const tokenUrl = `${baseUrl}/index.php/apps/oauth2/api/v1/token`
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/nextcloud/callback`,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Step 2: Fetch user info from Nextcloud
    const userInfoUrl = `${baseUrl}/ocs/v2.php/cloud/user?format=json`
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'OCS-APIRequest': 'true',
      },
    })

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch user info')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
      )
    }

    const userInfoData = await userInfoResponse.json()
    const userData = userInfoData.ocs?.data

    if (!userData) {
      console.error('Invalid user info response')
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
      )
    }

    const userId = userData.id
    const email = userData.email
    const displayName = userData.displayname || userData['display-name'] || userId

    console.log(`Nextcloud user authenticated: ${email} (${userId})`)

    // Step 3: Determine role from Nextcloud groups
    const role = await determineUserRole(userId)

    // Prevent non-authorized users from signing in
    if (role === UserRole.CLIENT) {
      console.warn(`User ${email} is not in an authorized group`)
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
      )
    }

    // Step 4: Auto-provision user if needed
    let user = await getUserByEmail(email)

    if (!user) {
      console.log(`Creating new user for ${email} with role ${role}`)

      user = await createUser({
        email,
        name: displayName,
        role,
      })

      // If artist, create artist profile
      if (role === UserRole.ARTIST) {
        const artist = await createArtist({
          userId: user.id,
          name: displayName,
          bio: '',
          specialties: [],
          instagramHandle: null,
          hourlyRate: null,
          isActive: true,
        })

        console.log(`Created artist profile ${artist.id}`)
      }
    } else {
      console.log(`Existing user ${email} signed in`)
    }

    // Step 5: Create a one-time token for session completion
    // Store user ID in a short-lived cookie that credentials provider will validate
    const oneTimeToken = crypto.randomUUID()

    cookieStore.set('nextcloud_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 1 minute - just long enough to complete sign-in
      path: '/',
    })

    cookieStore.set('nextcloud_one_time_token', oneTimeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60,
      path: '/',
    })

    // Redirect to completion page that will auto-submit to NextAuth
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/nextcloud/complete?token=${oneTimeToken}&callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/signin?error=OAuthSignin`
    )
  }
}
