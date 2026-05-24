import type { APIRoute } from 'astro';

export const prerender = false;

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

type RuntimeEnv = {
  GITHUB_CLIENT_ID?: string;
  GITHUB_REPO_PRIVATE?: string;
};

function getRuntimeEnv(context: Parameters<APIRoute>[0]): RuntimeEnv {
  const runtimeContext = context as Parameters<APIRoute>[0] & {
    platform?: { env?: RuntimeEnv };
    locals: Parameters<APIRoute>[0]['locals'] & {
      runtime?: { env?: RuntimeEnv };
    };
  };

  return runtimeContext.platform?.env || runtimeContext.locals.runtime?.env || {};
}

function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const GET: APIRoute = async (context) => {
  const provider = context.url.searchParams.get('provider');
  if (provider && provider !== 'github') {
    return new Response('Invalid OAuth provider.', { status: 400 });
  }

  const env = getRuntimeEnv(context);
  const clientId = env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response('GitHub OAuth is not configured.', { status: 500 });
  }

  const isPrivateRepo =
    (env.GITHUB_REPO_PRIVATE || import.meta.env.GITHUB_REPO_PRIVATE) === '1';
  const scope = isPrivateRepo ? 'repo,user' : 'public_repo,user';
  const redirectUri = `${context.url.origin}/oauth/callback`;
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);

  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', scope);
  authorizeUrl.searchParams.set('state', randomHex(16));

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl.toString(),
      'cache-control': 'no-store',
    },
  });
};
