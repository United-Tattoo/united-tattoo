import { artists } from '@/data/artists'
import type { CreateArtistInput } from '@/types/database'

// Type for Cloudflare D1 database binding
interface Env {
  DB: D1Database;
}

// Get the database instance from the environment
function getDB(): D1Database {
  // @ts-ignore - This will be available in the Cloudflare Workers runtime
  return globalThis.DB || (globalThis as any).env?.DB;
}

/**
 * Migration utility to populate D1 database with existing artist data
 */
export class DataMigrator {
  private db: D1Database;

  constructor() {
    this.db = getDB();
  }

  /**
   * Migrate all artist data from data/artists.ts to D1 database
   */
  async migrateArtistData(): Promise<void> {
    console.log('Starting artist data migration...');
    
    try {
      // First, create users for each artist
      const userInserts = artists.map(artist => this.createUserForArtist(artist));
      await Promise.all(userInserts);
      
      // Then create artist records
      const artistInserts = artists.map(artist => this.createArtistRecord(artist));
      await Promise.all(artistInserts);
      
      // Finally, create portfolio images
      const portfolioInserts = artists.map(artist => this.createPortfolioImages(artist));
      await Promise.all(portfolioInserts);
      
      console.log(`Successfully migrated ${artists.length} artists to database`);
    } catch (error) {
      console.error('Error during artist data migration:', error);
      throw error;
    }
  }

  /**
   * Create a user record for an artist
   */
  private async createUserForArtist(artist: any): Promise<void> {
    const userId = `user-${artist.id}`;
    const email = artist.email || `${artist.name.toLowerCase().replace(/\s+/g, '.')}@unitedtattoo.com`;
    
    try {
      await this.db.prepare(`
        INSERT OR IGNORE INTO users (id, email, name, role, created_at, updated_at)
        VALUES (?, ?, ?, 'ARTIST', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(userId, email, artist.name).run();
      
      console.log(`Created user for artist: ${artist.name}`);
    } catch (error) {
      console.error(`Error creating user for artist ${artist.name}:`, error);
      throw error;
    }
  }

  /**
   * Create an artist record
   */
  private async createArtistRecord(artist: any): Promise<void> {
    const artistId = `artist-${artist.id}`;
    const userId = `user-${artist.id}`;
    
    // Convert styles array to specialties
    const specialties = artist.styles || [];
    
    // Extract hourly rate from experience or set default
    const hourlyRate = this.extractHourlyRate(artist.experience);
    
    // Generate slug from artist name or use existing slug
    const slug = artist.slug || this.generateSlug(artist.name);
    
    try {
      await this.db.prepare(`
        INSERT OR IGNORE INTO artists (
          id, user_id, slug, name, bio, specialties, instagram_handle, 
          hourly_rate, is_active, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        artistId,
        userId,
        slug,
        artist.name,
        artist.bio,
        JSON.stringify(specialties),
        artist.instagram ? this.extractInstagramHandle(artist.instagram) : null,
        hourlyRate,
      ).run();
      
      console.log(`Created artist record: ${artist.name} (slug: ${slug})`);
    } catch (error) {
      console.error(`Error creating artist record for ${artist.name}:`, error);
      throw error;
    }
  }

  /**
   * Create portfolio images for an artist
   */
  private async createPortfolioImages(artist: any): Promise<void> {
    const artistId = `artist-${artist.id}`;
    
    // Create portfolio images from workImages array
    if (artist.workImages && Array.isArray(artist.workImages)) {
      for (let i = 0; i < artist.workImages.length; i++) {
        const imageUrl = artist.workImages[i];
        const imageId = `portfolio-${artist.id}-${i + 1}`;
        
        try {
          await this.db.prepare(`
            INSERT OR IGNORE INTO portfolio_images (
              id, artist_id, url, caption, tags, order_index, 
              is_public, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
          `).bind(
            imageId,
            artistId,
            imageUrl,
            `${artist.name} - Portfolio Image ${i + 1}`,
            JSON.stringify(artist.styles || []),
            i
          ).run();
          
        } catch (error) {
          console.error(`Error creating portfolio image for ${artist.name}:`, error);
        }
      }
    }
    
    // Also add the face image as a portfolio image
    if (artist.faceImage) {
      const faceImageId = `portfolio-${artist.id}-face`;
      
      try {
        await this.db.prepare(`
          INSERT OR IGNORE INTO portfolio_images (
            id, artist_id, url, caption, tags, order_index, 
            is_public, created_at
          )
          VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
        `).bind(
          faceImageId,
          artistId,
          artist.faceImage,
          `${artist.name} - Profile Photo`,
          JSON.stringify(['profile']),
          -1 // Face image gets negative order to appear first
        ).run();
        
      } catch (error) {
        console.error(`Error creating face image for ${artist.name}:`, error);
      }
    }
    
    console.log(`Created portfolio images for: ${artist.name}`);
  }

  /**
   * Generate URL-friendly slug from artist name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/['']/g, '') // Remove apostrophes
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
  }

  /**
   * Extract Instagram handle from full URL
   */
  private extractInstagramHandle(instagramUrl: string): string | null {
    if (!instagramUrl) return null;
    
    // Extract handle from Instagram URL
    const match = instagramUrl.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  /**
   * Extract or estimate hourly rate based on experience
   */
  private extractHourlyRate(experience: string): number {
    // Default rates based on experience level
    const experienceRates: { [key: string]: number } = {
      'Apprentice': 80,
      '5 years': 120,
      '6 years': 130,
      '7 years': 140,
      '8 years': 150,
      '10 years': 170,
      '12+ years': 200,
      '22+ years': 250,
      '30+ years': 300,
    };

    // Try to find exact match first
    if (experienceRates[experience]) {
      return experienceRates[experience];
    }

    // Extract years from experience string and estimate rate
    const yearMatch = experience.match(/(\d+)/);
    if (yearMatch) {
      const years = parseInt(yearMatch[1]);
      if (years <= 2) return 80;
      if (years <= 5) return 120;
      if (years <= 10) return 150;
      if (years <= 15) return 180;
      if (years <= 20) return 220;
      return 250;
    }

    // Default rate for unknown experience
    return 120;
  }

  /**
   * Check if migration has already been completed
   */
  async isMigrationCompleted(): Promise<boolean> {
    try {
      const result = await this.db.prepare('SELECT COUNT(*) as count FROM artists').first();
      return (result as any)?.count > 0;
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  /**
   * Clear all migrated data (for testing purposes)
   */
  async clearMigratedData(): Promise<void> {
    console.log('Clearing migrated data...');
    
    try {
      // Delete in reverse order due to foreign key constraints
      await this.db.prepare('DELETE FROM portfolio_images').run();
      await this.db.prepare('DELETE FROM artists').run();
      await this.db.prepare('DELETE FROM users WHERE role = "ARTIST"').run();
      
      console.log('Successfully cleared migrated data');
    } catch (error) {
      console.error('Error clearing migrated data:', error);
      throw error;
    }
  }

  /**
   * Get migration statistics
   */
  async getMigrationStats(): Promise<{
    totalUsers: number;
    totalArtists: number;
    totalPortfolioImages: number;
  }> {
    try {
      const [usersResult, artistsResult, imagesResult] = await Promise.all([
        this.db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "ARTIST"').first(),
        this.db.prepare('SELECT COUNT(*) as count FROM artists').first(),
        this.db.prepare('SELECT COUNT(*) as count FROM portfolio_images').first(),
      ]);

      return {
        totalUsers: (usersResult as any)?.count || 0,
        totalArtists: (artistsResult as any)?.count || 0,
        totalPortfolioImages: (imagesResult as any)?.count || 0,
      };
    } catch (error) {
      console.error('Error getting migration stats:', error);
      return { totalUsers: 0, totalArtists: 0, totalPortfolioImages: 0 };
    }
  }
}

/**
 * Convenience function to run migration
 */
export async function migrateArtistData(): Promise<void> {
  const migrator = new DataMigrator();
  
  // Check if migration has already been completed
  const isCompleted = await migrator.isMigrationCompleted();
  if (isCompleted) {
    console.log('Migration already completed. Skipping...');
    return;
  }
  
  await migrator.migrateArtistData();
}

/**
 * Convenience function to get migration stats
 */
export async function getMigrationStats() {
  const migrator = new DataMigrator();
  return await migrator.getMigrationStats();
}

/**
 * Convenience function to clear migrated data (for development/testing)
 */
export async function clearMigratedData(): Promise<void> {
  const migrator = new DataMigrator();
  await migrator.clearMigratedData();
}
