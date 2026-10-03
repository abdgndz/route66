import type { APIRoute } from 'astro';
import { DRAFT } from '../data/site';

export const GET: APIRoute = ({ site }) => {
  const body = DRAFT
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
