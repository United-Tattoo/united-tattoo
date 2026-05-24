export const prerender = true;

import { getCollection } from 'astro:content';
import {
  EMAIL,
  INKROSTER,
  INSTAGRAM,
  NEWSINSIDERPOST_ARTICLE,
  PHONE_NUMBER,
  TATTOO_CONVENTIONS_ARTICLE,
  URL as SITE_URL,
  YELP,
  YOUTUBE,
} from '../consts';

export async function GET() {
  const artists = await getCollection('artists');
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

  const content = `# United Tattoo

> Custom tattoo studio in Fountain, Colorado. Home to ${artists.length} resident artists specializing in American Traditional, Fine Line, Watercolor, Black & Grey, Botanical, Geometric, and more. Located at 5160 Fontaine Blvd, Fountain, CO 80817. Open Sun–Sat 10am–8pm.

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
- Address: 5160 Fontaine Blvd, Fountain, CO 80817

## Around the Web

- [United Tattoo on InkRoster](${INKROSTER})
- [United Tattoo on Yelp](${YELP})
- [Why United Tattoo Studio in Fountain is Worth the Drive from Colorado Springs](${NEWSINSIDERPOST_ARTICLE})
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
