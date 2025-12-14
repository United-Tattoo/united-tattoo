export const prerender = false;

import type { APIContext } from "astro";
import { debugListEntries, getArtistsDir, getWebdavUserBase, listArtistSlugs } from "../../../lib/nextcloud-cms";

export async function GET(context: APIContext): Promise<Response> {
  const env = (context.locals as any)?.runtime?.env ?? process.env;

  const safe = {
    hasBaseUrl: Boolean((env as any).NEXTCLOUD_BASE_URL),
    hasUsername: Boolean((env as any).NEXTCLOUD_USERNAME),
    hasPassword: Boolean((env as any).NEXTCLOUD_PASSWORD),
    artistsDir: null as string | null,
    webdavBase: null as string | null,
    slugs: [] as string[],
    artistsEntries: [] as Array<{ name: string; isCollection: boolean; href: string; contentType?: string }>,
    error: null as string | null,
  };

  try {
    safe.artistsDir = getArtistsDir(env);
    safe.webdavBase = getWebdavUserBase(env);
    safe.slugs = await listArtistSlugs(env);
    safe.artistsEntries = await debugListEntries(env, `${safe.artistsDir}/`);
  } catch (e) {
    safe.error = e instanceof Error ? e.message : "Unknown error";
  }

  return Response.json(safe);
}


