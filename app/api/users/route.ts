import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDB } from '@/lib/db'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'SHOP_ADMIN', 'ARTIST', 'CLIENT']),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const db = getDB()

    if (email) {
      // Find user by email
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
      const user = await stmt.bind(email).first()
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({ user })
    } else {
      // Get all users
      const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC')
      const result = await stmt.all()
      return NextResponse.json({ users: result.results })
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const db = getDB()

    // Check if user already exists
    const existingStmt = db.prepare('SELECT id FROM users WHERE email = ?')
    const existing = await existingStmt.bind(validatedData.email).first()

    if (existing) {
      return NextResponse.json({ user: existing })
    }

    // Create new user
    const userId = crypto.randomUUID()
    const insertStmt = db.prepare(`
      INSERT INTO users (id, email, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    await insertStmt.bind(
      userId,
      validatedData.email,
      validatedData.name,
      validatedData.role
    ).run()

    // Fetch the created user
    const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?')
    const user = await selectStmt.bind(userId).first()

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
