export const prerender = true;

export function GET({ site }: { site: URL | undefined }) {
  const origin = site ?? new URL('https://canaslan.com');
  const body = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${new URL('/sitemap.xml', origin)}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
