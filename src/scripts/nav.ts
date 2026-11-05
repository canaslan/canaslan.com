import viewport from '../tokens/viewport/value.tokens.json';
import { isNavActive } from '../data/navigation';
import { initThemeToggle } from './theme';

const mobileMax = viewport.viewport['mobile-max'].$value;

function isMobileViewport() {
  return window.matchMedia(`(width < ${mobileMax}px)`).matches;
}

function isInternalNavHref(href: string) {
  return href.startsWith('/') || href.startsWith('#');
}

function syncNavActiveStates(pathname = window.location.pathname, hash = window.location.hash) {
  document.querySelectorAll<HTMLAnchorElement>('.site-nav__pill--link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || !isInternalNavHref(href)) return;

    const active = isNavActive(pathname, href, hash);
    link.classList.toggle('is-active', active);

    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initNavActiveStates() {
  syncNavActiveStates();

  document.querySelectorAll<HTMLAnchorElement>('.site-nav__pill--link').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (!href || !isInternalNavHref(href)) return;

      const next = new URL(href, window.location.href);
      const sameDocument =
        normalizePathForNav(next.pathname) === normalizePathForNav(window.location.pathname);

      // Same-page hash changes: apply destination state immediately (before hashchange).
      if (sameDocument) {
        syncNavActiveStates(next.pathname, next.hash);
      }
    });
  });

  window.addEventListener('hashchange', () => syncNavActiveStates());
  window.addEventListener('popstate', () => syncNavActiveStates());
}

function normalizePathForNav(pathname: string) {
  return pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
}

function setMenuOpen(open: boolean) {
  const drawer = document.querySelector<HTMLElement>('[data-menu-drawer]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const label = document.querySelector<HTMLElement>('[data-menu-toggle-label]');
  const modal = document.querySelector<HTMLElement>('[data-menu-modal]');

  if (!drawer || !toggle) return;

  const shouldOpen = open && isMobileViewport();
  const wasOpen = !drawer.hidden;

  document.querySelectorAll<HTMLElement>('.app-shell, .skip-link').forEach((element) => {
    element.inert = shouldOpen;
  });
  if (shouldOpen) {
    modal?.setAttribute('role', 'dialog');
    modal?.setAttribute('aria-modal', 'true');
    modal?.setAttribute('aria-label', 'Navigation');
  } else {
    modal?.removeAttribute('role');
    modal?.removeAttribute('aria-modal');
    modal?.removeAttribute('aria-label');
  }

  drawer.hidden = !shouldOpen;
  toggle.setAttribute('aria-expanded', String(shouldOpen));

  if (label) {
    label.textContent = shouldOpen ? 'Close menu' : 'Open menu';
  }

  document.body.toggleAttribute('data-menu-open', shouldOpen);

  if (shouldOpen && !wasOpen) {
    drawer.querySelector<HTMLElement>('a[href]')?.focus();
  } else if (!shouldOpen && wasOpen) {
    // The mobile toggle is hidden after switching to the desktop layout.
    const destination = isMobileViewport()
      ? toggle
      : document.querySelector<HTMLElement>('.sidebar a[aria-current="page"], .sidebar a[href]');
    destination?.focus();
  }
}

function updateNavClocks() {
  const clocks = document.querySelectorAll<HTMLTimeElement>('[data-nav-clock]');

  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  const formatted = `${part('hour')}:${part('minute')}:${part('second')} ${part('timeZoneName')}`;

  clocks.forEach((clock) => {
    clock.textContent = formatted;
    clock.dateTime = now.toISOString();
  });
}

function initMobileNav() {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const drawer = document.querySelector<HTMLElement>('[data-menu-drawer]');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    if (!isMobileViewport()) return;

    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  drawer.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;

    if (target?.closest('[data-menu-close]') || target?.closest('a[href]')) {
      setMenuOpen(false);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (drawer.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
    } else if (event.key === 'Tab') {
      // Include the visible close toggle, which is part of the dialog wrapper.
      const controls = [toggle, ...drawer.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')];
      const index = controls.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault();
        controls[controls.length - 1].focus();
      } else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) {
        event.preventDefault();
        controls[0].focus();
      }
    }
  });

  window.matchMedia(`(min-width: ${mobileMax}px)`).addEventListener('change', (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });

  if (!isMobileViewport()) {
    setMenuOpen(false);
  }
}

initThemeToggle();
updateNavClocks();
setInterval(updateNavClocks, 1000);
initMobileNav();
initNavActiveStates();
