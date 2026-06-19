# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): PostHog JavaScript snippet component using `is:inline` and `define:vars` to inject environment variables, initializing the client-side SDK.
- **`src/layouts/Layout.astro`** (modified): Imported and rendered `<PostHog />` in the `<head>` so analytics loads on every page.
- **`src/lib/posthog-server.ts`** (new): Singleton pattern for the `posthog-node` server-side client, used in API routes.
- **`src/pages/index.astro`** (modified): Added `data-cta` attributes to hero CTA buttons and an inline script that fires `cta_clicked` with `cta_name` and `location` properties on click.
- **`src/pages/pricing.astro`** (modified): Added `data-plan` and `data-price` attributes to pricing plan buttons and an inline script that fires `pricing_plan_clicked` with `plan` and `price` properties on click.
- **`src/pages/contact.astro`** (modified): Passes the PostHog session ID via `X-PostHog-Session-Id` header on form submission, captures `contact_form_submitted` with `interest` and `has_company` properties on success, and calls `captureException` on network errors.
- **`src/pages/api/contact.ts`** (modified): Uses `getPostHogServer()` to fire a server-side `contact_form_submitted` event with the `distinctId` set to the user's email, correlated to the browser session via `$session_id`.
- **`.env`** (updated): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables written.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks a primary CTA button on the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a CTA button on one of the pricing plan cards | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_submitted` | Contact form submission received and validated server-side | `src/pages/api/contact.ts` |

## Next steps

A PostHog dashboard could not be auto-created in this run because the CI environment's API key does not have `dashboard:write` scope. You can build these insights manually in PostHog:

- **CTA conversion trend**: Trend of `cta_clicked` over time, broken down by `cta_name` (start_free_trial vs contact_sales)
- **Pricing plan interest**: Breakdown of `pricing_plan_clicked` by `plan` (starter / pro / enterprise)
- **Contact funnel**: Funnel from `cta_clicked` → `pricing_plan_clicked` → `contact_form_submitted`
- **Contact form submissions trend**: Trend of `contact_form_submitted` (server-side, `source = api`) over time
- **Contact intent breakdown**: Breakdown of `contact_form_submitted` by `interest` property

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
