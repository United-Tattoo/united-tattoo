import type { APIRoute } from 'astro';

export const prerender = false;

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

type RuntimeEnv = {
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
};

type GitHubTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
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

function callbackHtml(status: 'success' | 'error', tokenOrMessage: string): string {
  const payload =
    status === 'success'
      ? { token: tokenOrMessage }
      : { error: tokenOrMessage };
  const authorizationMessage = `authorization:github:${status}:${JSON.stringify(payload)}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <title>Authorizing Decap CMS</title>
  </head>
  <body>
    <p>Authorizing Decap CMS...</p>
    <script>
      const receiveMessage = (message) => {
        if (!window.opener) return;
        window.opener.postMessage(
          ${JSON.stringify(authorizationMessage)},
          message.origin
        );
        window.removeEventListener('message', receiveMessage, false);
      };

      window.addEventListener('message', receiveMessage, false);

      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      }
    </script>
  </body>
</html>`;
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export const GET: APIRoute = async (context) => {
  const code = context.url.searchParams.get('code');
  const deniedReason = context.url.searchParams.get('error');

  if (deniedReason) {
    return htmlResponse(callbackHtml('error', deniedReason), 400);
  }

  if (!code) {
    return htmlResponse(callbackHtml('error', 'Missing GitHub OAuth code.'), 400);
  }

  const env = getRuntimeEnv(context);
  const clientId = env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return htmlResponse(callbackHtml('error', 'GitHub OAuth is not configured.'), 500);
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${context.url.origin}/oauth/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    return htmlResponse(callbackHtml('error', 'GitHub token exchange failed.'), 502);
  }

  const tokenResponse = (await response.json()) as GitHubTokenResponse;

  if (!tokenResponse.access_token) {
    return htmlResponse(
      callbackHtml(
        'error',
        tokenResponse.error_description || tokenResponse.error || 'GitHub did not return an access token.',
      ),
      502,
    );
  }

  return htmlResponse(callbackHtml('success', tokenResponse.access_token));
};
