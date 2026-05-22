import { describe, expect, it } from 'vitest';

import { calculateAvailableSlots } from '../src/services/calendar-cache';

const baseArtist = {
  data: {
    bufferMinutes: 30,
    schedule: {
      monday: 'closed',
      tuesday: 'closed',
      wednesday: 'closed',
      thursday: 'closed',
      friday: 'closed',
      saturday: 'closed',
      sunday: 'closed',
    },
  },
};

describe('calculateAvailableSlots', () => {
  it('generates 30 minute slots from an artist schedule in Mountain Time', () => {
    const artist = {
      data: {
        ...baseArtist.data,
        schedule: {
          ...baseArtist.data.schedule,
          monday: '10:00-11:00',
        },
      },
    };

    const slots = calculateAvailableSlots(
      artist,
      [],
      new Date('2026-05-25T06:00:00.000Z'),
      new Date('2026-05-25T07:00:00.000Z'),
    );

    expect(slots).toEqual([
      { date: '2026-05-25', startTime: '10:00', endTime: '10:30', available: true },
      { date: '2026-05-25', startTime: '10:30', endTime: '11:00', available: true },
    ]);
  });

  it('removes slots that overlap a busy event or start inside the post-event buffer', () => {
    const artist = {
      data: {
        ...baseArtist.data,
        schedule: {
          ...baseArtist.data.schedule,
          monday: '10:00-12:00',
        },
      },
    };

    const slots = calculateAvailableSlots(
      artist,
      [
        {
          title: 'Existing appointment',
          start: new Date('2026-05-25T16:30:00.000Z'),
          end: new Date('2026-05-25T17:00:00.000Z'),
          status: 'busy',
        },
      ],
      new Date('2026-05-25T06:00:00.000Z'),
      new Date('2026-05-25T07:00:00.000Z'),
    );

    expect(slots).toEqual([
      { date: '2026-05-25', startTime: '10:00', endTime: '10:30', available: true },
      { date: '2026-05-25', startTime: '11:30', endTime: '12:00', available: true },
    ]);
  });
});
