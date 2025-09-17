# Implementation Plan

## Overview
Transform the existing static Next.js tattoo studio website into a comprehensive management platform with admin dashboard, content management, and business operations capabilities.

The current application has a solid foundation with Next.js 14 App Router, TypeScript, shadcn/ui components, and proper project structure. We'll build upon this by adding authentication, database integration, file upload capabilities, administrative interfaces, calendar management, and booking systems while maintaining the existing design system and user experience for the public-facing website.

## Types
Database schema and TypeScript interfaces for the comprehensive management system.

```typescript
// User Management Types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SHOP_ADMIN = 'SHOP_ADMIN', 
  ARTIST = 'ARTIST',
  CLIENT = 'CLIENT'
}

// Artist Management Types
export interface Artist {
  id: string
  userId: string
  name: string
  bio: string
  specialties: string[]
  instagramHandle?: string
  portfolioImages: PortfolioImage[]
  isActive: boolean
  hourlyRate?: number
  availability: Availability[]
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioImage {
  id: string
  artistId: string
  url: string
  caption?: string
  tags: string[]
  order: number
  isPublic: boolean
  createdAt: Date
}

// Calendar & Booking Types
export interface Appointment {
  id: string
  artistId: string
  clientId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  depositAmount?: number
  totalAmount?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Availability {
  id: string
  artistId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isActive: boolean
}

// Content Management Types
export interface SiteSettings {
  id: string
  studioName: string
  description: string
  address: string
  phone: string
  email: string
  socialMedia: SocialMediaLinks
  businessHours: BusinessHours[]
  heroImage?: string
  logoUrl?: string
  updatedAt: Date
}

export interface SocialMediaLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
}

export interface BusinessHours {
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
}

// File Upload Types
export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  createdAt: Date
}
```

## Files
Comprehensive file structure for the management platform implementation.

New files to be created:
- `lib/auth.ts` - NextAuth.js configuration with role-based access
- `lib/db.ts` - Database connection and query utilities (Supabase/Neon)
- `lib/env.ts` - Environment variable validation with Zod
- `lib/upload.ts` - File upload utilities for Cloudflare R2/AWS S3
- `lib/validations.ts` - Zod schemas for form validation
- `middleware.ts` - Route protection and role-based access control
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `app/api/artists/route.ts` - Artist CRUD operations
- `app/api/artists/[id]/route.ts` - Individual artist operations
- `app/api/appointments/route.ts` - Appointment management
- `app/api/upload/route.ts` - File upload endpoint
- `app/api/settings/route.ts` - Site settings management
- `app/admin/layout.tsx` - Admin dashboard layout with sidebar
- `app/admin/page.tsx` - Admin dashboard overview
- `app/admin/artists/page.tsx` - Artist management interface
- `app/admin/artists/[id]/page.tsx` - Individual artist editing
- `app/admin/artists/new/page.tsx` - New artist creation
- `app/admin/calendar/page.tsx` - Calendar management interface
- `app/admin/settings/page.tsx` - Site settings management
- `app/admin/uploads/page.tsx` - File management interface
- `components/admin/sidebar.tsx` - Admin navigation sidebar
- `components/admin/artist-form.tsx` - Artist creation/editing form
- `components/admin/portfolio-manager.tsx` - Portfolio image management
- `components/admin/calendar-view.tsx` - Calendar component with booking management
- `components/admin/settings-form.tsx` - Site settings form
- `components/admin/file-uploader.tsx` - Drag-and-drop file upload component
- `components/admin/data-table.tsx` - Reusable data table component
- `components/auth/login-form.tsx` - Authentication form
- `components/auth/role-guard.tsx` - Role-based component protection
- `hooks/use-artists.ts` - Artist data management hooks
- `hooks/use-appointments.ts` - Appointment data management hooks
- `hooks/use-uploads.ts` - File upload management hooks
- `types/database.ts` - Database type definitions
- `types/api.ts` - API response type definitions

Existing files to be modified:
- `package.json` - Add new dependencies (NextAuth, Supabase, React Query, etc.)
- `next.config.mjs` - Add image domains and API configurations
- `app/layout.tsx` - Add authentication providers and global state
- `components/navigation.tsx` - Add admin dashboard link for authenticated users
- `data/artists.ts` - Convert to dynamic data fetching from database
- `components/artists-section.tsx` - Update to use dynamic artist data
- `components/artist-portfolio.tsx` - Update to use dynamic portfolio data
- `app/artists/[id]/page.tsx` - Update to fetch artist data from database

Files to be deleted or moved:
- None initially - maintain backward compatibility

Configuration file updates:
- `.env.example` - Add required environment variables
- `tailwind.config.ts` - Add admin dashboard color scheme
- `components.json` - Ensure all required shadcn/ui components are available

## Functions
Core functionality for the management platform.

New functions/components:
- `lib/auth.ts`
  - `export const authOptions: NextAuthOptions` - NextAuth configuration
  - `export function getServerSession()` - Server-side session retrieval
  - `export function requireAuth(role?: UserRole)` - Route protection utility
- `lib/db.ts`
  - `export async function getArtists()` - Fetch all artists
  - `export async function getArtist(id: string)` - Fetch single artist
  - `export async function createArtist(data: CreateArtistInput)` - Create new artist
  - `export async function updateArtist(id: string, data: UpdateArtistInput)` - Update artist
  - `export async function deleteArtist(id: string)` - Delete artist
  - `export async function getAppointments(filters?: AppointmentFilters)` - Fetch appointments
  - `export async function createAppointment(data: CreateAppointmentInput)` - Create appointment
  - `export async function getSiteSettings()` - Fetch site settings
  - `export async function updateSiteSettings(data: UpdateSiteSettingsInput)` - Update settings
- `lib/upload.ts`
  - `export async function uploadFile(file: File, path: string)` - Upload file to storage
  - `export async function deleteFile(url: string)` - Delete file from storage
  - `export function getSignedUrl(key: string)` - Generate signed URLs
- `components/admin/artist-form.tsx`
  - `export function ArtistForm({ artist, onSubmit }: ArtistFormProps)` - Artist creation/editing form
- `components/admin/portfolio-manager.tsx`
  - `export function PortfolioManager({ artistId, images }: PortfolioManagerProps)` - Portfolio management
- `components/admin/calendar-view.tsx`
  - `export function CalendarView({ appointments, onAppointmentClick }: CalendarViewProps)` - Calendar interface
- `components/admin/file-uploader.tsx`
  - `export function FileUploader({ onUpload, accept }: FileUploaderProps)` - File upload component

Modified functions/components:
- `data/artists.ts`
  - Convert static data to `export async function getArtistsData()` that fetches from database
- `components/artists-section.tsx`
  - Update to use React Query for data fetching
  - Add loading and error states
- `components/artist-portfolio.tsx`
  - Update to fetch dynamic portfolio data
  - Add image optimization and lazy loading
- `app/artists/[id]/page.tsx`
  - Add database integration for artist data
  - Implement proper error handling and 404 states

Removed functions/components:
- None initially - maintain backward compatibility

## Classes
No class-based components - using React function components throughout.

All components will be implemented as TypeScript function components with proper prop typing and error boundaries where appropriate.

## Dependencies
Required new packages for the comprehensive platform.

```json
{
  "dependencies": {
    "next-auth": "^4.24.5",
    "@auth/supabase-adapter": "^1.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-query-devtools": "^5.17.0",
    "zod": "^3.22.4",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "react-dropzone": "^14.2.3",
    "@aws-sdk/client-s3": "^3.490.0",
    "@aws-sdk/s3-request-presigner": "^3.490.0",
    "date-fns": "^3.0.6",
    "react-big-calendar": "^1.8.5",
    "recharts": "^2.8.0",
    "sonner": "^1.3.1"
  },
  "devDependencies": {
    "@types/react-big-calendar": "^1.8.0"
  }
}
```

Integration requirements:
- Supabase for database and real-time subscriptions
- NextAuth.js for authentication with multiple providers
- React Query for server state management
- Cloudflare R2 or AWS S3 for file storage
- Zod for runtime validation

## Testing
Comprehensive testing strategy for the management platform.

Test file requirements:
- `__tests__/lib/auth.test.ts` - Authentication utility tests
- `__tests__/lib/db.test.ts` - Database operation tests
- `__tests__/components/admin/artist-form.test.tsx` - Artist form component tests
- `__tests__/api/artists.test.ts` - Artist API endpoint tests
- `__tests__/pages/admin/artists.test.tsx` - Artist management page tests

Existing test modifications:
- Update existing component tests to handle dynamic data
- Add integration tests for database operations
- Add E2E tests for admin workflows

Validation strategies:
- Unit tests for all utility functions
- Component tests for admin interface components
- Integration tests for API endpoints
- E2E tests for critical user journeys (artist creation, appointment booking)
- Performance testing for file uploads and image optimization

## Implementation Order
Logical sequence to minimize conflicts and ensure successful integration.

1. **Environment & Database Setup**
   - Set up environment variables and validation (`lib/env.ts`)
   - Configure database connection (`lib/db.ts`)
   - Set up authentication (`lib/auth.ts`, `middleware.ts`)

2. **Core API Infrastructure**
   - Implement artist API endpoints (`app/api/artists/`)
   - Implement file upload API (`app/api/upload/route.ts`)
   - Implement settings API (`app/api/settings/route.ts`)

3. **Authentication System**
   - Create login/logout functionality (`components/auth/`)
   - Implement role-based access control
   - Add authentication to navigation

4. **Admin Dashboard Foundation**
   - Create admin layout and sidebar (`app/admin/layout.tsx`, `components/admin/sidebar.tsx`)
   - Implement admin dashboard overview (`app/admin/page.tsx`)
   - Add role-based route protection

5. **Artist Management System**
   - Create artist management interface (`app/admin/artists/`)
   - Implement artist form component (`components/admin/artist-form.tsx`)
   - Add portfolio management (`components/admin/portfolio-manager.tsx`)

6. **File Upload System**
   - Implement file upload utilities (`lib/upload.ts`)
   - Create file uploader component (`components/admin/file-uploader.tsx`)
   - Add file management interface (`app/admin/uploads/page.tsx`)

7. **Site Settings Management**
   - Create settings form (`components/admin/settings-form.tsx`)
   - Implement settings management page (`app/admin/settings/page.tsx`)
   - Update public site to use dynamic settings

8. **Dynamic Content Integration**
   - Update existing components to use database data
   - Implement React Query for data fetching
   - Add loading states and error handling

9. **Calendar & Appointment System** (Future Phase)
   - Implement calendar view (`components/admin/calendar-view.tsx`)
   - Add appointment management (`app/api/appointments/`)
   - Create booking interface for clients

10. **Testing & Optimization**
    - Add comprehensive test coverage
    - Implement performance optimizations
    - Add monitoring and analytics
