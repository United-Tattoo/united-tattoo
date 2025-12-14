import { XMLParser } from "fast-xml-parser";

export type NextcloudCmsEnv = {
  NEXTCLOUD_BASE_URL: string;
  NEXTCLOUD_USERNAME: string;
  NEXTCLOUD_PASSWORD: string;
  /**
   * Defaults to `/remote.php/dav/files`.
   * Final WebDAV base becomes `${NEXTCLOUD_BASE_URL}${NEXTCLOUD_WEBDAV_BASE_PATH}/${NEXTCLOUD_USERNAME}`.
   */
  NEXTCLOUD_WEBDAV_BASE_PATH?: string;
  /**
   * Defaults to `Artists`.
   * Example: `Artists` means `${webdavBase}/Artists/...`
   */
  NEXTCLOUD_CMS_ARTISTS_DIR?: string;
};

export type ArtistInfoJson = {
  name?: string;
  slug?: string;
  specialties?: string[];
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  /** CalDAV/WebDAV calendar collection URL for this artist */
  calendarUrl?: string;
  calendar_url?: string;
  [key: string]: unknown;
};

export type PortfolioItem = {
  filename: string;
  webdavPath: string;
};

export type ArtistCmsRecord = {
  slug: string;
  info: ArtistInfoJson;
  bioMarkdown?: string;
  portfolio: PortfolioItem[];
};

const xml = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function requiredEnv(env: Partial<NextcloudCmsEnv>): NextcloudCmsEnv {
  const base = env.NEXTCLOUD_BASE_URL;
  const user = env.NEXTCLOUD_USERNAME;
  const pass = env.NEXTCLOUD_PASSWORD;
  if (!base || !user || !pass) {
    throw new Error("Missing NEXTCLOUD_* env vars required for WebDAV CMS access");
  }
  return {
    NEXTCLOUD_BASE_URL: base,
    NEXTCLOUD_USERNAME: user,
    NEXTCLOUD_PASSWORD: pass,
    NEXTCLOUD_WEBDAV_BASE_PATH: env.NEXTCLOUD_WEBDAV_BASE_PATH,
    NEXTCLOUD_CMS_ARTISTS_DIR: env.NEXTCLOUD_CMS_ARTISTS_DIR,
  };
}

function joinUrl(base: string, path: string): string {
  const a = base.replace(/\/+$/, "");
  const b = path.replace(/^\/+/, "");
  return `${a}/${b}`;
}

export function getWebdavUserBase(rawEnv: Partial<NextcloudCmsEnv>): string {
  const env = requiredEnv(rawEnv);
  const basePath = env.NEXTCLOUD_WEBDAV_BASE_PATH || "/remote.php/dav/files";
  return joinUrl(joinUrl(env.NEXTCLOUD_BASE_URL, basePath), encodeURIComponent(env.NEXTCLOUD_USERNAME));
}

function basicAuthHeader(username: string, password: string): string {
  // Workers has btoa. Node also has it in modern versions. Fall back to Buffer if present.
  const btoaFn = (globalThis as any).btoa as ((s: string) => string) | undefined;
  const token = btoaFn
    ? btoaFn(`${username}:${password}`)
    : (globalThis as any).Buffer
      ? (globalThis as any).Buffer.from(`${username}:${password}`).toString("base64")
      : (() => {
          throw new Error("No base64 encoder available for Basic Auth");
        })();
  return `Basic ${token}`;
}

function normalizeHrefToName(href: string): string {
  const trimmed = href.replace(/\/+$/, "");
  const last = trimmed.split("/").pop() || "";
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

type DavEntry = {
  href: string;
  name: string;
  isCollection: boolean;
  contentType?: string;
};

async function webdavPropfind(env: NextcloudCmsEnv, webdavPath: string): Promise<DavEntry[]> {
  const base = getWebdavUserBase(env);
  const url = joinUrl(base, webdavPath);
  const auth = basicAuthHeader(env.NEXTCLOUD_USERNAME, env.NEXTCLOUD_PASSWORD);

  const response = await fetch(url, {
    method: "PROPFIND",
    headers: {
      Authorization: auth,
      Depth: "1",
    },
  });

  if (!response.ok && response.status !== 207) {
    throw new Error(`WebDAV PROPFIND failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const parsed = xml.parse(text) as any;
  const responses = asArray(parsed?.multistatus?.response);

  const entries: DavEntry[] = responses
    .map((r: any) => {
      const href = r?.href as string | undefined;
      if (!href) return null;

      const propstats = asArray(r?.propstat);
      const okPropstat = propstats.find((ps: any) => String(ps?.status || "").includes(" 200 "));
      const prop = okPropstat?.prop || propstats?.[0]?.prop;

      // Nextcloud's PROPFIND resourcetype/collection parsing can vary with XML parsing.
      // Fallback: hrefs for directories end with a trailing slash.
      const isCollection =
        href.endsWith("/") ||
        !!prop?.resourcetype?.collection ||
        (typeof prop?.resourcetype === "object" && prop?.resourcetype && "collection" in prop.resourcetype);
      const contentType =
        prop?.getcontenttype || prop?.["getcontenttype"] || prop?.["getcontenttype"]?.["#text"];

      const name = normalizeHrefToName(href);

      return {
        href,
        name,
        isCollection,
        contentType: typeof contentType === "string" ? contentType : undefined,
      } satisfies DavEntry;
    })
    .filter(Boolean);

  // The first entry is usually the directory itself; drop it.
  const selfName = webdavPath.replace(/\/+$/, "").split("/").pop() || "";
  return entries.filter((e) => e.name !== selfName);
}

async function webdavGetText(env: NextcloudCmsEnv, webdavPath: string): Promise<string> {
  const base = getWebdavUserBase(env);
  const url = joinUrl(base, webdavPath);
  const auth = basicAuthHeader(env.NEXTCLOUD_USERNAME, env.NEXTCLOUD_PASSWORD);

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: auth },
  });
  if (!response.ok) {
    throw new Error(`WebDAV GET failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export function getArtistsDir(rawEnv: Partial<NextcloudCmsEnv>): string {
  const env = requiredEnv(rawEnv);
  return env.NEXTCLOUD_CMS_ARTISTS_DIR || "Artists";
}

export async function listArtistSlugs(rawEnv: Partial<NextcloudCmsEnv>): Promise<string[]> {
  const env = requiredEnv(rawEnv);
  const artistsDir = env.NEXTCLOUD_CMS_ARTISTS_DIR || "Artists";

  const entries = await webdavPropfind(env, `${artistsDir}/`);
  return entries
    .filter((e) => e.isCollection || e.href.endsWith("/"))
    .map((e) => e.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export async function debugListEntries(rawEnv: Partial<NextcloudCmsEnv>, webdavPath: string) {
  const env = requiredEnv(rawEnv);
  const entries = await webdavPropfind(env, webdavPath);
  return entries.map((e) => ({ name: e.name, isCollection: e.isCollection, href: e.href, contentType: e.contentType }));
}

export async function getArtistRecord(
  rawEnv: Partial<NextcloudCmsEnv>,
  slug: string
): Promise<ArtistCmsRecord> {
  const env = requiredEnv(rawEnv);
  const artistsDir = env.NEXTCLOUD_CMS_ARTISTS_DIR || "Artists";

  const infoPath = `${artistsDir}/${slug}/info.json`;
  const bioPath = `${artistsDir}/${slug}/bio.md`;
  const portfolioPathLower = `${artistsDir}/${slug}/portfolio/`;
  const portfolioPathUpper = `${artistsDir}/${slug}/Portfolio/`;

  const [infoRaw, bioMarkdown, portfolioEntriesLower, portfolioEntriesUpper] = await Promise.all([
    webdavGetText(env, infoPath).catch(() => "{}"),
    webdavGetText(env, bioPath).catch(() => undefined),
    webdavPropfind(env, portfolioPathLower).catch(() => [] as DavEntry[]),
    webdavPropfind(env, portfolioPathUpper).catch(() => [] as DavEntry[]),
  ]);

  let info: ArtistInfoJson = {};
  try {
    info = JSON.parse(infoRaw) as ArtistInfoJson;
  } catch {
    info = {};
  }

  const portfolioEntries = portfolioEntriesLower.length ? portfolioEntriesLower : portfolioEntriesUpper;
  const portfolioBasePath = portfolioEntriesLower.length ? portfolioPathLower : portfolioPathUpper;

  const portfolio = portfolioEntries
    .filter((e) => !e.isCollection)
    .map((e) => e.name)
    .filter((name) => /\.(avif|webp|png|jpe?g|gif)$/i.test(name))
    .map((filename) => ({
      filename,
      webdavPath: `${portfolioBasePath}${filename}`,
    }));

  return {
    slug,
    info,
    bioMarkdown,
    portfolio,
  };
}


