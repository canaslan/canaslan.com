# Analytics

## Configuration

The site uses Umami Cloud for privacy-focused analytics. The production defaults are configured in `src/layouts/Layout.astro`:

- Script URL: `https://cloud.umami.is/script.js`
- Website ID: `089d048c-a81c-4e0b-8573-80696a869e39`

To migrate to another Umami website or a self-hosted instance, override both values in the build environment:

- `PUBLIC_UMAMI_SCRIPT_URL`: the complete tracker script URL supplied by the selected Umami instance.
- `PUBLIC_UMAMI_WEBSITE_ID`: the website ID supplied for `canaslan.com`.

The tracker is restricted to the exact `canaslan.com` hostname through Umami's `data-domains` setting, so localhost, `www`, and `workers.dev` previews do not enter production reporting. Search parameters and URL fragments are excluded, and supported Do Not Track preferences are respected.

## Measurement plan

Umami automatically records production page views. Custom events use lowercase kebab-case names and contain only non-personal context:

| Event | Trigger | Properties |
| --- | --- | --- |
| `cv-open` | Open the CV PDF from Work | `location=work` |
| `contact-book-call` | Open the booking link from Contact | `location=contact` |
| `contact-email` | Open the email link from Contact | `location=contact` |
| `contact-linkedin` | Open LinkedIn from Contact | `location=contact` |
| `service-enquiry` | Start an email enquiry from a service page | `service=<slug>`, `duration=<minutes>` |

Do not add names, email addresses, free-form message content, full mailto URLs, distinct IDs, or other personal data to event properties. Do not add query strings or fragments to analytics URLs.

## Production verification

After the apex site and Umami website are active:

1. Load one representative page and confirm one page view appears, without a duplicate request.
2. Trigger each event from its visible control and confirm the expected event name and allowed properties.
3. Confirm a `workers.dev` preview and localhost do not create production page views or events.
4. Check the browser network panel for tracker errors and record any ad-blocker limitation as expected client behavior.
5. Add the final visitor-facing privacy wording before marking analytics complete.

References:

- https://docs.umami.is/docs/add-a-website
- https://docs.umami.is/docs/collect-data
- https://docs.umami.is/docs/tracker-configuration
- https://docs.umami.is/docs/track-events
