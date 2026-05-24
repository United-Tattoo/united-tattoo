import type { CollectionEntry } from 'astro:content';

export type ArtistEntry = CollectionEntry<'artists'>;

export function isPublicArtist(artist: ArtistEntry): boolean {
  return artist.data.archived !== true;
}

export function getPublicArtists(artists: ArtistEntry[]): ArtistEntry[] {
  return artists.filter(isPublicArtist);
}
