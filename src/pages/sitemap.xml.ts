export const prerender = true;

import { getCollection } from 'astro:content';
import { URL as SITE_URL } from '../consts';
import { getPublicArtists } from '../services/artists';

interface SitemapEntry {
  url: string;
  changefreq: string;
  priority: string;
}

export async function GET() {
  const artists = getPublicArtists(await getCollection('artists'));
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages: SitemapEntry[] = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/artists', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'weekly', priority: '0.7' },
    { url: '/booking', changefreq: 'monthly', priority: '0.8' },
    { url: '/aftercare', changefreq: 'monthly', priority: '0.6' },
  ];

  const artistPages: SitemapEntry[] = artists.map((artist) => ({
    url: `/artists/${artist.id}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const blogPages: SitemapEntry[] = posts.map((post) => ({
    url: `/blog/${post.id}`,
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const allPages = [...staticPages, ...artistPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
