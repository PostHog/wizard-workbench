<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. PostHog is now initialized on every page via a reusable `src/components/posthog.astro` component included in the root `Layout.astro`. Six custom events have been instrumented across the most business-critical pages to track conversion intent, pricing interest, and documentation engagement.

## Changes made

### New files
- **`src/components/posthog.astro`** — PostHog web snippet component using `is:inline` and `define:vars` to safely inject environment variables at build time
- **`.env`** — `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables (gitignore-covered)

### Modified files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>` so all pages are instrumented automatically
- **`src/pages/index.astro`** — Tracks hero CTA clicks (`cta_clicked`, `docs_cta_clicked`)
- **`src/components/Navigation.astro`** — Tracks nav bar "Get Started" CTA clicks (`nav_cta_clicked`)
- **`src/pages/pricing.astro`** — Tracks pricing plan CTA clicks (`pricing_plan_clicked`) and Enterprise "Contact Sales" clicks (`enterprise_contact_sales_clicked`)
- **`src/pages/docs.astro`** — Tracks documentation section card clicks (`docs_section_clicked`)

## Instrumented events

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the 'Read the Docs' secondary CTA in the hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA button (Starter or Pro) | `src/pages/pricing.astro` |
| `enterprise_contact_sales_clicked` | User clicks the 'Contact Sales' button on the Enterprise pricing tier | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |

## Next steps

To build a dashboard for these events, go to your PostHog project and create a new dashboard named "Analytics basics" with insights like:

- **CTA Conversion Funnel** — Funnel: `$pageview` (home) → `cta_clicked`
- **All CTA clicks over time** — Trend: `cta_clicked` + `nav_cta_clicked` + `docs_cta_clicked` by day
- **Pricing plan interest** — Trend: `pricing_plan_clicked` broken down by `plan` property
- **Enterprise sales intent** — Trend: `enterprise_contact_sales_clicked` over time
- **Docs section engagement** — Trend: `docs_section_clicked` broken down by `section` property

Visit your PostHog project: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
