export type SiteNavLink = {
  kind: 'link';
  label: string;
  href: string;
  icon?: 'door';
  external?: boolean;
  indent?: boolean;
};

export type SiteNavStatus = {
  kind: 'status';
  label: string;
};

export type SiteNavClock = {
  kind: 'clock';
};

export type SiteNavVersion = {
  kind: 'version';
  label: string;
};

export type SiteNavItem = SiteNavLink | SiteNavStatus | SiteNavClock | SiteNavVersion;

export const siteVersion = 'v1.0';

export const siteNav: SiteNavItem[] = [
  { kind: 'link', label: 'Can Aslan', href: '/', icon: 'door' },
  { kind: 'link', label: 'Work', href: '/work' },
  { kind: 'link', label: 'Principles', href: '/principles', indent: true },
  { kind: 'link', label: 'Readme', href: '/readme' },
  { kind: 'link', label: 'Blog', href: 'https://canaslan.substack.com/', external: true },
  { kind: 'link', label: 'Contact', href: '/contact' },
  { kind: 'status', label: 'Available for hire' },
  { kind: 'clock' },
];

export function normalizePath(pathname: string) {
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

export function normalizeHash(hash: string) {
  return hash.startsWith('#') ? hash.slice(1) : hash;
}

function pathHasHashLinks(path: string) {
  return siteNav.some((item) => {
    if (item.kind !== 'link' || item.external) return false;
    const [itemPath, itemHash = ''] = item.href.split('#');
    return Boolean(itemHash) && normalizePath(itemPath) === path;
  });
}

export function isNavActive(
  pathname: string,
  href: string,
  hash = '',
  options: { resolveEmptyHashParents?: boolean } = {},
) {
  const resolveEmptyHashParents = options.resolveEmptyHashParents !== false;
  const current = normalizePath(pathname);
  const currentHash = normalizeHash(hash);
  const [targetPath, targetHashRaw = ''] = href.split('#');
  const target = normalizePath(targetPath);
  const targetHash = normalizeHash(targetHashRaw);

  if (target === '/services' && current.startsWith('/services/')) return true;

  if (target === '/') {
    return current === '/' && !currentHash;
  }

  // Hash targets only match path + hash together.
  if (targetHash) {
    return current === target && currentHash === targetHash;
  }

  if (current !== target) {
    return false;
  }

  // Path-only parents (e.g. Work) stay inactive when a hash sub-item owns the URL.
  if (!currentHash) {
    // SSR never receives the URL hash, so skip painting parents that share a
    // path with hash children — an inline sync sets the real state before paint.
    if (!resolveEmptyHashParents && pathHasHashLinks(current)) {
      return false;
    }
    return true;
  }

  return !pathHasHashLinks(current) || !siteNav.some((item) => {
    if (item.kind !== 'link' || item.external) return false;
    const [itemPath, itemHashRaw = ''] = item.href.split('#');
    const itemHash = normalizeHash(itemHashRaw);
    return Boolean(itemHash) && normalizePath(itemPath) === current && itemHash === currentHash;
  });
}
