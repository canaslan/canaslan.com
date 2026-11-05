const STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

let manualTheme: Theme | null = getStoredTheme();

export function getTheme(): Theme {
  return manualTheme ?? getSystemTheme();
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function updateToggleButtons(theme: Theme) {
  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

export function setTheme(theme: Theme, persist = true) {
  applyTheme(theme);
  if (persist) {
    manualTheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Keep the manual selection usable for this page without storage.
    }
  }
  updateToggleButtons(theme);
}

export function toggleTheme() {
  const nextTheme: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
}

export function initThemeToggle() {
  applyTheme(getTheme());
  updateToggleButtons(getTheme());

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', toggleTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!manualTheme) {
      setTheme(event.matches ? 'dark' : 'light', false);
    }
  });
}
