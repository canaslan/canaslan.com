# can-aslan

Personal website built with [Astro](https://astro.build).

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
npm run preview
```

## Deployment

See [Cloudflare deployment](docs/deployment.md) for build settings, previews, release verification, and rollback.

## Design tokens

Color, spacing, typography, icon, and viewport tokens are exported from Figma into `src/tokens/` and compiled to CSS variables in `src/styles/tokens.css`.

After updating token JSON files:

```bash
npm run tokens
```

- **Color aliases** (e.g. `--text-primary`, `--nav-pill-resting`, `--nav-pill-hovered`) switch between light and dark via `data-theme` and `prefers-color-scheme`
- **Color base** primitives (e.g. `--orange-500`, `--grey-900`) are shared across modes
- **Spacing** (e.g. `--spacing-3`, `--spacing-6`) from `src/tokens/spacing/`
- **Typography** (e.g. `--size-display`, `--letter-spacing-display`) from `src/tokens/typography/` — compiled as `rem` (16px root)
- **Icon sizes** (e.g. `--icon-m`, `--icon-mode-toggle`) from `src/tokens/icon/`
- **Viewport** (e.g. `--viewport-l`, `--viewport-content-max`) from `src/tokens/viewport/`
- **Breakpoints** — viewport (`xxs`–`xl`) and column counts from `src/tokens/viewport/` and `src/tokens/grid/`; see `src/styles/breakpoints.css` for literal `@media` values (mobile overlay nav below `m` / 1024px)

## Layout contract

The approved Figma layout uses one grid on the whole page frame:

- **Desktop, 1024 px and above:** 12 stretch columns, zero margins/gutters; main content in columns 4–9. Navigation sits independently at the top left with a 16 px inset and does not shift the grid.
- **Below 1024 px:** one stretch column, 16 px margins, zero gutter; overlay navigation.
- Figma styles: `Layout/Desktop/Page` and `Layout/Mobile/Page`.

**Code migration is pending.** The website still uses a separate sidebar plus a padded content grid. See the [layout contract](docs/layout/README.md) for reference sizes, current implementation differences and migration checks.

## Customize

- **Home** — `src/pages/index.astro`
- **About** — `src/pages/about.astro`
- **Projects** — edit the `projects` array in `src/pages/projects.astro`
- **Contact** — update links in `src/pages/contact.astro`
- **Layout & styles** — `src/layouts/Layout.astro`
- **Color tokens** — `src/tokens/` (source) and `src/styles/tokens.css` (generated)
- **Site URL** — `astro.config.mjs` (`site` field)
