# Artist Profile Refactor Implementation Plan

## Overview
Refactor the artists grid and individual artist profile pages to load content from a Cloudflare D1 database instead of static data. Enable artists to log into backend profiles where they can manage their portfolio images, bio, and other information. The existing `data/artists.ts` will serve as seed data for the database.

This implementation connects the existing database schema, API routes, and authentication system with the public-facing components, while also creating an artist dashboard for self-service portfolio management.

## Types
Database and API type definitions for artist profile management.

**Key Type Updates:**
- Ensure `Artist` interface in `types/database.ts` matches D1 schema columns
- Add `ArtistWithPortfolio` type that includes populated `portfolioImages` array
- Create `PublicArtist` type for sanitized public API responses
- Add `ArtistDashboardStats` type for artist-specific analytics

**New Type Definitions:**
```typescript
// types/database.ts additions
export interface ArtistWithPortfolio extends Artist {
  portfolioImages: PortfolioImage[]
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export interface PublicArtist {
  id: string
  name: string
  bio: string
  specialties: string[]
  instagramHandle?: string
  portfolioImages: PortfolioImage[]
  isActive: boolean
  hourlyRate?: number
}

export interface ArtistDashboardStats {
  totalImages: number
  activeImages: number
  profileViews?: number
  lastUpdated: Date
}
```

## Files

### Files to Modify

**1. `lib/db.ts`**
- Add `getArtistWithPortfolio(id: string)` function that joins artists with portfolio_images
- Add `getPublicArtists()` function that returns only active artists with public portfolio images
- Add `getArtistByUserId(userId: string)` function for artist dashboard access
- Update `getArtists()` to parse JSON fields properly (specialties)

**2. `app/api/artists/route.ts`**
- Update GET handler to return artists with portfolio images
- Add pagination support to prevent loading all artists at once
- Add filtering by specialty and search query
- Ensure responses match `PublicArtist` type for public endpoints

**3. `app/api/artists/[id]/route.ts`**
- Create this file (currently missing)
- Add GET endpoint to fetch single artist with portfolio
- Add PUT endpoint for updating artist (admin or artist themselves)
- Add authorization check (admin or owner)

**4. `components/artists-grid.tsx`**
- Remove hardcoded `artists` array
- Add `useEffect` to fetch artists from `/api/artists`
- Add loading and error states
- Update to use API response data structure
- Keep existing filtering UI but apply to fetched data
- Update routing to use database IDs instead of hardcoded IDs

**5. `components/artist-portfolio.tsx`**
- Remove hardcoded `artistsData` object
- Add `useEffect` to fetch artist data from `/api/artists/${artistId}`
- Add loading and error states
- Update image galleries to use portfolio images from database
- Handle missing artist gracefully
- Update data structure to match API response

**6. `components/artists-page-section.tsx`**
- Remove import from `@/data/artists`
- Fetch artists from API in component
- Add loading state

**7. `components/artists-section.tsx`**
- Remove import from `@/data/artists`
- Fetch artists from API
- Add loading skeleton

**8. `components/booking-form.tsx`**
- Update artist selection to fetch from API
- Remove import from `@/data/artists`

**9. `app/artists/[id]/page.tsx`**
- Update to use database-friendly slug or ID
- May need to support both slug-based and ID-based routing during migration

**10. `lib/auth.ts`**
- Add `getArtistSession()` helper that checks if logged-in user is an artist
- Add `requireArtistAuth()` helper for artist-only routes

**11. `sql/schema.sql`**
- Add missing columns if needed (review against `data/artists.ts` structure)
- Add indexes for performance (slug, user_id lookups)
- Consider adding `slug` column to artists table for SEO-friendly URLs

**12. `lib/data-migration.ts`**
- Update migration to use all artists from `data/artists.ts`
- Fix portfolio image creation to handle all work images
- Add proper slug generation from artist names
- Ensure idempotency (can be run multiple times safely)

### Files to Create

**1. `app/artist-dashboard/page.tsx`**
- New artist dashboard home page
- Show artist's own profile overview
- Display stats (total images, views, etc.)
- Quick links to edit profile and portfolio

**2. `app/artist-dashboard/layout.tsx`**
- Layout wrapper for artist dashboard
- Navigation sidebar for dashboard sections
- Artist profile header
- Requires ARTIST or SHOP_ADMIN role

**3. `app/artist-dashboard/profile/page.tsx`**
- Artist profile edit page
- Reuse `<ArtistForm>` component but filtered for artist-editable fields
- Artists can edit: bio, specialties, instagram, hourly rate
- Cannot edit: name, email, isActive (admin only)

**4. `app/artist-dashboard/portfolio/page.tsx`**
- Portfolio image management page
- Upload new images
- Edit captions and tags
- Reorder images (drag and drop)
- Delete images
- Set visibility (public/private)

**5. `app/api/artists/me/route.ts`**
- GET endpoint to fetch current logged-in artist's data
- Requires authentication
- Returns artist profile for logged-in user

**6. `app/api/portfolio/route.ts`** (if not exists)
- POST endpoint to add portfolio images
- Requires artist or admin auth
- Handles R2 upload integration

**7. `app/api/portfolio/[id]/route.ts`**
- GET single portfolio image
- PUT to update (caption, tags, order, visibility)
- DELETE to remove image
- Authorization: admin or image owner

**8. `components/admin/portfolio-manager.tsx`**
- Reusable component for managing portfolio images
- Used in both admin and artist dashboard
- Image upload, grid display, edit modals
- Drag-drop reordering

**9. `hooks/use-artist-data.ts`**
- Custom hook for fetching artist data
- Handles loading, error states
- Caching with SWR or React Query pattern
- Reusable across components

**10. `middleware.ts` (update)**
- Add route protection for `/artist-dashboard/*`
- Verify user has ARTIST role
- Redirect to signin if not authenticated

### Files to Delete (after migration)

**None immediately** - Keep `data/artists.ts` as seed data reference

## Functions

### New Functions in `lib/db.ts`

**1. `getArtistWithPortfolio(id: string, env?: any): Promise<ArtistWithPortfolio | null>`**
- Fetch artist by ID
- Join with portfolio_images table
- Parse JSON fields (specialties, tags)
- Return combined object with images array

**2. `getPublicArtists(filters?: ArtistFilters, env?: any): Promise<PublicArtist[]>`**
- Fetch only active artists
- Include only public portfolio images
- Apply filters (specialty, search)
- Sanitize data for public consumption

**3. `getArtistByUserId(userId: string, env?: any): Promise<Artist | null>`**
- Fetch artist record by user_id
- Used for artist dashboard access
- Returns full artist data for owner

**4. `getArtistBySlug(slug: string, env?: any): Promise<ArtistWithPortfolio | null>`**
- Fetch artist by URL slug
- Join with portfolio images
- For SEO-friendly URLs

**5. `updatePortfolioImageOrder(artistId: string, imageOrders: Array<{id: string, orderIndex: number}>, env?: any): Promise<void>`**
- Batch update order indices
- Used for drag-drop reordering
- Transaction support if available

### New Functions in `lib/auth.ts`

**1. `getArtistSession(): Promise<{ artist: Artist, user: User } | null>`**
- Get current session
- Check if user has ARTIST role
- Fetch associated artist record
- Return combined data or null

**2. `requireArtistAuth(): Promise<{ artist: Artist, user: User }>`**
- Like requireAuth but specifically for artists
- Throws error if not an artist
- Returns artist and user data

**3. `canEditArtist(userId: string, artistId: string): Promise<boolean>`**
- Check if user can edit specific artist
- True if: user is the artist, SHOP_ADMIN, or SUPER_ADMIN
- Used for authorization checks

### Modified Functions

**1. `lib/db.ts:getArtists()`**
- Add optional `includePortfolio` parameter
- Parse JSON fields properly
- Add error handling

**2. `lib/db.ts:createArtist()`**
- Add slug generation
- Ensure user creation if needed
- Return artist with portfolio array (empty initially)

**3. `lib/data-migration.ts:migrateArtistData()`**
- Update to migrate all fields from `data/artists.ts`
- Add slug generation
- Handle all portfolio images
- Add progress logging

## Classes

### New Classes

**1. `ArtistDashboardManager` (optional)**
- Class to encapsulate artist dashboard operations
- Methods: getStats(), updateProfile(), getPortfolio()
- Centralizes artist-specific business logic
- Located in `lib/artist-dashboard.ts`

**No other new classes required** - Functional approach with helper functions is sufficient

## Dependencies

### Current Dependencies (verify versions)
- `next`: 15.x
- `next-auth`: Latest compatible with Next.js 15
- `@tanstack/react-table`: For admin tables
- `react-hook-form`: Form management
- `zod`: Schema validation
- `@hookform/resolvers`: Zod integration with react-hook-form

### New Dependencies to Install

**1. `swr` or `@tanstack/react-query`**
- For client-side data fetching and caching
- Recommended: `swr` (lighter weight)
- Install: `npm install swr`

**2. `@dnd-kit/core`, `@dnd-kit/sortable` (optional)**
- For drag-drop portfolio reordering
- Only if implementing drag-drop UI
- Install: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**3. `sharp` (dev dependency)**
- Image optimization during migration
- May already be included with Next.js

### Configuration Updates

**1. `next.config.mjs`**
- Ensure image optimization configured for R2 URLs
- Add remote patterns for portfolio image domains

**2. `wrangler.toml`**
- Verify D1 database binding name matches code
- Verify R2 bucket binding for portfolio uploads

**3. `.env.local`**
- No new env vars needed (using Cloudflare bindings)

## Testing

### Unit Tests to Create

**1. `__tests__/lib/db.test.ts`**
- Test artist CRUD operations
- Test portfolio image operations
- Mock D1 database
- Verify JSON parsing

**2. `__tests__/lib/auth.test.ts`**
- Test artist authentication helpers
- Test authorization checks
- Mock NextAuth session

**3. `__tests__/hooks/use-artist-data.test.ts`**
- Test hook with mock data
- Test loading and error states
- Test cache behavior

### Integration Tests to Create

**1. `__tests__/api/artists.test.ts`**
- Test GET /api/artists endpoint
- Test filtering and pagination
- Test error handling

**2. `__tests__/api/artists/[id].test.ts`**
- Test GET single artist
- Test PUT artist update
- Test authorization

**3. `__tests__/api/portfolio.test.ts`**
- Test portfolio CRUD operations
- Test file uploads
- Test authorization

### Component Tests to Update

**1. `__tests__/components/artists-grid.test.tsx`**
- Update to mock API fetch
- Test loading states
- Test error states
- Test filtering

**2. `__tests__/components/artist-portfolio.test.tsx`**
- Update to mock API fetch
- Test portfolio image display
- Test modal interactions

### E2E Test Scenarios

**1. Artist Login and Profile Edit**
- Artist signs in
- Navigates to dashboard
- Edits bio and specialties
- Saves successfully

**2. Portfolio Image Upload**
- Artist uploads images
- Images appear in portfolio
- Reorders images
- Deletes an image

**3. Public Artist Profile View**
- Anonymous user visits artist page
- Sees artist info and portfolio
- Images load correctly
- Filtering works

**4. Admin Artist Management**
- Admin creates new artist
- Edits artist information
- Uploads portfolio images for artist
- Deactivates artist

## Implementation Order

### Phase 1: Database & API Foundation (Steps 1-5)

**1. Update Database Schema and Migration**
- Review and update `sql/schema.sql` if needed (add slug column, indexes)
- Update `lib/data-migration.ts` to properly migrate all artist data from `data/artists.ts`
- Test migration script locally
- Verify all artists and portfolio images are created correctly

**2. Enhance Database Functions**
- Update `lib/db.ts` with new functions: `getArtistWithPortfolio`, `getPublicArtists`, `getArtistByUserId`, `getArtistBySlug`
- Update existing functions to properly parse JSON fields
- Add error handling and logging
- Write unit tests for new functions

**3. Create/Update API Endpoints**
- Create `app/api/artists/[id]/route.ts` with GET and PUT handlers
- Update `app/api/artists/route.ts` to support filtering and return portfolio images
- Create `app/api/artists/me/route.ts` for artist self-access
- Add authorization checks to all endpoints
- Test endpoints with Postman or similar

**4. Update Authentication Helpers**
- Add `getArtistSession()` and `requireArtistAuth()` to `lib/auth.ts`
- Add `canEditArtist()` authorization helper
- Test with mock sessions

**5. Create Data Fetching Hook**
- Create `hooks/use-artist-data.ts` with SWR
- Implement loading and error states
- Add caching and revalidation
- Test hook in isolation

### Phase 2: Public-Facing Components (Steps 6-8)

**6. Refactor Artists Grid**
- Update `components/artists-grid.tsx` to fetch from API
- Remove hardcoded data
- Add loading skeleton UI
- Add error handling UI
- Test filtering and pagination
- Verify routing to individual artists works

**7. Refactor Artist Portfolio Page**
- Update `components/artist-portfolio.tsx` to fetch from API
- Remove hardcoded `artistsData`
- Add loading states
- Update image galleries to use database images
- Test with various artist IDs
- Verify modal/lightbox still works

**8. Update Supporting Components**
- Update `components/artists-section.tsx` to use API
- Update `components/artists-page-section.tsx` to use API
- Update `components/booking-form.tsx` artist selection
- Add loading states to all
- Test home page and booking flow

### Phase 3: Artist Dashboard (Steps 9-12)

**9. Create Artist Dashboard Layout**
- Create `app/artist-dashboard/layout.tsx` with navigation
- Add role protection in middleware
- Create dashboard home page `app/artist-dashboard/page.tsx`
- Display artist stats and quick links
- Test authentication and routing

**10. Build Profile Editor**
- Create `app/artist-dashboard/profile/page.tsx`
- Reuse and adapt `<ArtistForm>` component
- Filter fields for artist-editable only
- Connect to PUT `/api/artists/me` endpoint
- Test profile updates

**11. Build Portfolio Manager**
- Create `app/artist-dashboard/portfolio/page.tsx`
- Create `components/admin/portfolio-manager.tsx` component
- Implement image upload UI
- Add image editing (captions, tags, visibility)
- Test upload and management

**12. Implement Portfolio API**
- Create `app/api/portfolio/route.ts` for creating images
- Create `app/api/portfolio/[id]/route.ts` for update/delete
- Integrate with R2 upload system
- Add authorization checks
- Test full upload flow

### Phase 4: Admin Enhancements (Steps 13-14)

**13. Update Admin Artist Management**
- Update `app/admin/artists/[id]/page.tsx` to use API
- Enhance `<ArtistForm>` with portfolio management
- Test admin CRUD operations
- Verify authorization works

**14. Add Portfolio Management to Admin**
- Integrate `<PortfolioManager>` into admin artist edit page
- Allow admins to manage any artist's portfolio
- Test admin portfolio operations

### Phase 5: Testing & Refinement (Steps 15-17)

**15. Write and Run Tests**
- Create all unit tests for new functions
- Create integration tests for API endpoints
- Create component tests
- Run full test suite
- Fix any failing tests

**16. Performance Optimization**
- Add database indexes for common queries
- Implement image lazy loading
- Add proper caching headers to API
- Optimize large portfolio image displays
- Test with large datasets

**17. Migration & Deployment**
- Run migration on development D1 database
- Test full application flow
- Create migration checklist for production
- Deploy to staging environment
- Final testing in staging
- Production deployment

### Phase 6: Documentation & Cleanup (Step 18)

**18. Documentation and Cleanup**
- Document new API endpoints
- Update README with setup instructions
- Add inline code comments
- Create artist onboarding guide
- Remove deprecated code/comments
- Archive old implementation if needed
