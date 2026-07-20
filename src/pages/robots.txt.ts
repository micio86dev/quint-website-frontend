import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('A site origin is required to generate robots.txt.');
  }

  const sitemap = new URL('sitemap-index.xml', site);

  return new Response(`User-agent: *\nDisallow: /admin/\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
