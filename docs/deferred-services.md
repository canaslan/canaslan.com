# Deferred Services pages

Services is excluded from this release. Astro ignores page files and directories prefixed with `_`, so the implementation remains in `src/pages/_services.astro` and `src/pages/_services/[service].astro` without publishing routes.

To restore Services:

1. Rename `src/pages/_services.astro` to `src/pages/services.astro` and `src/pages/_services/` to `src/pages/services/`.
2. Restore the Services entry after Principles in `src/data/navigation.ts`.
3. Restore the Services links in `src/pages/work.astro` and `src/data/work.ts`.
4. Update `docs/sitemap.dot` with the overview and three detail routes.
5. Run `npm run build` and verify the routes, navigation, and Work page at mobile and desktop sizes in both themes.

The service data, components, and styles are retained in their existing locations.
