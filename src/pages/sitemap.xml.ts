export const prerender = true;

const indexableRoutes = [
  '/',
  '/colophon/',
  '/contact/',
  '/work/principles/',
  '/work/',
  '/readme/',
  '/research/',
];

export function GET({ site }: { site: URL | undefined }) {
  const origin = site ?? new URL('https://canaslan.com');
  const urls = indexableRoutes
    .map((route) => `  <url><loc>${new URL(route, origin)}</loc></url>`)
    .join('\n');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
