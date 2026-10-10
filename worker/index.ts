// Serves the static site on one canonical origin: https, bare domain.
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  /** Set by `wrangler dev --var LOCAL:1`; dev rewrites URLs to the live host. */
  LOCAL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!env.LOCAL && (url.protocol === 'http:' || url.hostname.startsWith('www.'))) {
      url.protocol = 'https:';
      url.hostname = url.hostname.replace(/^www\./, '');
      return Response.redirect(url.toString(), 301);
    }
    const response = await env.ASSETS.fetch(request);
    // HSTS only on the canonical https host.
    const headers = new Headers(response.headers);
    headers.set('Strict-Transport-Security', 'max-age=31536000');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
