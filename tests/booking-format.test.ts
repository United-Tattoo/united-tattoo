import { describe, expect, it } from 'vitest';

import { formatSelectedSlots } from '../src/services/booking-format';

describe('formatSelectedSlots', () => {
  it('turns selected calendar slots into readable Mountain Time choices for booking emails', () => {
    expect(
      formatSelectedSlots(
        JSON.stringify([
          { date: '2026-05-22', startTime: '00:30', endTime: '01:00', available: true },
          { date: '2026-05-23', startTime: '14:00', endTime: '14:30', available: true },
        ]),
      ),
    ).toBe('Choice #1: Fri, May 22 at 12:30 AM MT\nChoice #2: Sat, May 23 at 2:00 PM MT');
  });

  it('returns undefined when selected slot JSON is missing or malformed', () => {
    expect(formatSelectedSlots('')).toBeUndefined();
    expect(formatSelectedSlots('{not valid json')).toBeUndefined();
    expect(formatSelectedSlots('[]')).toBeUndefined();
  });

  it('rejects selected slot payloads that exceed booking limits or use invalid date/time values', () => {
    expect(
      formatSelectedSlots(
        JSON.stringify([
          { date: '2026-05-22', startTime: '00:30' },
          { date: '2026-05-23', startTime: '14:00' },
          { date: '2026-05-24', startTime: '15:00' },
          { date: '2026-05-25', startTime: '16:00' },
        ]),
      ),
    ).toBeUndefined();

    expect(formatSelectedSlots(JSON.stringify([{ date: 'tomorrow', startTime: 'soon' }]))).toBeUndefined();
    expect(formatSelectedSlots(JSON.stringify([{ date: '2026-05-22', startTime: '24:99' }]))).toBeUndefined();
  });
});
