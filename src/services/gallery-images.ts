import fs from 'node:fs';
import path from 'node:path';

export type GallerySection = 'Portfolio' | 'Flash';

const SUPPORTED_GALLERY_IMAGE = /\.(avif|webp|jpe?g|png|gif)$/i;

export function scanGalleryImages(galleryDir: string, section: GallerySection): string[] {
  const galleryPath = path.join(process.cwd(), 'public', galleryDir, section);

  try {
    if (!fs.existsSync(galleryPath)) {
      return [];
    }

    return fs.readdirSync(galleryPath)
      .filter((file) => SUPPORTED_GALLERY_IMAGE.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/${galleryDir}/${section}/${file}`);
  } catch (error) {
    console.warn(`Could not read ${section.toLowerCase()} directory for ${galleryDir}:`, error);
    return [];
  }
}

export function getGalleryImages(
  galleryDir: string,
  section: GallerySection,
  cmsImages?: string[],
): string[] {
  const configuredImages = cmsImages?.filter(Boolean) ?? [];

  if (configuredImages.length > 0) {
    return configuredImages;
  }

  return scanGalleryImages(galleryDir, section);
}
