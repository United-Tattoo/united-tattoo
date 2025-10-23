import { z } from "zod"

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  // OAuth Providers (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  
  // File Storage (AWS S3 or Cloudflare R2)
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_ENDPOINT_URL: z.string().url().optional(), // For Cloudflare R2
  
  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Optional: Email service
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Optional: Analytics
  VERCEL_ANALYTICS_ID: z.string().optional(),
  
  // CalDAV / Nextcloud Integration
  NEXTCLOUD_BASE_URL: z.string().url().optional(),
  NEXTCLOUD_USERNAME: z.string().optional(),
  NEXTCLOUD_PASSWORD: z.string().optional(),
  NEXTCLOUD_CALENDAR_BASE_PATH: z.string().default('/remote.php/dav/calendars'),

  // Nextcloud OAuth Authentication
  NEXTCLOUD_OAUTH_CLIENT_ID: z.string().optional(),
  NEXTCLOUD_OAUTH_CLIENT_SECRET: z.string().optional(),
  NEXTCLOUD_ARTISTS_GROUP: z.string().default('artists'),
  NEXTCLOUD_ADMINS_GROUP: z.string().default('shop_admins'),
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables at boot
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ')
      throw new Error(`Missing or invalid environment variables: ${missingVars}`)
    }
    throw error
  }
}

export const env = validateEnv()
