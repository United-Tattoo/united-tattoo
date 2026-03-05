import { fetchCalendarEvents } from './caldav';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { addMinutes, format } from 'date-fns';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

interface Slot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
}

const CACHE_DIR = '.calendar-cache';
const CACHE_FILE = path.join(CACHE_DIR, 'availability.json');
const CACHE_TTL = 15 * 60 * 1000;
const TIMEZONE = 'America/Denver';

interface CacheEntry {
  data: Slot[];
  expires: number;
}

async function getCached(key: string): Promise<Slot[] | null> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const content = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache: Record<string, CacheEntry> = JSON.parse(content);
    const entry = cache[key];
    if (entry && entry.expires > Date.now()) {
      return entry.data;
    }
  } catch {
    // Cache miss or corruption
  }
  return null;
}

async function setCached(key: string, data: Slot[]): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    let cache: Record<string, CacheEntry> = {};
    try {
      const content = await fs.readFile(CACHE_FILE, 'utf-8');
      cache = JSON.parse(content);
    } catch {
      // New cache file
    }
    cache[key] = {
      data,
      expires: Date.now() + CACHE_TTL
    };
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {
    console.error('Cache write failed', e);
  }
}

export async function getArtistAvailability(artist: CollectionEntry<'artists'>): Promise<Slot[]> {
  if (!artist.data.calendarId || !artist.data.schedule) return [];

  const cacheKey = artist.data.calendarId;
  
  const cached = await getCached(cacheKey);

  if (cached) {
    return cached;
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  const busyEvents = await fetchCalendarEvents(artist.data.calendarId, startDate, endDate);
  const slots = calculateAvailableSlots(artist, busyEvents, startDate, endDate);

  await setCached(cacheKey, slots);

  return slots;
}

function calculateAvailableSlots(artist: CollectionEntry<'artists'>, busyEvents: any[], start: Date, end: Date): Slot[] {
  const slots: Slot[] = [];
  const bufferMinutes = artist.data.bufferMinutes || 30;
  const schedule = artist.data.schedule || {};

  // Iterate days
  let current = new Date(start);
  
  while (current <= end) {
    const zonedCurrent = toZonedTime(current, TIMEZONE);
    const dayName = format(zonedCurrent, 'EEEE').toLowerCase();
    const hours = artist.data.schedule?.[dayName];

    if (hours && hours !== 'closed') {
      const [startStr, endStr] = hours.split('-');
      
      const dateStr = format(zonedCurrent, 'yyyy-MM-dd');
      
      // Create start/end times in UTC corresponding to the artist's local time
      const workStart = fromZonedTime(`${dateStr} ${startStr}`, TIMEZONE);
      const workEnd = fromZonedTime(`${dateStr} ${endStr}`, TIMEZONE);
      
      // Generate 30 min slots
      let slotStart = workStart;
      while (addMinutes(slotStart, 30) <= workEnd) {
        const slotEnd = addMinutes(slotStart, 30);
        
        // Skip past slots
        if (slotStart < new Date()) {
            slotStart = slotEnd;
            continue;
        }

        // Check availability
        const isBusy = busyEvents.some(event => {
            // Overlap check
            const overlap = event.start < slotEnd && event.end > slotStart;
            
            // Buffer check: blocked if slot starts within bufferMinutes after an event ends
            const bufferBlocked = slotStart >= event.end && slotStart < addMinutes(event.end, bufferMinutes);
             
            return overlap || bufferBlocked;
        });

        if (!isBusy) {
           slots.push({
             date: dateStr,
             startTime: format(toZonedTime(slotStart, TIMEZONE), 'HH:mm'),
             endTime: format(toZonedTime(slotEnd, TIMEZONE), 'HH:mm'),
             available: true
           });
        }
        
        slotStart = slotEnd;
      }
    }
    
    // Next day
    current.setDate(current.getDate() + 1);
  }
  
  return slots;
}
