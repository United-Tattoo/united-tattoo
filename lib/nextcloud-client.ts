/**
 * Nextcloud API Client
 *
 * Provides functions to interact with Nextcloud OCS (Open Collaboration Services) API
 * for user management and group membership checking during OAuth authentication.
 *
 * API Documentation: https://docs.nextcloud.com/server/latest/developer_manual/client_apis/OCS/index.html
 */

interface NextcloudUserProfile {
  id: string
  enabled: boolean
  email: string
  displayname: string
  groups: string[]
  quota?: {
    free: number
    used: number
    total: number
    relative: number
    quota: number
  }
}

interface NextcloudOCSResponse<T> {
  ocs: {
    meta: {
      status: string
      statuscode: number
      message: string
    }
    data: T
  }
}

/**
 * Get authenticated user's profile from Nextcloud
 * Uses OCS API with Basic Auth (service account credentials)
 *
 * @param userId Nextcloud user ID
 * @returns User profile including groups, email, and display name
 */
export async function getNextcloudUserProfile(
  userId: string
): Promise<NextcloudUserProfile | null> {
  const baseUrl = process.env.NEXTCLOUD_BASE_URL
  const username = process.env.NEXTCLOUD_USERNAME
  const password = process.env.NEXTCLOUD_PASSWORD

  if (!baseUrl || !username || !password) {
    console.error('Nextcloud credentials not configured for user API access')
    return null
  }

  try {
    const url = `${baseUrl}/ocs/v1.php/cloud/users/${encodeURIComponent(userId)}`
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch Nextcloud user profile: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json() as NextcloudOCSResponse<NextcloudUserProfile>

    if (data.ocs.meta.statuscode !== 100) {
      console.error(`Nextcloud API error: ${data.ocs.meta.message}`)
      return null
    }

    return data.ocs.data
  } catch (error) {
    console.error('Error fetching Nextcloud user profile:', error)
    return null
  }
}

/**
 * Get user's group memberships from Nextcloud
 *
 * @param userId Nextcloud user ID
 * @returns Array of group names the user belongs to
 */
export async function getNextcloudUserGroups(
  userId: string
): Promise<string[]> {
  const baseUrl = process.env.NEXTCLOUD_BASE_URL
  const username = process.env.NEXTCLOUD_USERNAME
  const password = process.env.NEXTCLOUD_PASSWORD

  if (!baseUrl || !username || !password) {
    console.error('Nextcloud credentials not configured for group API access')
    return []
  }

  try {
    const url = `${baseUrl}/ocs/v1.php/cloud/users/${encodeURIComponent(userId)}/groups`
    const auth = Buffer.from(`${username}:${password}`).toString('base64')

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'OCS-APIRequest': 'true',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch Nextcloud user groups: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json() as NextcloudOCSResponse<{ groups: string[] }>

    if (data.ocs.meta.statuscode !== 100) {
      console.error(`Nextcloud API error: ${data.ocs.meta.message}`)
      return []
    }

    return data.ocs.data.groups
  } catch (error) {
    console.error('Error fetching Nextcloud user groups:', error)
    return []
  }
}

/**
 * Check if a user belongs to a specific group in Nextcloud
 *
 * @param userId Nextcloud user ID
 * @param groupName Group name to check
 * @returns True if user is in the group, false otherwise
 */
export async function isUserInGroup(
  userId: string,
  groupName: string
): Promise<boolean> {
  const groups = await getNextcloudUserGroups(userId)
  return groups.includes(groupName)
}

/**
 * Determine the appropriate role for a user based on their Nextcloud group memberships
 *
 * @param userId Nextcloud user ID
 * @returns Role: 'SUPER_ADMIN', 'SHOP_ADMIN', 'ARTIST', or 'CLIENT'
 */
export async function determineUserRole(
  userId: string
): Promise<'SUPER_ADMIN' | 'SHOP_ADMIN' | 'ARTIST' | 'CLIENT'> {
  const groups = await getNextcloudUserGroups(userId)

  const adminsGroup = process.env.NEXTCLOUD_ADMINS_GROUP || 'shop_admins'
  const artistsGroup = process.env.NEXTCLOUD_ARTISTS_GROUP || 'artists'

  // Check for admin groups first (higher priority)
  if (groups.includes('admin') || groups.includes('admins')) {
    return 'SUPER_ADMIN'
  }

  if (groups.includes(adminsGroup)) {
    return 'SHOP_ADMIN'
  }

  // Check for artist group
  if (groups.includes(artistsGroup)) {
    return 'ARTIST'
  }

  // Default to client role
  return 'CLIENT'
}
