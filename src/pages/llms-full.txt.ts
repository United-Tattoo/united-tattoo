export const prerender = true;

import { getCollection } from 'astro:content';

const SITE_URL = 'https://united-tattoos.com';

export async function GET() {
  const artists = await getCollection('artists');
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

  const content = `# United Tattoo — Full Content

URL: ${SITE_URL}
Address: 5160 Fontaine Blvd, Fountain, CO 80817
Phone: +1 719 698 9004
Email: ink@unitedtattoos.com
Instagram: https://www.instagram.com/unitedtattoosco/
Hours: Sunday–Saturday, 10am–8pm

United Tattoo is a custom tattoo studio in Fountain, Colorado. We are home to ${artists.length} resident artists offering a wide range of tattoo styles including American Traditional, Fine Line, Watercolor, Black & Grey, Botanical, Geometric, Illustrative, and more. Every piece is custom-built for the client.

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

To book a session at United Tattoo, visit the booking page and select your preferred artist. Clients can request a specific time and provide reference images. All custom work begins with a consultation.

---

# Aftercare

URL: ${SITE_URL}/aftercare

Proper aftercare is essential to keeping your tattoo vibrant and healing correctly. United Tattoo provides detailed aftercare instructions to all clients following their session.

---

# Studio

United Tattoo is located in Fountain, Colorado — a short drive south of Colorado Springs. The studio is clean, comfortable, and staffed by experienced professional artists.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
