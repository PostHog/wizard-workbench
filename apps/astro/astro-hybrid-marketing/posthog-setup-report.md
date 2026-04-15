<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI Astro hybrid marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using `is:inline` and `define:vars` to inject environment variables at build time. Placed in the `<head>` via the layout.
- **`src/layouts/Layout.astro`** (edited): Imported `PostHog` component and added `<PostHog />` inside `<head>`, so every page gets client-side tracking automatically.
- **`src/lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event tracking. Exports `getPostHogServer()` and `shutdownPostHog()`.
- **`src/pages/api/contact.ts`** (edited): Server-side tracking of `contact_form_submitted` and `contact_form_error` events using the posthog-node singleton. Reads `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers for session correlation.
- **`src/pages/contact.astro`** (edited): Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the contact API for session correlation. Adds `captureException` on network errors.
- **`src/pages/index.astro`** (edited): Tracks `cta_clicked` and `contact_sales_clicked` events on hero CTA button clicks.
- **`src/pages/pricing.astro`** (edited): Tracks `pricing_plan_selected` event with the plan name when a pricing card CTA is clicked.
- **`src/pages/features.astro`** (edited): Tracks `features_page_viewed` event on page load (top of conversion funnel).
- **`src/components/Navigation.astro`** (edited): Tracks `nav_get_started_clicked` event when the nav CTA is clicked.
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set as environment variables.

## Events

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked 'Start Free Trial' in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA on the pricing page (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `features_page_viewed` | User viewed the features page (top of conversion funnel) | `src/pages/features.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | Contact form successfully submitted (server-side) | `src/pages/api/contact.ts` |
| `contact_form_error` | Contact form submission failed with reason (server-side) | `src/pages/api/contact.ts` |

## Next steps

We recommend building the following insights in your PostHog project to track business performance:

- **Conversion Funnel** — `features_page_viewed` → `pricing_plan_selected` → `contact_form_submitted`: [Create in PostHog](https://us.posthog.com/project/2/insights/new)
- **CTA Click Trends** — trend of `cta_clicked` and `contact_sales_clicked` over time: [Create in PostHog](https://us.posthog.com/project/2/insights/new)
- **Pricing Plan Selections** — breakdown of `pricing_plan_selected` by `plan` property: [Create in PostHog](https://us.posthog.com/project/2/insights/new)
- **Contact Form Submissions** — trend of `contact_form_submitted` vs `contact_form_error`: [Create in PostHog](https://us.posthog.com/project/2/insights/new)
- **Navigation CTAs** — trend of `nav_get_started_clicked`: [Create in PostHog](https://us.posthog.com/project/2/insights/new)

Add all five to an "Analytics basics" dashboard: [View Dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
