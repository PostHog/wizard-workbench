<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). Here's a summary of all changes made:

**New files created:**
- `src/components/posthog.astro` — PostHog web snippet component using `is:inline` + `define:vars` for safe env-var injection. Included in every page via the shared Layout.
- `src/lib/posthog-server.ts` — Singleton pattern for the `posthog-node` server-side client, used by API routes to avoid creating multiple instances.

**Modified files:**
- `src/layouts/Layout.astro` — Imports and renders `<PostHog />` inside `<head>` so every page initialises PostHog.
- `src/components/Navigation.astro` — Tracks `get_started_clicked` when the nav CTA is clicked.
- `src/pages/index.astro` — Tracks `cta_clicked` (Start Free Trial) and `contact_sales_clicked` (Contact Sales) on the hero section.
- `src/pages/pricing.astro` — Tracks `pricing_plan_clicked` for each plan button, with `plan` and `plan_price` properties.
- `src/pages/contact.astro` — Tracks `contact_form_submitted` on success; captures exceptions on failure; passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the server.
- `src/pages/api/contact.ts` — Tracks `contact_form_received` server-side via `posthog-node`, correlating client session via the session ID header.

**Environment:**
- `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set and `.gitignore`-covered.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" hero button | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter / Pro / Enterprise) | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicked the "Get Started" button in the nav | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form submitted successfully (client-side) | `src/pages/contact.astro` |
| `contact_form_received` | Contact form processed successfully (server-side) | `src/pages/api/contact.ts` |

## Next steps

We recommend building the following insights in PostHog to monitor user behaviour based on these events:

1. **Marketing-to-contact funnel** — Funnel insight: `cta_clicked` → `contact_form_submitted` → `contact_form_received`
   [Create this insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **CTA clicks over time** — Trend of `cta_clicked` and `contact_sales_clicked` to measure top-of-funnel engagement
   [Create this insight](https://us.posthog.com/project/2/insights/new#trends)

3. **Pricing plan interest breakdown** — `pricing_plan_clicked` broken down by `plan` property to see which tier attracts most interest
   [Create this insight](https://us.posthog.com/project/2/insights/new#trends)

4. **Navigation CTA engagement** — Trend of `get_started_clicked` to track nav-level intent
   [Create this insight](https://us.posthog.com/project/2/insights/new#trends)

5. **Contact form conversion rate** — `contact_form_submitted` unique users vs total sessions, tracking form completion rates
   [Create this insight](https://us.posthog.com/project/2/insights/new#trends)

You can collect these into an **"Analytics basics"** dashboard at:
[https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
