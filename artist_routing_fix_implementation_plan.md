# Implementation Plan: Artist Routing & Admin Fixes

[Overview]
Fix artist portfolio routing to use slugs instead of numeric IDs, resolve admin page JSON parsing errors, ensure proper database population, and fix artist dashboard authentication issues.

The current system has a mismatch where the artists grid links to numeric IDs (`/artists/1`) but the API and components expect slug-based routing (`/artists/christy-lumberg`). Additionally, the admin page has JSON parsing errors due to data format inconsistencies, and the artist dashboard has authentication issues.

This implementation will:
1. Update database migration to use proper UUID-based IDs and ensure slug population
2. Fix the artists grid component to link using slugs instead of numeric IDs
3. Resolve admin page data format inconsistencies
4. Fix artist dashboard authentication flow
5. Add a migration endpoint to populate the database from static data
6. Update API routes to handle both ID and slug lookups consistently

[Types]
No new types required - existing types in `types/database.ts` are sufficient.

The following interfaces are already properly defined:
- `Artist`: Contains id (string UUID), slug, name, bio, specialties (array), etc.
- `PublicArtist`: Subset for public-facing pages
- `ArtistWithPortfolio`: Includes portfolio images
- `CreateArtistInput`: For creating new artists

Data format standardization needed:
- `specialties` field should always be stored as JSON string in DB
- `specialties` field should always be parsed to array when returned from API
- Admin page should receive pre-parsed arrays, not JSON strings

[Files]
Files requiring modification to fix routing and data consistency issues.

**Modified Files:**
1. `components/artists-grid.tsx`
   - Change Link href from `/artists/${artist.id}` to `/artists/${artist.slug}`
   - Ensure slug is available in the artist data

2. `lib/data-migration.ts`
   - Update to use crypto.randomUUID() for IDs instead of `artist-${id}` format
   - Ensure slugs are properly populated for all artists
   - Add error handling for duplicate slugs

3. `app/api/admin/migrate/route.ts`
   - Verify it properly triggers the migration
   - Add response with migration statistics
   - Include error handling

4. `app/admin/artists/page.tsx`
   - Remove JSON.parse() on specialties since API returns array
   - Update to handle specialties as array directly
   - Fix data mapping in the table columns

5. `lib/db.ts`
   - Verify getArtistBySlug() properly handles slug lookup
   - Ensure getPublicArtists() returns properly formatted data
   - Confirm specialties are parsed to arrays in all query results

6. `app/api/artists/route.ts`
   - Ensure GET endpoint returns specialties as parsed arrays
   - Verify data format consistency

7. `app/artist-dashboard/page.tsx`
   - Add proper loading and error states
   - Improve authentication error handling
   - Add redirect to sign-in if not authenticated

**Files to Review (no changes needed):**
- `app/artists/[id]/page.tsx` - Already accepts dynamic param correctly
- `components/artist-portfolio.tsx` - Already uses useArtist hook properly
- `hooks/use-artist-data.ts` - API calls are correct
- `middleware.ts` - Route protection is properly configured

[Functions]
Functions requiring modification or addition.

**Modified Functions:**

1. `lib/data-migration.ts::createArtistRecord()`
   - Current: Uses `artist-${artist.id}` for IDs
   - Change to: Use `crypto.randomUUID()` for proper UUID generation
   - Add validation to ensure slugs are unique

2. `lib/data-migration.ts::createUserForArtist()`
   - Current: Uses `user-${artist.id}` for IDs
   - Change to: Use `crypto.randomUUID()` for proper UUID generation

3. `lib/data-migration.ts::createPortfolioImages()`
   - Current: Uses `portfolio-${artist.id}-${index}` for IDs
   - Change to: Use `crypto.randomUUID()` for proper UUID generation

4. `lib/db.ts::getPublicArtists()`
   - Ensure specialties field is parsed from JSON string to array
   - Verify all artists have slugs populated

5. `lib/db.ts::getArtistWithPortfolio()`
   - Ensure specialties field is parsed from JSON string to array
   - Verify slug is included in response

6. `app/admin/artists/page.tsx::fetchArtists()`
   - Remove JSON.parse() call on specialties
   - Handle specialties as array directly

**New Functions:**
None required - existing functions just need corrections.

[Classes]
Classes requiring modification.

**Modified Classes:**

1. `lib/data-migration.ts::DataMigrator`
   - Update all ID generation methods to use crypto.randomUUID()
   - Add slug validation to prevent duplicates
   - Improve error handling and logging

[Dependencies]
No new dependencies required.

All necessary packages are already installed:
- `next` - Framework
- `@tanstack/react-query` - Data fetching
- `next-auth` - Authentication
- Cloudflare D1 bindings - Database access

[Testing]
Testing strategy to verify fixes.

**Test Files to Update:**

1. `__tests__/api/artists.test.ts`
   - Add tests for slug-based artist lookup
   - Verify specialties are returned as arrays
   - Test both ID and slug lookup scenarios

2. `__tests__/components/artists-grid.test.tsx`
   - Verify links use slugs instead of IDs
   - Test that artist cards render with proper hrefs

**Manual Testing Steps:**

1. Run migration to populate database
   - Visit `/api/admin/migrate` endpoint
   - Verify migration completes successfully
   - Check database has artists with proper UUIDs and slugs

2. Test artist portfolio routing
   - Visit https://united-tattoos.com/artists
   - Click on "Christy Lumberg" card
   - Verify URL is `/artists/christy-lumberg` not `/artists/1`
   - Confirm portfolio page loads correctly

3. Test admin artists page
   - Sign in as admin
   - Visit `/admin/artists`
   - Verify page loads without JSON.parse errors
   - Confirm specialties display as badges

4. Test artist dashboard
   - Create artist user account
   - Sign in as artist
   - Visit `/artist-dashboard`
   - Verify dashboard loads or redirects appropriately

[Implementation Order]
Step-by-step implementation sequence to minimize conflicts.

1. **Fix Database Migration Script** (`lib/data-migration.ts`)
   - Update ID generation to use crypto.randomUUID()
   - Ensure slugs are properly set
   - Add slug uniqueness validation
   - Improve error handling

2. **Verify Database Query Functions** (`lib/db.ts`)
   - Confirm all functions parse specialties to arrays
   - Verify slug is included in all artist queries
   - Test getArtistBySlug() function

3. **Fix Admin Page Data Handling** (`app/admin/artists/page.tsx`)
   - Remove JSON.parse() on specialties column
   - Handle specialties as array directly
   - Test admin page rendering

4. **Update Artists Grid Component** (`components/artists-grid.tsx`)
   - Change href from `/artists/${artist.id}` to `/artists/${artist.slug}`
   - Verify all artists have slug property
   - Test clicking on artist cards

5. **Run Database Migration**
   - Execute migration via `/api/admin/migrate`
   - Verify all artists created with proper data
   - Check slugs are populated correctly

6. **Test Artist Dashboard Authentication**
   - Create test artist user in database
   - Attempt to access dashboard
   - Verify authentication flow works correctly

7. **End-to-End Testing**
   - Test complete user flow: artists page → artist portfolio
   - Test admin flow: sign in → manage artists
   - Test artist flow: sign in → dashboard access

8. **Verify Production Deployment**
   - Deploy to Cloudflare Pages
   - Run migration on production database
   - Test all routes on live site
