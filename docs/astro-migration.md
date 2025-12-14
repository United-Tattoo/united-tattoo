# United Tattoo Website - Astro Migration Architecture

## Overview

Migration from Next.js to Astro for improved developer experience and performance, leveraging existing Nextcloud infrastructure as the primary CMS while maintaining real-time booking functionality.

## Core Technology Stack

### Framework

- **Astro** - Primary framework for static site generation
- **React Islands** - For dynamic components (booking system)
- **TypeScript** - Existing codebase reusable

### Hosting & Deployment

- **Cloudflare Workers** - Primary deployment target
- Requires hosted/external CMS solutions (no Node runtime)

### Content Management

- **Nextcloud** - Primary CMS and calendar system
  - Already deployed on VPS via Snap
  - Existing user base (artists, admin)
  - CalDAV calendar integration
  - File management via WebDAV API

### Image Optimization

- **Cloudinary** - CDN and automatic image processing
- Handles dynamic artist portfolio uploads
- Removes burden from VPS

## Architecture Components

### 1. Booking System

**Technology**: Full-page React Island in Astro

**Features**:

- Real-time calendar updates via CalDAV
- Bidirectional sync with Nextcloud calendar
- Artist availability display
- Appointment scheduling

**Implementation Notes**:

- Entire booking flow as single React Island preserves state management
- Existing TypeScript React code largely reusable
- Replace Next.js routing with Astro routing
- Convert Next.js API routes to Astro endpoints

### 2. Content Management via Nextcloud

**Structure**:

```
/Artists/
  /{artist-name}/
    /portfolio/          # Portfolio images
    /info.json          # Artist details, social links
    /bio.md            # Artist biography
/Shop/
  /flash-specials/     # Current flash offerings
  /events/            # Shop events
```

**Content Types**:

- **Artist Portfolios**: Image galleries
- **Artist Information**: Social details, bio, specialties
- **Flash Specials**: Current offerings
- **Shop Events**: Upcoming events and promotions

**Access**:

- Artists manage their own folders via familiar Nextcloud interface
- Admin manages shop-wide content
- No new system onboarding required

### 3. Image Workflow

**Upload Process**:

1. Artist uploads image to portfolio folder in Nextcloud
2. Nextcloud Flow detects new file in monitored directory
3. Flow triggers automatic upload to Cloudinary
4. Cloudinary performs optimization and transformations
5. Website serves images from Cloudinary CDN

**Benefits**:

- VPS not bottlenecked by image serving
- Automatic optimization (webp, responsive sizes, etc.)
- Fast CDN delivery
- Artists use familiar upload interface

**Implementation**:

- Configure Nextcloud Flow webhooks for portfolio directories
- FFmpeg installed on VPS for initial processing if needed
- Cloudinary API integration for automated uploads

### 4. Website Build Process

**Static Generation**:

- Astro fetches content from Nextcloud API at build time
- Generates static pages for artist profiles, portfolios, events
- Markdown content from Nextcloud parsed and rendered

**Dynamic Components**:

- Booking system as React Island
- Real-time calendar updates
- Form submissions

**API Integration**:

- Nextcloud WebDAV API for content fetching
- CalDAV for calendar operations
- Cloudinary URLs for image serving

## Migration Strategy

### Phase 1: Setup & Infrastructure

- [ ] Set up Astro project
- [ ] Configure Cloudflare Workers deployment
- [ ] Set up Cloudinary account and API integration
- [ ] Configure Nextcloud Flow automation

### Phase 2: Core Migration

- [ ] Port existing TypeScript React components
- [ ] Implement booking system as React Island
- [ ] Replace Next.js routing with Astro
- [ ] Convert API routes to Astro endpoints

### Phase 3: Content Integration

- [ ] Implement Nextcloud content fetching
- [ ] Create artist portfolio templates
- [ ] Build flash specials display
- [ ] Set up events section

### Phase 4: Image Pipeline

- [ ] Configure Nextcloud Flow triggers
- [ ] Implement Cloudinary upload automation
- [ ] Update frontend to serve from Cloudinary
- [ ] Test upload workflow with artists

### Phase 5: Testing & Deployment

- [ ] Test booking system thoroughly
- [ ] Verify calendar sync functionality
- [ ] Performance testing
- [ ] Train artists on new workflow
- [ ] Deploy to production

## Benefits of This Architecture

### Developer Experience

- Simpler framework (Astro vs Next.js)
- Cleaner routing and API structure
- Less build complexity
- Better performance by default

### User Experience

- Faster page loads (static generation)
- Optimized images via Cloudinary
- Real-time booking availability
- Seamless experience for artists

### Operational

- Single source of truth (Nextcloud)
- No additional CMS to maintain
- Automated image pipeline
- Familiar tools for all users

### Performance

- Static site generation for speed
- CDN-served images
- Minimal JavaScript shipped to client
- Cloudflare Workers edge deployment

## Technical Considerations

### Nextcloud API Access

- WebDAV for file operations
- CalDAV for calendar sync
- Proper authentication handling
- Rate limiting considerations

### Cloudflare Workers Limitations

- No Node.js runtime (ruled out Payload CMS)
- Edge computing constraints
- Must use hosted/external services

### State Management

- React Island handles internal state
- Calendar updates via API calls
- Form submissions to Astro endpoints

### Security

- Proper authentication for Nextcloud API
- Rate limiting on booking endpoint
- Input validation for all forms
- Secure Cloudinary upload signatures

## Future Enhancements

### Potential Additions

- Artist notification system for new bookings
- Client portal for appointment management
- Advanced portfolio filtering/search
- Social media integration
- Analytics dashboard

### Optimization Opportunities

- Progressive image loading
- Advanced caching strategies
- Predictive prefetching for bookings
- Real-time collaboration features

## Notes

- Keep Nextcloud Snap installation as-is (automatic updates)
- No need for hacky nginx workarounds
- Leverage existing user familiarity with Nextcloud
- Minimize number of systems to maintain
- Prioritize clean, maintainable architecture over quick fixes
