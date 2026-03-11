<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro hybrid rendering). The following changes were made:

**New files created:**
- `src/components/posthog.astro` — Client-side PostHog initialization using the web snippet with `is:inline` directive and environment variables via `define:vars`
- `src/lib/posthog-server.ts` — Server-side PostHog singleton using `posthog-node`, following the recommended singleton pattern to avoid multiple client instances
- `.env` — Environment variables `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` (git-ignored)

**Modified files:**
- `src/layouts/Layout.astro` — Imports and renders `<PostHog />` in `<head>` so all pages receive client-side tracking
- `src/pages/index.astro` — Added `cta_clicked` and `contact_sales_clicked` events on hero buttons
- `src/pages/pricing.astro` — Added `pricing_plan_clicked` event on all three pricing plan CTAs, with `plan` and `price` properties
- `src/pages/contact.astro` — Added `contact_form_submitted` client-side event; passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API for session/user correlation; captures network errors via `captureException`
- `src/components/Navigation.astro` — Added `nav_cta_clicked` event on the "Get Started" nav CTA
- `src/pages/api/contact.ts` — Added server-side `contact_form_succeeded` and `contact_form_failed` events using `posthog-node`, reads `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to correlate client and server events

**Package installed:** `posthog-node` (server-side SDK)

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side, before server response) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Server-side: contact form processed successfully | `src/pages/api/contact.ts` |
| `contact_form_failed` | Server-side: contact form failed validation or server error | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To create an "Analytics basics" dashboard in PostHog, visit your PostHog project and create a new dashboard with these suggested insights:

1. **Hero CTA conversion funnel** — Funnel: `cta_clicked` → `contact_form_submitted` → `contact_form_succeeded`
2. **Pricing plan clicks breakdown** — Trends: `pricing_plan_clicked` broken down by `plan` property
3. **Contact form success rate** — Trends: `contact_form_submitted` vs `contact_form_succeeded` over time
4. **Nav vs hero CTA clicks** — Trends: compare `nav_cta_clicked`, `cta_clicked`, `contact_sales_clicked`
5. **Contact form failure reasons** — Trends: `contact_form_failed` broken down by `reason` property

Visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
