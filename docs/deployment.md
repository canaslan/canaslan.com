# Cloudflare deployment

## Decision

Use Cloudflare Workers Static Assets on the Workers Free plan for this statically rendered Astro site. No server adapter, database, or runtime secrets are needed. `wrangler.jsonc` is the source of deployment configuration. Cloudflare's `cf init .` generated a Wrangler setup; this project uses its local Wrangler dependency for deployment.

Expected hosting cost: US$0/month for the current static workload. Static asset requests are free and unlimited. Workers Builds includes 3,000 build minutes/month on Free, with one concurrent build. Domain registration is separate. Do not upgrade to a paid plan unless requirements change.

Pricing verified 4 November 2026:

- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/

## Repository and automated builds

Proposed repository: private `canaslan.com` in the owner's GitHub account. It has not been created or connected yet. The local `main` branch contains the initial site baseline; no remote is configured yet.

After creating the repository and pushing the reviewed site to `main`, connect it in Cloudflare Workers & Pages using Workers Builds:

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

Cloudflare's build integration supplies deployment credentials. Never commit API tokens or OAuth credentials. GitHub app authorization and Cloudflare account access must be completed by the owner.

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

Astro's production site URL is `https://canaslan.com`. Attach that hostname as a Worker Custom Domain only after confirming the domain's Cloudflare zone and existing DNS/hosting configuration. This configuration does not change live DNS or an existing website. After the domain is attached, record the production deployment URL, preview URL, commit SHA, and deployed version ID here.

## Release verification

For both the production URL and preview URL:

1. Open `/`, `/about/`, `/colophon/`, `/contact/`, `/principles/`, `/projects/`, `/readme/`, and `/research/` directly, including a fresh load on each route.
2. Check `/work.md`, CSS, icons, images, and `/can-aslan-cv.pdf`. Confirm the PDF opens and the View CV link still targets the established path.
3. Confirm an unknown route returns HTTP 404, rather than the home page.
4. Inspect `X-Robots-Tag` on preview HTML and the PDF; expect `noindex`. Check the production custom domain does not receive that header.
5. Check the deployed site on mobile and desktop, in light and dark themes, with keyboard focus and navigation.

Local validation completed on 4 November 2026: Astro production build; Wrangler dry run (50 asset files); local Cloudflare HTTP checks for all seven pages, Markdown, CSS, favicon, a 404, and a byte-identical CV PDF. Local HTTPS checks verified `noindex` on two representative workers.dev hosts and no indexing header on `canaslan.com`. Remote deployments, real preview hostnames, Git integration, domain attachment, and deployed browser QA remain unverified.

## Connection check — 5 November 2026

The current production build passes with eight pages (including Colophon), `/work.md`, and 51 static asset files. Wrangler deployment dry run passes. A scan of the source found no private-key blocks or common GitHub/OpenAI token patterns; this is a limited check, not a full secrets audit.

Cloudflare MCP is authenticated as `hello@canaslan.com` and can list the account, but Workers and zone calls are denied because the connection lacks the required scopes. Wrangler has not yet been authorized. GitHub is not connected, and browser access is unavailable. Live deployment and repository integration remain pending these connections.

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
