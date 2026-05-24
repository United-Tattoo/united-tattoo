export const prerender = true;

import { getCollection } from 'astro:content';
import {
  EMAIL,
  INKROSTER,
  INSTAGRAM,
  LOCATION,
  NEWSINSIDERPOST_ARTICLE,
  PHONE_NUMBER,
  SITE_DESCRIPTION,
  SITE_TITLE,
  TATTOO_CONVENTIONS_ARTICLE,
  URL as SITE_URL,
  YELP,
  YOUTUBE,
} from '../consts';
import { getPublicArtists } from '../services/artists';

export async function GET() {
  const artists = getPublicArtists(await getCollection('artists'));
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  const artistLines = artists
    .map((a) => {
      const specialties = a.data.specialties?.join(', ') || 'Custom Work';
      const status = a.data.acceptingBookings ? 'accepting bookings' : 'not currently booking';
      return `- [${a.data.name}](${SITE_URL}/artists/${a.id}): ${specialties} — ${status}`;
    })
    .join('\n');

  const postLines = posts
    .map((post) => `- [${post.data.title}](${SITE_URL}/blog/${post.id}): ${post.data.description}`)
    .join('\n');

  const content = `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}. Home to ${artists.length} resident artists specializing in American Traditional, Fine Line, Watercolor, Black & Grey, Botanical, Geometric, and more. Located at ${LOCATION}. Open Sun–Sat 10am–8pm.

## Studio Pages

- [Home](${SITE_URL}/): Studio overview, featured artists, and booking
- [Artists](${SITE_URL}/artists): Browse all resident artists and their specialties
- [Journal](${SITE_URL}/blog): Studio notes, tattoo preparation guides, artist insight, and aftercare resources
- [Booking](${SITE_URL}/booking): Request a tattoo consultation or book a session
- [Aftercare](${SITE_URL}/aftercare): Tattoo aftercare instructions and healing guidance

## Artists

${artistLines}

## Journal

${postLines}

## Contact

- Email: ${EMAIL}
- Phone: ${PHONE_NUMBER}
- Instagram: ${INSTAGRAM}
- YouTube: ${YOUTUBE}
- Yelp: ${YELP}
- InkRoster: ${INKROSTER}
- Address: ${LOCATION}

## Around the Web

- [${SITE_TITLE} on InkRoster](${INKROSTER})
- [${SITE_TITLE} on Yelp](${YELP})
- [Why ${SITE_TITLE} Studio in Fountain is Worth the Drive from Colorado Springs](${NEWSINSIDERPOST_ARTICLE})
- [Famous Tattoo Conventions Around the World](${TATTOO_CONVENTIONS_ARTICLE})

## Optional

- [llms-full.txt](${SITE_URL}/llms-full.txt): Full artist bios and studio content
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
