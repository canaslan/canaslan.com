# Cloudflare deployment

## Current status: live

Version 1.0 launched on 6 November 2026 at `https://canaslan.com`. The Worker Custom Domain, workers.dev alias, and preview routing are enabled in `wrangler.jsonc`. Cloudflare's Always Use HTTPS setting is enabled for the zone, and `www.canaslan.com` permanently redirects to the canonical apex URL.

## Pre-launch domain and DNS

Verified 5 November 2026:

- Namecheap remains the registrar. Cloudflare is authoritative DNS through `nile.ns.cloudflare.com` and `piper.ns.cloudflare.com`.
- The canonical production URL is `https://canaslan.com`.
- `www.canaslan.com` has a proxied A record to Cloudflare's redirect-only placeholder `192.0.2.1`, with automatic TTL.
- The enabled zone Single Redirect rule `Redirect www to apex` returns 301 for both HTTP and HTTPS requests to `www.canaslan.com`. It targets `https://canaslan.com`, preserving the original path and query string.
- The redirect was certificate-verified for `www.canaslan.com` over HTTPS. Root, nested-path, and query-string checks passed without a redirect loop.
- iCloud Mail remains configured with priority-10 MX records for `mx01.mail.icloud.com` and `mx02.mail.icloud.com`, SPF `v=spf1 include:icloud.com ~all`, Apple domain verification, and the DNS-only `sig1._domainkey` CNAME. Existing Google site-verification TXT records are also preserved.

The 6 November launch restored the Worker Custom Domain and verified apex DNS, HTTP-to-HTTPS behavior, certificate validity, path handling, and the complete `www` redirect journey.

## Decision

Use Cloudflare Workers Static Assets on the Workers Free plan for this statically rendered Astro site. No server adapter, database, or runtime secrets are needed. `wrangler.jsonc` is the source of deployment configuration. Cloudflare's `cf init .` generated a Wrangler setup; this project uses its local Wrangler dependency for deployment.

Expected hosting cost: US$0/month for the current static workload. Static asset requests are free and unlimited. Workers Builds includes 3,000 build minutes/month on Free, with one concurrent build. Domain registration is separate. Do not upgrade to a paid plan unless requirements change.

Pricing verified 4 November 2026:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/

## Repository and automated builds

Repository: private [canaslan/canaslan.com](https://github.com/canaslan/canaslan.com), with production source on `main`. The local checkout uses this repository as `origin`. The owner completed the GitHub-to-Cloudflare connection on 5 November 2026; Git-triggered production and preview builds have both passed.

To review or reconnect automatic deployment, open the [Cloudflare account](https://dash.cloudflare.com/6472e6c2b1616c065c24ac87e4581486/workers-and-pages), select `can-aslan`, then **Settings → Builds → Connect**. Authorize the Cloudflare GitHub app for `canaslan/canaslan.com` and apply these Workers Builds settings:

- Worker name: `can-aslan` (must match `wrangler.jsonc`).
- Production branch: `main`.
- Root directory: repository root.
- Install command: `npm ci` (commit `package-lock.json`).
- Build command: `npm run build` (includes token generation through `prebuild`).
- Deploy command: `npx wrangler deploy`.
- Preview command: `npx wrangler preview`.
- Enable preview builds for non-production branches.
- Build environment: `NODE_VERSION=22.23.3`; update deliberately when upgrading Astro.
- Application environment variables and runtime secrets: none currently required.
- Output directory: `dist/`, configured in `wrangler.jsonc`.

Cloudflare's connected build integration supplies deployment credentials. Never commit API tokens or OAuth credentials. GitHub app authorization and Cloudflare account access must be completed by the owner.

Sources:

- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/previews/

## Local checks and manual deployment

```sh
npm ci
npm run deploy:check
```

This builds the site and checks deployment packaging without uploading. For local edge testing:

```sh
npx wrangler dev --local
```

Sign in with `npx wrangler login` before a manual deployment. MCP sign-in does not establish CLI sign-in. Confirm the intended account with `npx wrangler whoami`, then:

```sh
# Production: rebuild and deploy the current checkout.
npm run deploy

# Preview: rebuild and deploy a named branch preview.
npm run deploy:preview -- --name can-121
```

Preview URLs are public unless Cloudflare Access is configured. `public/_headers` adds `X-Robots-Tag: noindex` to HTTPS `*.*.workers.dev` URLs, including the production workers.dev alias. It leaves `canaslan.com` indexable. This is search guidance, not access control. Custom preview domains require equivalent rules before use.

Source: https://developers.cloudflare.com/workers/static-assets/headers/

## Production domain

Astro's production site URL is `https://canaslan.com`. The hostname is attached as a Worker Custom Domain, and Cloudflare manages its DNS record and certificate. No application data services are bound.

Git-triggered release verified 5 November 2026:

- Production: https://canaslan.com
- Production Cloudflare alias: https://can-aslan.can-aslan.workers.dev
- Verified Git-built production version: `6f02ae7b-3e5a-4352-a406-31d543af4ff1`
- Verified source commit: `84188bf39ea45dcf5a0952b118d138185211aea8`
- [Production build 42cfc5c3-62eb-4cc6-b778-87572ee815c7](https://dash.cloudflare.com/6472e6c2b1616c065c24ac87e4581486/workers/services/view/can-aslan/production/builds/42cfc5c3-62eb-4cc6-b778-87572ee815c7): succeeded and promoted to production.
- Verification branch: `can-121-verification`.
- Git-triggered preview: https://can-121-verification-can-aslan.can-aslan.workers.dev
- [Preview build d3890307-3ed5-4ea0-bfe9-ab519c9896b3](https://dash.cloudflare.com/6472e6c2b1616c065c24ac87e4581486/workers/services/view/can-aslan/production/previews/can-121-verification/builds/d3890307-3ed5-4ea0-bfe9-ab519c9896b3): succeeded.
- Initial manual preview remains at https://can-121-can-aslan.can-aslan.workers.dev.
- Previous verified production version, suitable as a rollback target: `68c0731c-068c-4ce7-b4e7-3d3b8301e0e5` (source `c82ae3708c384cc71b56efe05a51f24fd971534c`).

Every subsequent production push creates a new version; inspect the current deployment before choosing a rollback target.

## Release verification

For both the production URL and preview URL:

1. Open `/`, `/about/`, `/colophon/`, `/contact/`, `/principles/`, `/work/`, `/readme/`, and `/research/` directly, including a fresh load on each route.
2. Check `/work.md`, CSS, icons, images, and `/can-aslan-cv.pdf`. Confirm the PDF opens and the View CV link still targets the established path.
3. Confirm an unknown route returns HTTP 404, rather than the home page.
4. Inspect `X-Robots-Tag` on preview HTML and the PDF; expect `noindex`. Check the production custom domain does not receive that header.
5. Check the deployed site on mobile and desktop, in light and dark themes, with keyboard focus and navigation.

## Verification — 5 November 2026

The current production build passes with eight pages (including Colophon), `/work.md`, and 51 static asset files. Wrangler deployment dry run passes. A limited scan of source files found no private-key blocks or common GitHub/OpenAI token patterns. Git marks the CV PDF as binary; local credential files and generated output are excluded from version control.

Live production and the named Preview each passed 40 HTTP checks covering every built page and asset plus an unknown-route 404. The CV PDF matches the source bytes on both hosts. Preview responses include `X-Robots-Tag: noindex`; production custom-domain responses do not.

The local resolver still cached the previous empty DNS answer during verification. Production was checked with curl `--resolve` using `104.21.34.133`, returned by the authoritative Cloudflare nameserver, with normal TLS certificate verification enabled. Normal resolver propagation must be rechecked. The named Preview resolved normally and passed HTTPS checks. Public recursive resolvers `1.1.1.1` and `8.8.8.8` also return the correct production addresses, and the production Cloudflare alias now passes HTTPS.

Wrangler is authorized as `hello@canaslan.com` in account `6472e6c2b1616c065c24ac87e4581486`. GitHub is authorized as `canaslan` using the official GitHub CLI. The Cloudflare integration has zone, DNS, and Rulesets access. The Workers Builds API still denies the CLI authorization (HTTP 403), but dashboard-authorized Git-connected builds work; their GitHub check runs provide the verification evidence.

The dashboard connection is complete. A documentation commit pushed to `main` triggered the successful production build; pushing the same verified source to `can-121-verification` triggered the successful isolated Preview build. Both Git-built hosts passed the 40 HTTP checks above. These results establish the hosting and deployment workflow; they do not establish visual or assistive-technology conformance.

Remaining verification gaps: this machine's normal production DNS cache was still stale, and browser access was unavailable, so mobile/desktop/theme/keyboard browser QA was not rerun. Public DNS and certificate-verified production HTTP checks passed. Rollback commands and a known-good previous version are recorded; no live rollback drill was run.

## Launch verification — 6 November 2026

- Release source: `46d981067b8d70d367c0932857430d452967554a` on `main`; the remote branch SHA was verified after push.
- Cloudflare production version: `2eb02a17-cfba-402d-a674-fa163bdfd78b`.
- `npm run deploy:check`, the production build, asset upload, and deployment passed with nine generated HTML pages and 58 packaged assets.
- The apex returned HTTPS 200. HTTP apex and HTTP/HTTPS `www` requests returned 301 to the canonical HTTPS apex while preserving a nested path and query string.
- `robots.txt`, `sitemap.xml`, the social card, and the CV PDF returned HTTPS 200. An unknown route returned the custom HTTP 404 response.
- Production HTML contained the canonical URL, absolute social-image URL, Umami script URL, and expected Umami website ID exactly as configured.
- The owner completed the release-candidate browser pass covering the agreed manual browser-testing scope before launch.
- The Services routes remain deliberately deferred and are not generated from the underscored source files.

Analytics dashboard receipt and search-engine sitemap submission are post-launch checks. No live rollback drill was run.

## Rollback

Before every production release, record the current production version ID and its Git commit:

```sh
npx wrangler deployments list
npx wrangler versions list
```

To restore a known working release, replace `VERSION_ID` below with the recorded version:

```sh
npx wrangler rollback VERSION_ID --message "Restore previous working release"
```

Review and confirm the command's target. Recheck the live pages, nested routes, assets, and PDF after rollback. Pause automatic production builds while investigating; otherwise another push can redeploy the faulty code. Revert the faulty source commit through a reviewed change so `main` matches the intended production state.

Rollback restores code and static assets for the selected version. It does not reverse DNS changes, external settings, or data in connected resources. There are currently no application data bindings. A rollback cannot be exercised until at least two working production versions exist.

Source: https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/
