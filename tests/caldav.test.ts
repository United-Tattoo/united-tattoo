import { beforeEach, describe, expect, it, vi } from 'vitest';

const fetchCalendars = vi.fn();
const fetchCalendarObjects = vi.fn();
const login = vi.fn();

vi.mock('tsdav', () => ({
  DAVClient: vi.fn(function DAVClient() {
    return {
      login,
      fetchCalendars,
      fetchCalendarObjects,
    };
  }),
}));

describe('fetchCalendarEvents', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    login.mockReset();
    fetchCalendars.mockReset();
    fetchCalendarObjects.mockReset();
  });

  it('returns an empty event list when CalDAV credentials are not configured', async () => {
    const { fetchCalendarEvents } = await import('../src/services/caldav');

    await expect(
      fetchCalendarEvents('christy-lumberg', new Date('2026-05-22T00:00:00.000Z'), new Date('2026-05-23T00:00:00.000Z')),
    ).resolves.toEqual([]);

    expect(login).not.toHaveBeenCalled();
  });

  it('matches calendars by display name and parses busy events from iCal data', async () => {
    vi.stubEnv('NEXTCLOUD_CALDAV_URL', 'https://cloud.example.test/remote.php/dav');
    vi.stubEnv('NEXTCLOUD_USERNAME', 'tester');
    vi.stubEnv('NEXTCLOUD_PASSWORD', 'secret');

    fetchCalendars.mockResolvedValue([
      { displayName: 'christy-lumberg', url: 'https://cloud.example.test/remote.php/dav/calendars/tester/christy-lumberg/' },
    ]);
    fetchCalendarObjects.mockResolvedValue([
      {
        data: [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'UID:test-event',
          'SUMMARY:Existing appointment',
          'DTSTART:20260522T160000Z',
          'DTEND:20260522T170000Z',
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\r\n'),
      },
    ]);

    const { fetchCalendarEvents } = await import('../src/services/caldav');

    const events = await fetchCalendarEvents(
      'christy-lumberg',
      new Date('2026-05-22T00:00:00.000Z'),
      new Date('2026-05-23T00:00:00.000Z'),
    );

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      title: 'Existing appointment',
      status: 'busy',
    });
    expect(events[0]?.start.toISOString()).toBe('2026-05-22T16:00:00.000Z');
    expect(events[0]?.end.toISOString()).toBe('2026-05-22T17:00:00.000Z');
    expect(fetchCalendarObjects).toHaveBeenCalledWith({
      calendar: {
        displayName: 'christy-lumberg',
        url: 'https://cloud.example.test/remote.php/dav/calendars/tester/christy-lumberg/',
      },
      timeRange: {
        start: '2026-05-22T00:00:00.000Z',
        end: '2026-05-23T00:00:00.000Z',
      },
    });
  });
});
