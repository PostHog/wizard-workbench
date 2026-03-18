# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog web snippet component using `define:vars` to pass environment variables from Astro. Uses `is:inline` to prevent TypeScript errors.
- **`src/layouts/Layout.astro`** (updated): Imports and includes the `<PostHog />` component in `<head>`, ensuring all pages are tracked.
- **`src/lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event tracking in API routes.
- **`src/pages/api/contact.ts`** (updated): Server-side events for contact form success and failure, with session/user correlation via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers.
- **`src/pages/index.astro`** (updated): Client-side events on hero CTA buttons.
- **`src/pages/pricing.astro`** (updated): Client-side events on pricing plan CTA buttons with plan name as a property.
- **`src/pages/contact.astro`** (updated): Client-side form submission event, passes session and distinct ID headers to the API, and captures network errors with `captureException`.
- **`src/components/Navigation.astro`** (updated): Client-side event on the nav "Get Started" CTA.
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" in hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" in hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a plan CTA (with `plan` property: starter/pro) | `src/pages/pricing.astro` |
| `contact_sales_from_pricing_clicked` | User clicked "Contact Sales" from Enterprise pricing card | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form accepted by server (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form rejected by server (server-side) | `src/pages/api/contact.ts` |
| `get_started_nav_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Contact form conversion funnel** — `contact_form_submitted` → `contact_form_succeeded` (measures drop-off between submission and server success)
2. **CTA click trends** — Trend of `cta_clicked` and `contact_sales_clicked` over time (top-of-funnel engagement)
3. **Pricing plan interest** — Breakdown of `pricing_plan_clicked` by `plan` property (starter vs. pro)
4. **Enterprise sales intent** — Count of `contact_sales_from_pricing_clicked` (high-intent leads)
5. **Nav CTA engagement** — Trend of `get_started_nav_clicked` over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
