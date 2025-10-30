// Cloudflare Types
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    exec(query: string): Promise<D1ExecResult>;
    batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
    dump(): Promise<ArrayBuffer>;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first<T = any>(): Promise<T | null>;
    run(): Promise<D1Result>;
    all<T = any>(): Promise<D1Result<T>>;
  }

  interface D1Result<T = any> {
    results: T[];
    success: boolean;
    meta: {
      duration: number;
      size_after: number;
      rows_read: number;
      rows_written: number;
    };
  }

  interface D1ExecResult {
    count: number;
    duration: number;
  }

  interface R2Bucket {
    put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object | null>;
    get(key: string, options?: R2GetOptions): Promise<R2Object | null>;
    delete(keys: string | string[]): Promise<void>;
    list(options?: R2ListOptions): Promise<R2Objects>;
  }

  interface R2Object {
    key: string;
    version: string;
    size: number;
    etag: string;
    httpEtag: string;
    uploaded: Date;
    checksums: R2Checksums;
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
    body?: ReadableStream;
    bodyUsed?: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    json<T = any>(): Promise<T>;
    blob(): Promise<Blob>;
  }

  interface R2PutOptions {
    httpMetadata?: R2HTTPMetadata;
    customMetadata?: Record<string, string>;
  }

  interface R2GetOptions {
    onlyIf?: R2Conditional;
    range?: R2Range;
  }

  interface R2ListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
    delimiter?: string;
    startAfter?: string;
    include?: ('httpMetadata' | 'customMetadata')[];
  }

  interface R2Objects {
    objects: R2Object[];
    truncated: boolean;
    cursor?: string;
    delimitedPrefixes: string[];
  }

  interface R2HTTPMetadata {
    contentType?: string;
    contentLanguage?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    cacheControl?: string;
    cacheExpiry?: Date;
  }

  interface R2Checksums {
    md5?: ArrayBuffer;
    sha1?: ArrayBuffer;
    sha256?: ArrayBuffer;
    sha384?: ArrayBuffer;
    sha512?: ArrayBuffer;
  }

  interface R2Conditional {
    etagMatches?: string;
    etagDoesNotMatch?: string;
    uploadedBefore?: Date;
    uploadedAfter?: Date;
  }

  interface R2Range {
    offset?: number;
    length?: number;
    suffix?: number;
  }
}

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
  slug: string
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
  slug: string
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

export interface ArtistFilters {
  specialty?: string
  search?: string
  isActive?: boolean
  limit?: number
  offset?: number
}

export interface PortfolioImage {
  id: string
  artistId: string
  url: string
  caption?: string
  tags: string[]
  orderIndex: number
  isPublic: boolean
  createdAt: Date
}

export interface FlashItem {
  id: string
  artistId: string
  url: string
  title?: string
  description?: string
  price?: number // cents
  sizeHint?: string
  tags?: string[]
  orderIndex: number
  isAvailable: boolean
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

// API Input Types
export interface CreateArtistInput {
  name: string
  bio: string
  specialties: string[]
  instagramHandle?: string
  hourlyRate?: number
  isActive?: boolean
  userId?: string
  email?: string
}

export interface UpdateArtistInput extends Partial<CreateArtistInput> {
  id: string
}

export interface CreateAppointmentInput {
  artistId: string
  clientId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status?: AppointmentStatus
  depositAmount?: number
  totalAmount?: number
  notes?: string
}

export interface UpdateSiteSettingsInput extends Partial<Omit<SiteSettings, 'id' | 'updatedAt'>> {}

export interface AppointmentFilters {
  artistId?: string
  clientId?: string
  status?: AppointmentStatus
  startDate?: Date
  endDate?: Date
}

// CalDAV / Calendar Integration Types
export interface ArtistCalendar {
  id: string
  artistId: string
  calendarUrl: string
  calendarId: string
  syncToken?: string
  lastSyncAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CalendarSyncLog {
  id: string
  artistId?: string
  syncType: 'PUSH' | 'PULL' | 'FULL'
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL'
  errorMessage?: string
  eventsProcessed: number
  eventsCreated: number
  eventsUpdated: number
  eventsDeleted: number
  durationMs?: number
  createdAt: Date
}

export interface CalendarEvent {
  uid: string
  summary: string
  description?: string
  startTime: Date
  endTime: Date
  etag?: string
  url?: string
}

export interface AvailabilitySlot {
  start: Date
  end: Date
  available: boolean
  reason?: string
}
