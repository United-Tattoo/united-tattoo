import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublicArtists } from '../../services/artists';
import { getArtistAvailability } from '../../services/calendar-cache';

export const GET: APIRoute = async ({ url }) => {
  const artistSlug = url.searchParams.get('artist');
  if (!artistSlug) {
    return new Response(JSON.stringify({ error: 'Artist required' }), { status: 400 });
  }

  const artists = getPublicArtists(await getCollection('artists'));
  const artist = artists.find(a => a.id === artistSlug);

  if (!artist) {
    return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
  }

  try {
    const slots = await getArtistAvailability(artist as CollectionEntry<'artists'>);
    let alternatives: Array<{
      id: string;
      name: string;
      portrait: string;
      slotCount: number;
      styles: string[] | undefined;
    }> = [];

    if (slots.length < 5) {
        // Find alternatives
        const allArtists = getPublicArtists(await getCollection('artists'));
        const primaryStyles = artist.data.specialties || [];
        
        const candidates = allArtists.filter(a => 
            a.id !== artist.id && 
            a.data.acceptingBookings && 
            a.data.calendarId &&
            (a.data.specialties || []).some(s => primaryStyles.includes(s))
        );

        const candidatesWithSlots = await Promise.all(candidates.map(async (c) => {
            try {
                const cSlots = await getArtistAvailability(c as CollectionEntry<'artists'>);
                return { artist: c, slotCount: cSlots.length };
            } catch {
                return { artist: c, slotCount: 0 };
            }
        }));

        alternatives = candidatesWithSlots
            .filter(c => c.slotCount >= 5)
            .sort((a, b) => b.slotCount - a.slotCount)
            .slice(0, 3)
            .map(c => ({
                id: c.artist.id,
                name: c.artist.data.name,
                portrait: c.artist.data.portrait,
                slotCount: c.slotCount,
                styles: c.artist.data.specialties
            }));
    }

    return new Response(JSON.stringify({ slots, alternatives }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to fetch availability' }), { status: 500 });
  }
}
