# Implementation Plan

## Overview
Implement a comprehensive admin dashboard with full CRUD operations for artist management, Cloudflare R2 file upload system, appointment scheduling interface, and database population from existing artist data.

This implementation extends the existing United Tattoo Studio platform by building out the admin interface components, integrating Cloudflare R2 for portfolio image uploads, creating a full appointment management system with calendar views, and migrating the current mock artist data into the Cloudflare D1 database. The admin dashboard will provide complete management capabilities for studio operations while maintaining the existing public-facing website functionality.

## Types
Define comprehensive type system for admin dashboard components and enhanced database operations.

```typescript
// Admin Dashboard Types
interface AdminDashboardStats {
  totalArtists: number
  activeArtists: number
  totalAppointments: number
  pendingAppointments: number
  totalUploads: number
  recentUploads: number
}

interface FileUploadProgress {
  id: string
  filename: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  url?: string
  error?: string
}

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  artistId: string
  clientId: string
  status: AppointmentStatus
  description?: string
}

// Enhanced Artist Types
interface ArtistFormData {
  name: string
  bio: string
  specialties: string[]
  instagramHandle?: string
  hourlyRate?: number
  isActive: boolean
  email?: string
  portfolioImages?: File[]
}

interface PortfolioImageUpload {
  file: File
  caption?: string
  tags: string[]
  orderIndex: number
}

// File Upload Types
interface R2UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

interface BulkUploadResult {
  successful: FileUpload[]
  failed: { filename: string; error: string }[]
  total: number
}
```

## Files
Create new admin dashboard pages and components while enhancing existing database and upload functionality.

**New Files to Create:**
- `app/admin/artists/page.tsx` - Artist management list view
- `app/admin/artists/new/page.tsx` - Create new artist form
- `app/admin/artists/[id]/page.tsx` - Edit artist details
- `app/admin/artists/[id]/portfolio/page.tsx` - Manage artist portfolio
- `app/admin/calendar/page.tsx` - Appointment calendar interface
- `app/admin/uploads/page.tsx` - File upload management
- `app/admin/settings/page.tsx` - Studio settings management
- `components/admin/artist-form.tsx` - Artist creation/editing form
- `components/admin/portfolio-manager.tsx` - Portfolio image management
- `components/admin/file-uploader.tsx` - Cloudflare R2 file upload component
- `components/admin/appointment-calendar.tsx` - Calendar component for appointments
- `components/admin/stats-dashboard.tsx` - Dashboard statistics display
- `components/admin/data-table.tsx` - Reusable data table component
- `lib/r2-upload.ts` - Cloudflare R2 upload utilities
- `lib/data-migration.ts` - Artist data migration utilities
- `hooks/use-file-upload.ts` - File upload hook with progress tracking
- `hooks/use-calendar.ts` - Calendar state management hook

**Files to Modify:**
- `app/api/artists/route.ts` - Enhance with real database operations
- `app/api/artists/[id]/route.ts` - Add portfolio image management
- `app/api/upload/route.ts` - Implement Cloudflare R2 integration
- `app/api/settings/route.ts` - Add site settings CRUD operations
- `app/api/appointments/route.ts` - Create appointment management API
- `lib/db.ts` - Update database functions to work with runtime environment
- `lib/validations.ts` - Add admin form validation schemas
- `components/admin/sidebar.tsx` - Update navigation for new pages

## Functions
Implement comprehensive CRUD operations and file management functionality.

**New Functions:**
- `uploadToR2(file: File, key: string): Promise<R2UploadResponse>` in `lib/r2-upload.ts`
- `bulkUploadToR2(files: File[]): Promise<BulkUploadResult>` in `lib/r2-upload.ts`
- `migrateArtistData(): Promise<void>` in `lib/data-migration.ts`
- `getArtistStats(): Promise<AdminDashboardStats>` in `lib/db.ts`
- `createAppointment(data: CreateAppointmentInput): Promise<Appointment>` in `lib/db.ts`
- `getAppointmentsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]>` in `lib/db.ts`
- `useFileUpload(): FileUploadHook` in `hooks/use-file-upload.ts`
- `useCalendar(): CalendarHook` in `hooks/use-calendar.ts`

**Modified Functions:**
- Update `getArtists()` in `lib/db.ts` to use actual D1 database
- Enhance `createArtist()` to handle portfolio image uploads
- Modify `updateArtist()` to support portfolio management
- Update API route handlers to use enhanced database functions

## Classes
Create reusable component classes and utility classes for admin functionality.

**New Classes:**
- `FileUploadManager` class in `lib/r2-upload.ts` for managing multiple file uploads
- `CalendarManager` class in `lib/calendar.ts` for appointment scheduling logic
- `DataMigrator` class in `lib/data-migration.ts` for database migration operations

**Component Classes:**
- `ArtistForm` component class with form validation and submission
- `PortfolioManager` component class for drag-and-drop image management
- `FileUploader` component class with progress tracking and error handling
- `AppointmentCalendar` component class with scheduling capabilities

## Dependencies
Add required packages for enhanced admin functionality.

**New Dependencies:**
- `@aws-sdk/client-s3` (already installed) - For Cloudflare R2 operations
- `react-big-calendar` (already installed) - For appointment calendar
- `react-dropzone` (already installed) - For file upload interface
- `@tanstack/react-query` (already installed) - For data fetching and caching

**Configuration Updates:**
- Update `wrangler.toml` with R2 bucket configuration
- Add environment variables for R2 access keys
- Configure Next.js for file upload handling

## Testing
Implement comprehensive testing for admin dashboard functionality.

**Test Files to Create:**
- `__tests__/admin/artist-form.test.tsx` - Artist form component tests
- `__tests__/admin/file-upload.test.tsx` - File upload functionality tests
- `__tests__/api/artists.test.ts` - Artist API endpoint tests
- `__tests__/lib/r2-upload.test.ts` - R2 upload utility tests
- `__tests__/lib/data-migration.test.ts` - Data migration tests

**Testing Strategy:**
- Unit tests for all new utility functions
- Component tests for admin dashboard components
- Integration tests for API endpoints with database operations
- E2E tests for complete admin workflows (create artist, upload portfolio, schedule appointment)

## Implementation Order
Sequential implementation steps to ensure proper integration and minimal conflicts.

1. **Database Migration and Population**
   - Implement data migration utilities in `lib/data-migration.ts`
   - Create migration script to populate D1 database with existing artist data
   - Update database functions in `lib/db.ts` to work with runtime environment
   - Test database operations with migrated data

2. **Cloudflare R2 File Upload System**
   - Implement R2 upload utilities in `lib/r2-upload.ts`
   - Create file upload hook in `hooks/use-file-upload.ts`
   - Update upload API route in `app/api/upload/route.ts`
   - Create file uploader component in `components/admin/file-uploader.tsx`

3. **Artist Management Interface**
   - Create artist form component in `components/admin/artist-form.tsx`
   - Implement artist management pages (`app/admin/artists/`)
   - Create portfolio manager component in `components/admin/portfolio-manager.tsx`
   - Update artist API routes with enhanced functionality

4. **Appointment Calendar System**
   - Create calendar hook in `hooks/use-calendar.ts`
   - Implement appointment calendar component in `components/admin/appointment-calendar.tsx`
   - Create appointment API routes in `app/api/appointments/`
   - Build calendar page in `app/admin/calendar/page.tsx`

5. **Admin Dashboard Enhancement**
   - Create stats dashboard component in `components/admin/stats-dashboard.tsx`
   - Implement settings management in `app/admin/settings/page.tsx`
   - Create data table component in `components/admin/data-table.tsx`
   - Update main dashboard page with real data integration

6. **Testing and Validation**
   - Implement unit tests for all new functionality
   - Create integration tests for API endpoints
   - Add E2E tests for admin workflows
   - Validate all CRUD operations and file uploads

7. **Final Integration and Optimization**
   - Update sidebar navigation for all new pages
   - Implement error handling and loading states
   - Add proper TypeScript types throughout
   - Optimize performance and add caching where appropriate
