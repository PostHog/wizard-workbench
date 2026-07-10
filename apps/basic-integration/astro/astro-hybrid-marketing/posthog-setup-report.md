# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new) — Client-side PostHog snippet using `is:inline` to prevent Astro TypeScript processing. Initialises PostHog via the snippet loader with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` env vars.
- **`src/layouts/Layout.astro`** (edited) — Imports and renders `<PostHog />` inside `<head>` so analytics loads on every page.
- **`src/lib/posthog-server.ts`** (new) — Singleton `getPostHogServer()` function for the `posthog-node` server-side client. Configured with `flushAt: 1` and `flushInterval: 0` for immediate event flushing from serverless-style API routes.
- **`src/pages/index.astro`** (edited) — Added `is:inline` script that fires `hero_cta_clicked` with `cta_text` and `cta_type` properties when the "Start Free Trial" or "Contact Sales" hero buttons are clicked.
- **`src/pages/pricing.astro`** (edited) — Added `data-plan` and `data-cta` attributes to each pricing card CTA, plus an `is:inline` script that fires `pricing_plan_clicked` with `plan` and `cta_text` properties.
- **`src/pages/contact.astro`** (edited) — On form submit, fires `contact_form_submitted` (with `interest` and `has_company` properties) and passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API route for session correlation.
- **`src/pages/api/contact.ts`** (edited) — Imports `getPostHogServer`, reads the session/distinct ID headers, and fires `contact_form_received` server-side on success. Captures exceptions via `posthog.captureException()` in the error handler.
- **`.env`** (created) — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written by the wizard-tools MCP; `.gitignore` coverage ensured automatically.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary or secondary CTA button in the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks the CTA button on a pricing plan card | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form on the contact page | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully receives and validates the contact form submission | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829137)
- **Insight 1** — [Total hero CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/BlRVSTst) — bold-number KPI for top-of-funnel engagement over 30 days
- **Insight 2** — [Hero CTA clicks by type (wizard)](https://us.posthog.com/project/483112/insights/O9Brqrfn) — bar chart breaking down clicks by primary vs secondary CTA
- **Insight 3** — [Pricing plan clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/Ym0Sw5Ro) — bar chart showing which pricing tier (Starter/Pro/Enterprise) drives the most clicks
- **Insight 4** — [Contact form submissions over time (wizard)](https://us.posthog.com/project/483112/insights/WOrWKXg3) — daily line chart of inbound contact requests
- **Insight 5** — [Contact form conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/aCNxdG6Y) — two-step funnel from client submission to server receipt; a drop-off here indicates a broken API or network issue

Dashboard subscription and alerts were not configured (the wizard_ask tool was unavailable). You can set these up manually from the dashboard in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Check the PostHog dashboard subscription and alert(s) — consider setting up a weekly email digest and a daily alert on the contact form conversion funnel from the dashboard settings in PostHog.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
