# Can Aslan sitemap for OmniGraffle

The adjacent `sitemap.dot` represents the launch sitemap as updated on November 5, 2026. It inventories the seven canonical, indexable pages, the non-indexable About placeholder, and the external Blog destination. URLs use the production origin configured in `astro.config.mjs`; the intentionally offline production routes were not checked live.

Drag `sitemap.dot` from Finder onto OmniGraffle's Dock icon. OmniGraffle imports DOT as a diagram with editable shapes and connectors. Save the imported document as `.graffle`. See the [official import documentation and supported DOT syntax](https://support.omnigroup.com/documentation/omnigraffle/mac/7.3/en/opening-and-importing-files-in-omnigraffle/).

Solid connectors represent the organization of `src/data/navigation.ts`. Principles and Services appear under Work in navigation and breadcrumbs; their URLs remain top-level routes. This is a structural sitemap, not a complete graph of every link between pages.

Dashed connectors group routes that exist in `src/pages/` but are absent from the main navigation. The grouping box is an annotation, not a proposed page. About contains starter placeholder copy, is marked `noindex`, and is excluded from the XML sitemap. The underscored Services source files are deferred and do not generate routes. Blog is external and has a dashed outline plus an explicit label.

Page sections, individual outbound links, downloads, and noninteractive future case studies/CV are omitted from this page-level map.

Verification: compared the map with the generated page routes, navigation entries, breadcrumbs, `robots.txt`, and `sitemap.xml`. Import and layout have not been verified inside OmniGraffle.
