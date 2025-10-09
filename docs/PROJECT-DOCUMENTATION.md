---
last-redoc-date: 2025-10-07
---

# United Tattoo - Complete Project Documentation

## Project Overview

**United Tattoo** is a modern, professional website built for United Tattoo studio in Fountain, CO. This Next.js application showcases the studio's artists, services, and booking capabilities with a cinematic, high-contrast design that reflects the artistry and community spirit of the tattoo studio.

### Key Information
- **Project Name**: United Tattoo Official Website
- **Version**: 0.1.0
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: ShadCN UI
- **Deployment**: Cloudflare Pages via OpenNext
- **Database**: Cloudflare D1 (SQLite)

## Technology Stack

### Core Technologies
- **Next.js 14.2.16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **ShadCN UI**: Modern React component library
- **React 18**: UI library
- **Cloudflare Pages**: Hosting platform
- **Cloudflare D1**: SQLite database

### Key Dependencies
- **Authentication**: NextAuth.js with Supabase adapter
- **File Storage**: AWS S3 SDK for R2 uploads
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Smooth Scrolling**: @studio-freight/lenis
- **Data Fetching**: @tanstack/react-query
- **Testing**: Vitest with Testing Library

## Project Structure

```
united-tattoo/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── aftercare/               # Aftercare instructions
│   ├── artists/                 # Artist listings and profiles
│   ├── book/                    # Booking flow
│   ├── contact/                 # Contact information
│   ├── deposit/                 # Deposit policy and payments
│   ├── gift-cards/              # Gift card information
│   ├── privacy/                 # Privacy policy
│   ├── specials/                # Promotions and specials
│   └── terms/                   # Terms of service
├── components/                   # React components
│   ├── ui/                      # ShadCN UI primitives
│   ├── hero-section.tsx         # Homepage hero
│   ├── artists-section.tsx      # Artists showcase
│   ├── services-section.tsx     # Services display
│   ├── contact-section.tsx      # Contact information
│   └── booking-form.tsx         # Multi-step booking form
├── data/                        # Static data and configuration
│   └── artists.ts               # Artist metadata
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication configuration
│   ├── db.ts                    # Database connection
│   ├── upload.ts                # File upload utilities
│   └── validations.ts           # Form validation schemas
├── public/                      # Static assets
│   ├── artists/                 # Artist images and work samples
│   └── united-logo-*.png/jpg    # Brand assets
├── sql/                         # Database schema and migrations
├── __tests__/                   # Test files
├── docs/                        # Documentation
└── bmad/                        # BMAD framework configuration
```

## Core Features

### 1. Homepage
- **Hero Section**: Cinematic split imagery with parallax effects
- **Artists Section**: Grid display of studio artists
- **Services Section**: Overview of tattoo services
- **Contact Section**: Quick contact information and CTA

### 2. Artist Management
- **Artist Listings**: Grid view of all artists with metadata
- **Artist Profiles**: Detailed pages for each artist
- **Work Samples**: Portfolio images for each artist
- **Specialties**: Artist-specific expertise and styles

### 3. Booking System
- **Multi-step Form**: Progressive booking flow
- **Form Validation**: Client and server-side validation
- **Service Selection**: Choose tattoo type and artist
- **Contact Information**: Collect customer details

### 4. Content Pages
- **Aftercare Instructions**: General and transparent bandage care
- **Deposit Policy**: Payment options and compliance information
- **Terms of Service**: Legal terms and conditions
- **Privacy Policy**: Data handling and privacy practices
- **Gift Cards**: Gift card information and balance checking
- **Specials**: Current promotions and VIP offerings

### 5. Administrative Features
- **Artist Dashboard**: Management interface for artists
- **Admin Panel**: Site administration capabilities
- **Search Functionality**: Search artists and services
- **Contact Management**: Handle contact form submissions

## Design System

### Visual Design
- **Color Scheme**: Monochrome foundation with high contrast
- **Typography**: Geist font family for modern, clean typography
- **Layout**: Split-screen designs with cinematic imagery
- **Animations**: Subtle parallax effects and smooth transitions

### Component Library
- **ShadCN UI**: Consistent component library throughout
- **Radix UI**: Accessible primitive components
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility-first styling approach

### Responsive Design
- **Mobile-First**: Progressive enhancement for larger screens
- **Touch-Friendly**: Optimized for mobile interactions
- **Performance**: Optimized images and lazy loading

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Testing Strategy
- **Unit Tests**: Vitest with Testing Library
- **Integration Tests**: Component and API testing
- **E2E Tests**: End-to-end user flow testing
- **Coverage**: Code coverage reporting

### Continuous Integration
- **Linting**: ESLint configuration
- **Type Checking**: TypeScript compilation
- **Testing**: Automated test execution
- **Build**: Production build verification
- **Bundle Analysis**: Size budget enforcement

## Database Architecture

### Schema Design
- **Artists Table**: Artist information and metadata
- **Bookings Table**: Appointment and booking data
- **Services Table**: Tattoo services and pricing
- **Users Table**: User authentication and profiles
- **Contacts Table**: Contact form submissions

### Migrations
- **Version Control**: SQL migration files in `sql/migrations/`
- **Environment Management**: Separate preview and production migrations
- **Rollback Support**: Down migration scripts available

## Deployment Architecture

### Hosting
- **Platform**: Cloudflare Pages
- **Build Process**: OpenNext for Next.js optimization
- **Static Assets**: Optimized for CDN delivery
- **Edge Computing**: Global distribution

### Database
- **Platform**: Cloudflare D1
- **Type**: SQLite-compatible serverless database
- **Backups**: Automated backup system
- **Local Development**: Local D1 instance for development

### Performance Optimization
- **Bundle Size**: Enforced size budgets (3MB total, 1.5MB assets)
- **Image Optimization**: Static image serving
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Aggressive caching strategies

## Security Considerations

### Authentication
- **NextAuth.js**: Secure authentication framework
- **Supabase Adapter**: User management integration
- **Session Management**: Secure session handling
- **OAuth Integration**: Social login support

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content security policies
- **File Upload Security**: Type and size validation

## API Integration

### External Services
- **Cloudflare R2**: File storage and CDN
- **Stripe**: Payment processing
- **Afterpay**: Alternative payment method
- **Email Service**: Contact form notifications

### Internal APIs
- **Artist API**: Artist data management
- **Booking API**: Appointment scheduling
- **Search API**: Content search functionality
- **Upload API**: File upload handling

## Monitoring and Analytics

### Performance Monitoring
- **Bundle Analysis**: Automated size reporting
- **Core Web Vitals**: Performance metrics
- **Error Tracking**: Application error monitoring
- **Uptime Monitoring**: Service availability

### Business Analytics
- **User Engagement**: Page views and interactions
- **Conversion Tracking**: Booking completion rates
- **Popular Content**: Most viewed artists and services
- **Contact Analytics**: Contact form submissions

## Maintenance and Updates

### Regular Maintenance
- **Dependency Updates**: Automated security updates
- **Content Updates**: Artist information and portfolios
- **Performance Monitoring**: Regular performance audits
- **Security Audits**: Security vulnerability scanning

### Update Process
1. **Development**: Feature development in feature branches
2. **Testing**: Comprehensive testing in staging environment
3. **Deployment**: Automated deployment to production
4. **Monitoring**: Post-deployment monitoring and rollback capability

## Future Enhancements

### Planned Features
- **Online Booking**: Full appointment scheduling system
- **Payment Integration**: Online deposit and payment processing
- **Artist Portfolios**: Enhanced portfolio management
- **Customer Reviews**: Customer testimonial system
- **SMS Notifications**: Appointment reminders via SMS

### Technical Improvements
- **Progressive Web App**: PWA capabilities for mobile
- **Offline Support**: Service worker implementation
- **Advanced Search**: Enhanced search with filtering
- **Accessibility**: WCAG compliance improvements
- **Performance**: Further optimization and caching

## Contributing Guidelines

### Development Standards
- **Code Style**: ESLint and Prettier configuration
- **Type Safety**: Strict TypeScript configuration
- **Testing**: Test coverage requirements
- **Documentation**: Comprehensive code documentation

### Git Workflow
- **Branch Strategy**: Feature branch workflow
- **Commit Messages**: Conventional commit format
- **Pull Requests**: Code review requirements
- **Deployment**: Automated deployment from main branch

## Support and Contact

### Technical Support
- **Documentation**: Comprehensive project documentation
- **Issue Tracking**: GitHub issues for bug reports
- **Community**: Developer community support
- **Emergency**: Direct contact for critical issues

### Business Contact
- **Studio**: United Tattoo, Fountain, CO
- **Website**: Live deployment URL
- **Phone**: Studio contact number
- **Email**: Business email address

---

*This documentation was generated on 2025-10-07 and reflects the current state of the United Tattoo project. For the most up-to-date information, please refer to the source code and project repository.*
