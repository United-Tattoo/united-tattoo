export const prerender = false;

import type { APIContext } from "astro";
import { getArtistsDir, getWebdavUserBase } from "../../lib/nextcloud-cms";

function joinUrl(base: string, path: string): string {
  const a = base.replace(/\/+$/, "");
  const b = path.replace(/^\/+/, "");
  return `${a}/${b}`;
}

function basicAuthHeader(username: string, password: string): string {
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

export async function GET(context: APIContext): Promise<Response> {
  const env = (context.locals as any)?.runtime?.env ?? process.env;
  const url = new URL(context.request.url);
  const path = url.searchParams.get("path") || "";

  if (!path) return Response.json({ error: "Missing path" }, { status: 400 });
  if (path.startsWith("/") || path.includes("..")) {
    return Response.json({ error: "Invalid path" }, { status: 400 });
  }

  const artistsDir = getArtistsDir(env);
  if (!path.startsWith(`${artistsDir}/`)) {
    return Response.json({ error: "Path outside Artists directory" }, { status: 403 });
  }

  const baseUrl = (env as any).NEXTCLOUD_BASE_URL;
  const username = (env as any).NEXTCLOUD_USERNAME;
  const password = (env as any).NEXTCLOUD_PASSWORD;
  if (!baseUrl || !username || !password) {
    return Response.json({ error: "Missing NEXTCLOUD_* env vars" }, { status: 500 });
  }

  const webdavBase = getWebdavUserBase(env);
  const fileUrl = joinUrl(webdavBase, path);
  const auth = basicAuthHeader(username, password);

  const upstream = await fetch(fileUrl, {
    method: "GET",
    headers: { Authorization: auth },
  });

  if (!upstream.ok) {
    return Response.json({ error: `Upstream failed: ${upstream.status}` }, { status: 502 });
  }

  const headers = new Headers();
  const ct = upstream.headers.get("content-type") || "application/octet-stream";
  headers.set("content-type", ct);
  headers.set("cache-control", "public, max-age=300");

  return new Response(upstream.body, { status: 200, headers });
}


