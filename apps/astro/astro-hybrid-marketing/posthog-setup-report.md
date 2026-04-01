<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro hybrid marketing site. The integration covers both client-side and server-side event tracking.

**What was set up:**

- `src/components/posthog.astro` — PostHog web snippet component, initialized via environment variables with `is:inline` to prevent Astro TypeScript processing errors.
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event capture in API routes.
- `src/layouts/Layout.astro` — Updated to import and render `<PostHog />` in the `<head>`, enabling analytics on every page.
- `src/pages/index.astro` — Client-side tracking for hero CTA clicks (`cta_clicked`, `contact_sales_clicked`).
- `src/pages/pricing.astro` — Client-side tracking for pricing plan CTA clicks (`pricing_plan_clicked`) with plan name and price properties.
- `src/components/Navigation.astro` — Client-side tracking for the nav "Get Started" CTA (`nav_cta_clicked`).
- `src/pages/contact.astro` — Client-side tracking for contact form submissions (`contact_form_submitted`), with PostHog session ID and distinct ID passed to the server via headers for session correlation.
- `src/pages/api/contact.ts` — Server-side tracking using `posthog-node` for successful submissions (`contact_form_succeeded`) and failures (`contact_form_failed`) with reason properties. Session and distinct IDs are read from request headers to correlate with client events.
- `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables configured.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | User submits the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission processed successfully (server-side) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form submission failed validation or encountered an error (server-side) | `src/pages/api/contact.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Contact form conversion funnel** — Funnel from `contact_form_submitted` → `contact_form_succeeded` to measure drop-off.
2. **CTA click trends** — Trend of `cta_clicked` and `contact_sales_clicked` over time to gauge top-of-funnel interest.
3. **Pricing plan interest breakdown** — Breakdown of `pricing_plan_clicked` by `plan` property to see which plan gets the most interest.
4. **Nav CTA engagement** — Trend of `nav_cta_clicked` to measure navigation CTA effectiveness.
5. **Contact form failure reasons** — Breakdown of `contact_form_failed` by `reason` property to identify common validation issues.

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
