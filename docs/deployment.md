# Cloudflare deployment

## Decision

Use Cloudflare Workers Static Assets on the Workers Free plan for this statically rendered Astro site. No server adapter, database, or runtime secrets are needed. `wrangler.jsonc` is the source of deployment configuration. Cloudflare's `cf init .` generated a Wrangler setup; this project uses its local Wrangler dependency for deployment.

Expected hosting cost: US$0/month for the current static workload. Static asset requests are free and unlimited. Workers Builds includes 3,000 build minutes/month on Free, with one concurrent build. Domain registration is separate. Do not upgrade to a paid plan unless requirements change.

Pricing verified 4 November 2026:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/

## Repository and automated builds

Repository: private [canaslan/canaslan.com](https://github.com/canaslan/canaslan.com), with production source on `main`. The local checkout uses this repository as `origin`. The owner completed the GitHub-to-Cloudflare connection on 5 November 2026; Git-triggered production and preview builds are being verified.

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

Once connected, Cloudflare's build integration supplies deployment credentials. Never commit API tokens or OAuth credentials. GitHub app authorization and Cloudflare account access must be completed by the owner.

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

Astro's production site URL is `https://canaslan.com`. The hostname is attached as a Worker Custom Domain in `wrangler.jsonc`. Cloudflare manages its DNS record and certificate. The zone was verified active before final release checks. No application data services are bound.

Live deployment created 5 November 2026:

- Production: https://canaslan.com
- Production Cloudflare alias: https://can-aslan.can-aslan.workers.dev
- Production version: `68c0731c-068c-4ce7-b4e7-3d3b8301e0e5`
- Preview: https://can-121-can-aslan.can-aslan.workers.dev
- Immutable preview: https://91eea5f0-can-aslan.can-aslan.workers.dev
- Preview deployment: `91eea5f0-7273-4aa4-9fc7-cd7564d2a277`
- Deployed site source: initial commit `c82ae3708c384cc71b56efe05a51f24fd971534c` (the subsequent configuration commit enables Previews and records the account and custom domain; page assets are the same).

## Release verification

For both the production URL and preview URL:

1. Open `/`, `/about/`, `/colophon/`, `/contact/`, `/principles/`, `/projects/`, `/readme/`, and `/research/` directly, including a fresh load on each route.
2. Check `/work.md`, CSS, icons, images, and `/can-aslan-cv.pdf`. Confirm the PDF opens and the View CV link still targets the established path.
3. Confirm an unknown route returns HTTP 404, rather than the home page.
4. Inspect `X-Robots-Tag` on preview HTML and the PDF; expect `noindex`. Check the production custom domain does not receive that header.
5. Check the deployed site on mobile and desktop, in light and dark themes, with keyboard focus and navigation.

Local validation completed on 4 November 2026: Astro production build; Wrangler dry run (50 asset files); local Cloudflare HTTP checks for all seven pages, Markdown, CSS, favicon, a 404, and a byte-identical CV PDF. Local HTTPS checks verified `noindex` on two representative workers.dev hosts and no indexing header on `canaslan.com`. Remote deployments, real preview hostnames, Git integration, domain attachment, and deployed browser QA remain unverified.

## Verification — 5 November 2026

The current production build passes with eight pages (including Colophon), `/work.md`, and 51 static asset files. Wrangler deployment dry run passes. A limited scan of source files found no private-key blocks or common GitHub/OpenAI token patterns. Git marks the CV PDF as binary; local credential files and generated output are excluded from version control.

Live production and the named Preview each passed 40 HTTP checks covering every built page and asset plus an unknown-route 404. The CV PDF matches the source bytes on both hosts. Preview responses include `X-Robots-Tag: noindex`; production custom-domain responses do not.

The local resolver still cached the previous empty DNS answer during verification. Production was checked with curl `--resolve` using `104.21.34.133`, returned by the authoritative Cloudflare nameserver, with normal TLS certificate verification enabled. Normal resolver propagation must be rechecked. The named Preview resolved normally and passed HTTPS checks. Public recursive resolvers `1.1.1.1` and `8.8.8.8` also return the correct production addresses, and the production Cloudflare alias now passes HTTPS.

Wrangler is authorized as `hello@canaslan.com` in account `6472e6c2b1616c065c24ac87e4581486`. GitHub is authorized as `canaslan` using the official GitHub CLI. Cloudflare MCP has identity/account access, but lacks Workers and DNS scopes. The Workers Builds API also denied the CLI authorization (HTTP 403), so Git-connected builds still need dashboard authorization/configuration.

The owner has completed the dashboard connection step. Remaining: verify Git-triggered production and branch builds, verify normal production DNS resolution, and complete mobile/desktop browser QA in both themes. Browser access was unavailable during this session. No rollback drill has been run; this is the first production version.

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
