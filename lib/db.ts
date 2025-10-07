import type { 
  Artist, 
  PortfolioImage, 
  Appointment, 
  SiteSettings, 
  CreateArtistInput, 
  UpdateArtistInput, 
  CreateAppointmentInput, 
  UpdateSiteSettingsInput,
  AppointmentFilters 
} from '@/types/database'

// Type for Cloudflare D1 database binding
interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
}

// Get the database instance from the environment
// In Next.js API routes, bindings are passed through the context parameter
export function getDB(env?: any): D1Database {
  if (env?.DB) return env.DB;

  // OpenNext Cloudflare exposes bindings on a global symbol during dev/preview
  const cf = (globalThis as any)[Symbol.for("__cloudflare-context__")];
  const dbFromCf = cf?.env?.DB;

  // Additional dev fallbacks (when globals are shimmed)
  // @ts-ignore
  const dbFromGlobal = (globalThis as any).DB || (globalThis as any).env?.DB;

  const db = dbFromCf || dbFromGlobal;
  if (!db) {
    throw new Error("Cloudflare D1 binding (env.DB) is unavailable");
  }
  return db as D1Database;
}

/**
 * Artist Management Functions
 */

export async function getArtists(env?: any): Promise<Artist[]> {
  const db = getDB(env);
  const result = await db.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.is_active = 1
    ORDER BY a.created_at DESC
  `).all();
  
  // Parse JSON fields
  return (result.results as any[]).map(artist => ({
    ...artist,
    specialties: artist.specialties ? JSON.parse(artist.specialties) : [],
    portfolioImages: []
  }));
}

export async function getPublicArtists(filters?: import('@/types/database').ArtistFilters, env?: any): Promise<import('@/types/database').PublicArtist[]> {
  const db = getDB(env);
  
  let query = `
    SELECT 
      a.id,
      a.slug,
      a.name,
      a.bio,
      a.specialties,
      a.instagram_handle,
      a.is_active,
      a.hourly_rate,
      a.created_at
    FROM artists a
    WHERE a.is_active = 1
  `;
  
  const values: any[] = [];
  
  if (filters?.specialty) {
    query += ` AND a.specialties LIKE ?`;
    values.push(`%${filters.specialty}%`);
  }
  
  if (filters?.search) {
    query += ` AND (a.name LIKE ? OR a.bio LIKE ?)`;
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  query += ` ORDER BY a.created_at DESC`;
  
  if (filters?.limit) {
    query += ` LIMIT ?`;
    values.push(filters.limit);
  }
  
  if (filters?.offset) {
    query += ` OFFSET ?`;
    values.push(filters.offset);
  }
  
  const result = await db.prepare(query).bind(...values).all();
  
  // Fetch portfolio images for each artist
  const artistsWithPortfolio = await Promise.all(
    (result.results as any[]).map(async (artist) => {
      const portfolioResult = await db.prepare(`
        SELECT * FROM portfolio_images 
        WHERE artist_id = ? AND is_public = 1
        ORDER BY order_index ASC, created_at DESC
      `).bind(artist.id).all();
      
      return {
        id: artist.id,
        slug: artist.slug,
        name: artist.name,
        bio: artist.bio,
        specialties: artist.specialties ? JSON.parse(artist.specialties) : [],
        instagramHandle: artist.instagram_handle,
        isActive: Boolean(artist.is_active),
        hourlyRate: artist.hourly_rate,
        createdAt: artist.created_at ? new Date(artist.created_at) : undefined,
        portfolioImages: (portfolioResult.results as any[]).map(img => ({
          id: img.id,
          artistId: img.artist_id,
          url: img.url,
          caption: img.caption,
          tags: img.tags ? JSON.parse(img.tags) : [],
          orderIndex: img.order_index,
          isPublic: Boolean(img.is_public),
          createdAt: new Date(img.created_at)
        }))
      };
    })
  );
  
  return artistsWithPortfolio;
}

export async function getArtistWithPortfolio(id: string, env?: any): Promise<import('@/types/database').ArtistWithPortfolio | null> {
  const db = getDB(env);
  
  const artistResult = await db.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(id).first();
  
  if (!artistResult) return null;
  
  const portfolioResult = await db.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ?
    ORDER BY order_index ASC, created_at DESC
  `).bind(id).all();
  
  const artist = artistResult as any;
  
  return {
    id: artist.id,
    userId: artist.user_id,
    slug: artist.slug,
    name: artist.name,
    bio: artist.bio,
    specialties: artist.specialties ? JSON.parse(artist.specialties) : [],
    instagramHandle: artist.instagram_handle,
    isActive: Boolean(artist.is_active),
    hourlyRate: artist.hourly_rate,
    portfolioImages: (portfolioResult.results as any[]).map(img => ({
      id: img.id,
      artistId: img.artist_id,
      url: img.url,
      caption: img.caption,
      tags: img.tags ? JSON.parse(img.tags) : [],
      orderIndex: img.order_index,
      isPublic: Boolean(img.is_public),
      createdAt: new Date(img.created_at)
    })),
    availability: [],
    createdAt: new Date(artist.created_at),
    updatedAt: new Date(artist.updated_at),
    user: {
      name: artist.user_name,
      email: artist.user_email,
      avatar: artist.user_avatar
    }
  };
}

export async function getArtistBySlug(slug: string, env?: any): Promise<import('@/types/database').ArtistWithPortfolio | null> {
  const db = getDB(env);
  
  const artistResult = await db.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.slug = ?
  `).bind(slug).first();
  
  if (!artistResult) return null;
  
  const artist = artistResult as any;
  return getArtistWithPortfolio(artist.id, env);
}

export async function getArtistByUserId(userId: string, env?: any): Promise<Artist | null> {
  const db = getDB(env);
  const result = await db.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
  `).bind(userId).first();
  
  if (!result) return null;
  
  const artist = result as any;
  return {
    id: artist.id,
    userId: artist.user_id,
    slug: artist.slug,
    name: artist.name,
    bio: artist.bio,
    specialties: artist.specialties ? JSON.parse(artist.specialties) : [],
    instagramHandle: artist.instagram_handle,
    isActive: Boolean(artist.is_active),
    hourlyRate: artist.hourly_rate,
    portfolioImages: [],
    availability: [],
    createdAt: new Date(artist.created_at),
    updatedAt: new Date(artist.updated_at)
  };
}

export async function getArtist(id: string, env?: any): Promise<Artist | null> {
  const db = getDB(env);
  const result = await db.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(id).first();
  
  return result as Artist | null;
}

export async function createArtist(data: CreateArtistInput, env?: any): Promise<Artist> {
  const db = getDB(env);
  const id = crypto.randomUUID();

  // Helper to generate a URL-friendly slug
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // Ensure slug is unique in DB
  const ensureUniqueSlug = async (slugBase: string): Promise<string> => {
    let candidate = slugBase;
    let i = 1;
    while (true) {
      const existing = await db.prepare('SELECT slug FROM artists WHERE slug = ? LIMIT 1').bind(candidate).first();
      if (!existing) return candidate;
      candidate = `${slugBase}-${i++}`;
    }
  };

  const slugBase = data.name ? generateSlug(data.name) : generateSlug(crypto.randomUUID());
  const slug = await ensureUniqueSlug(slugBase);
  
  // First create or get the user
  let userId = data.userId;
  if (!userId) {
    const userResult = await db.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, 'ARTIST')
      RETURNING id
    `)
      .bind(
        crypto.randomUUID(),
        data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@unitedtattoo.com`,
        data.name
      )
      .first();

    userId = (userResult as { id: string } | null)?.id;
  }

  const inserted = await db.prepare(`
    INSERT INTO artists (id, user_id, slug, name, bio, specialties, instagram_handle, hourly_rate, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `)
    .bind(
      id,
      userId,
      slug,
      data.name,
      data.bio,
      JSON.stringify(data.specialties),
      data.instagramHandle || null,
      data.hourlyRate || null,
      data.isActive !== false
    )
    .first();

  // Parse JSON fields and normalize to match our Artist type
  const row = inserted as any;
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    specialties: row.specialties ? JSON.parse(row.specialties) : [],
    instagramHandle: row.instagram_handle ?? undefined,
    portfolioImages: [],
    isActive: Boolean(row.is_active),
    hourlyRate: row.hourly_rate ?? undefined,
    availability: [],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  } satisfies Artist;
}

export async function updateArtist(id: string, data: UpdateArtistInput, env?: any): Promise<Artist> {
  const db = getDB(env);
  
  const setParts: string[] = [];
  const values: any[] = [];
  
  if (data.name !== undefined) {
    setParts.push('name = ?');
    values.push(data.name);
  }
  if (data.bio !== undefined) {
    setParts.push('bio = ?');
    values.push(data.bio);
  }
  if (data.specialties !== undefined) {
    setParts.push('specialties = ?');
    values.push(JSON.stringify(data.specialties));
  }
  if (data.instagramHandle !== undefined) {
    setParts.push('instagram_handle = ?');
    values.push(data.instagramHandle);
  }
  if (data.hourlyRate !== undefined) {
    setParts.push('hourly_rate = ?');
    values.push(data.hourlyRate);
  }
  if (data.isActive !== undefined) {
    setParts.push('is_active = ?');
    values.push(data.isActive);
  }
  
  setParts.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  const result = await db.prepare(`
    UPDATE artists 
    SET ${setParts.join(', ')}
    WHERE id = ?
    RETURNING *
  `).bind(...values).first();
  
  return result as Artist;
}

export async function deleteArtist(id: string, env?: any): Promise<void> {
  const db = getDB(env);
  await db.prepare('UPDATE artists SET is_active = 0 WHERE id = ?').bind(id).run();
}

/**
 * Portfolio Image Management Functions
 */

export async function getPortfolioImages(artistId: string, env?: any): Promise<PortfolioImage[]> {
  const db = getDB(env);
  const result = await db.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ? AND is_public = 1
    ORDER BY order_index ASC, created_at DESC
  `).bind(artistId).all();
  
  return result.results as PortfolioImage[];
}

export async function addPortfolioImage(artistId: string, imageData: Omit<PortfolioImage, 'id' | 'artistId' | 'createdAt'>, env?: any): Promise<PortfolioImage> {
  const db = getDB(env);
  const id = crypto.randomUUID();
  
  const result = await db.prepare(`
    INSERT INTO portfolio_images (id, artist_id, url, caption, tags, order_index, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(
    id,
    artistId,
    imageData.url,
    imageData.caption || null,
    imageData.tags ? JSON.stringify(imageData.tags) : null,
    imageData.orderIndex || 0,
    imageData.isPublic !== false
  ).first();
  
  return result as PortfolioImage;
}

export async function updatePortfolioImage(id: string, data: Partial<PortfolioImage>, env?: any): Promise<PortfolioImage> {
  const db = getDB(env);
  
  const setParts: string[] = [];
  const values: any[] = [];
  
  if (data.url !== undefined) {
    setParts.push('url = ?');
    values.push(data.url);
  }
  if (data.caption !== undefined) {
    setParts.push('caption = ?');
    values.push(data.caption);
  }
  if (data.tags !== undefined) {
    setParts.push('tags = ?');
    values.push(data.tags ? JSON.stringify(data.tags) : null);
  }
  if (data.orderIndex !== undefined) {
    setParts.push('order_index = ?');
    values.push(data.orderIndex);
  }
  if (data.isPublic !== undefined) {
    setParts.push('is_public = ?');
    values.push(data.isPublic);
  }
  
  values.push(id);
  
  const result = await db.prepare(`
    UPDATE portfolio_images 
    SET ${setParts.join(', ')}
    WHERE id = ?
    RETURNING *
  `).bind(...values).first();
  
  return result as PortfolioImage;
}

export async function deletePortfolioImage(id: string, env?: any): Promise<void> {
  const db = getDB(env);
  await db.prepare('DELETE FROM portfolio_images WHERE id = ?').bind(id).run();
}

/**
 * Appointment Management Functions
 */

export async function getAppointments(filters?: AppointmentFilters, env?: any): Promise<Appointment[]> {
  const db = getDB(env);
  let query = `
    SELECT 
      a.*,
      ar.name as artist_name,
      u.name as client_name,
      u.email as client_email
    FROM appointments a
    LEFT JOIN artists ar ON a.artist_id = ar.id
    LEFT JOIN users u ON a.client_id = u.id
    WHERE 1=1
  `;
  
  const values: any[] = [];
  
  if (filters?.artistId) {
    query += ' AND a.artist_id = ?';
    values.push(filters.artistId);
  }
  
  if (filters?.status) {
    query += ' AND a.status = ?';
    values.push(filters.status);
  }
  
  if (filters?.startDate) {
    query += ' AND a.start_time >= ?';
    values.push(filters.startDate);
  }
  
  if (filters?.endDate) {
    query += ' AND a.start_time <= ?';
    values.push(filters.endDate);
  }
  
  query += ' ORDER BY a.start_time ASC';
  
  const result = await db.prepare(query).bind(...values).all();
  return result.results as Appointment[];
}

export async function createAppointment(data: CreateAppointmentInput, env?: any): Promise<Appointment> {
  const db = getDB(env);
  const id = crypto.randomUUID();
  
  const result = await db.prepare(`
    INSERT INTO appointments (
      id, artist_id, client_id, title, description, 
      start_time, end_time, status, deposit_amount, total_amount, notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(
    id,
    data.artistId,
    data.clientId,
    data.title,
    data.description || null,
    data.startTime,
    data.endTime,
    data.status || 'PENDING',
    data.depositAmount || null,
    data.totalAmount || null,
    data.notes || null
  ).first();
  
  return result as Appointment;
}

export async function updateAppointment(id: string, data: Partial<Appointment>, env?: any): Promise<Appointment> {
  const db = getDB(env);
  
  const setParts: string[] = [];
  const values: any[] = [];
  
  if (data.title !== undefined) {
    setParts.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    setParts.push('description = ?');
    values.push(data.description);
  }
  if (data.startTime !== undefined) {
    setParts.push('start_time = ?');
    values.push(data.startTime);
  }
  if (data.endTime !== undefined) {
    setParts.push('end_time = ?');
    values.push(data.endTime);
  }
  if (data.status !== undefined) {
    setParts.push('status = ?');
    values.push(data.status);
  }
  if (data.depositAmount !== undefined) {
    setParts.push('deposit_amount = ?');
    values.push(data.depositAmount);
  }
  if (data.totalAmount !== undefined) {
    setParts.push('total_amount = ?');
    values.push(data.totalAmount);
  }
  if (data.notes !== undefined) {
    setParts.push('notes = ?');
    values.push(data.notes);
  }
  
  setParts.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  
  const result = await db.prepare(`
    UPDATE appointments 
    SET ${setParts.join(', ')}
    WHERE id = ?
    RETURNING *
  `).bind(...values).first();
  
  return result as Appointment;
}

export async function deleteAppointment(id: string, env?: any): Promise<void> {
  const db = getDB(env);
  await db.prepare('DELETE FROM appointments WHERE id = ?').bind(id).run();
}

/**
 * Site Settings Management Functions
 */

export async function getSiteSettings(env?: any): Promise<SiteSettings | null> {
  const db = getDB(env);
  const result = await db.prepare('SELECT * FROM site_settings WHERE id = ?').bind('default').first();
  return result as SiteSettings | null;
}

export async function updateSiteSettings(data: UpdateSiteSettingsInput, env?: any): Promise<SiteSettings> {
  const db = getDB(env);
  
  const setParts: string[] = [];
  const values: any[] = [];
  
  if (data.studioName !== undefined) {
    setParts.push('studio_name = ?');
    values.push(data.studioName);
  }
  if (data.description !== undefined) {
    setParts.push('description = ?');
    values.push(data.description);
  }
  if (data.address !== undefined) {
    setParts.push('address = ?');
    values.push(data.address);
  }
  if (data.phone !== undefined) {
    setParts.push('phone = ?');
    values.push(data.phone);
  }
  if (data.email !== undefined) {
    setParts.push('email = ?');
    values.push(data.email);
  }
  if (data.socialMedia !== undefined) {
    setParts.push('social_media = ?');
    values.push(JSON.stringify(data.socialMedia));
  }
  if (data.businessHours !== undefined) {
    setParts.push('business_hours = ?');
    values.push(JSON.stringify(data.businessHours));
  }
  if (data.heroImage !== undefined) {
    setParts.push('hero_image = ?');
    values.push(data.heroImage);
  }
  if (data.logoUrl !== undefined) {
    setParts.push('logo_url = ?');
    values.push(data.logoUrl);
  }
  
  setParts.push('updated_at = CURRENT_TIMESTAMP');
  values.push('default');
  
  const result = await db.prepare(`
    UPDATE site_settings 
    SET ${setParts.join(', ')}
    WHERE id = ?
    RETURNING *
  `).bind(...values).first();
  
  return result as SiteSettings;
}

/**
 * Utility Functions
 */

// Type-safe query builder helpers
export const db = {
  artists: {
    findMany: getArtists,
    findUnique: getArtist,
    create: createArtist,
    update: updateArtist,
    delete: deleteArtist,
  },
  portfolioImages: {
    findMany: getPortfolioImages,
    create: addPortfolioImage,
    update: updatePortfolioImage,
    delete: deletePortfolioImage,
  },
  appointments: {
    findMany: getAppointments,
    create: createAppointment,
    update: updateAppointment,
    delete: deleteAppointment,
  },
  siteSettings: {
    findFirst: getSiteSettings,
    update: updateSiteSettings,
  },
}

// Helper function to get R2 bucket for file uploads
export function getR2Bucket(env?: any): R2Bucket {
  if (env?.R2_BUCKET) return env.R2_BUCKET;

  // OpenNext Cloudflare exposes bindings on a global symbol during dev/preview
  const cf = (globalThis as any)[Symbol.for("__cloudflare-context__")];
  const r2FromCf = cf?.env?.R2_BUCKET;

  // Additional dev fallbacks (when globals are shimmed)
  // @ts-ignore
  const r2FromGlobal = (globalThis as any).R2_BUCKET || (globalThis as any).env?.R2_BUCKET;

  const r2 = r2FromCf || r2FromGlobal;
  if (!r2) {
    throw new Error("Cloudflare R2 binding (env.R2_BUCKET) is unavailable");
  }
  return r2 as R2Bucket;
}
