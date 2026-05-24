import siteHours from '../data/site-hours.json';

interface SiteHour {
  day: string;
  shortDay: string;
  opens: string;
  closes: string;
  display: string;
}

interface SiteHoursConfig {
  summary: string;
  footerSummary: string;
  hours: SiteHour[];
}

export const SITE_HOURS = siteHours as SiteHoursConfig;

export const OPENING_HOURS_SPECIFICATION = SITE_HOURS.hours.map((entry) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: entry.day,
  opens: entry.opens,
  closes: entry.closes,
}));
