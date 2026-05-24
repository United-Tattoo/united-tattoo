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
import { SITE_HOURS } from '../services/site-hours';

export async function GET() {
  const artists = getPublicArtists(await getCollection('artists'));
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  const artistSections = artists
    .map((a) => {
      const specialties = a.data.specialties?.join(', ') || 'Custom Work';
      const status = a.data.acceptingBookings ? 'Currently accepting bookings.' : 'Not currently accepting new clients.';
      const instagram = a.data.instagram ? `\nInstagram: @${a.data.instagram}` : '';
      const portfolio = a.data.portfolioUrl ? `\nPortfolio: ${a.data.portfolioUrl}` : '';
      const body = (a.body ?? '').trim();

      return `## ${a.data.name}

URL: ${SITE_URL}/artists/${a.id}
Specialties: ${specialties}
${status}${instagram}${portfolio}

${body}`;
    })
    .join('\n\n---\n\n');

  const postSections = posts
    .map((post) => {
      const tags = post.data.tags.length > 0 ? post.data.tags.join(', ') : 'Studio';
      const body = (post.body ?? '').trim();

      return `## ${post.data.title}

URL: ${SITE_URL}/blog/${post.id}
Published: ${post.data.publishDate.toISOString().slice(0, 10)}
Tags: ${tags}
Description: ${post.data.description}

${body}`;
    })
    .join('\n\n---\n\n');

  const content = `# ${SITE_TITLE} — Full Content

URL: ${SITE_URL}
Address: ${LOCATION}
Phone: ${PHONE_NUMBER}
Email: ${EMAIL}
Instagram: ${INSTAGRAM}
YouTube: ${YOUTUBE}
Yelp: ${YELP}
InkRoster: ${INKROSTER}
Hours: ${SITE_HOURS.summary}

${SITE_TITLE} is a custom tattoo studio in Fountain, Colorado. ${SITE_DESCRIPTION}. We are home to ${artists.length} resident artists offering a wide range of tattoo styles including American Traditional, Fine Line, Watercolor, Black & Grey, Botanical, Geometric, Illustrative, and more. Every piece is custom-built for the client.

Around the web:
- ${SITE_TITLE} on InkRoster: ${INKROSTER}
- ${SITE_TITLE} on Yelp: ${YELP}
- Why ${SITE_TITLE} Studio in Fountain is Worth the Drive from Colorado Springs: ${NEWSINSIDERPOST_ARTICLE}
- Famous Tattoo Conventions Around the World: ${TATTOO_CONVENTIONS_ARTICLE}

---

# Artists

${artistSections}

---

# Journal

URL: ${SITE_URL}/blog

${postSections}

---

# Booking

URL: ${SITE_URL}/booking

To book a session at ${SITE_TITLE}, visit the booking page and select your preferred artist. Clients can request a specific time and provide reference images. All custom work begins with a consultation.

---

# Aftercare

URL: ${SITE_URL}/aftercare

Proper aftercare is essential to keeping your tattoo vibrant and healing correctly. ${SITE_TITLE} provides detailed aftercare instructions to all clients following their session.

---

# Studio

${SITE_TITLE} is located at ${LOCATION}, a short drive south of Colorado Springs. The studio is clean, comfortable, and staffed by experienced professional artists.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
