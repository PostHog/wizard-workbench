<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Astro static marketing site. The integration uses the PostHog web snippet via a reusable `posthog.astro` component loaded in the shared `Layout.astro`, ensuring analytics are active on every page. Six custom events were added across four files to track the most business-critical user interactions: trial signups, pricing engagement, documentation discovery, and navigation CTAs.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked "Get Started" or "Start Free Trial" on a pricing plan card (includes `plan` property: `starter` or `pro`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (includes `section` property with the section title) | `src/pages/docs.astro` |

## Files created or modified

- **Created**: `src/components/posthog.astro` — PostHog web snippet component using `is:inline`
- **Modified**: `src/layouts/Layout.astro` — imports and renders `<PostHog />` in `<head>`
- **Modified**: `src/pages/index.astro` — `cta_clicked`, `docs_cta_clicked`
- **Modified**: `src/pages/pricing.astro` — `pricing_plan_clicked`, `contact_sales_clicked`
- **Modified**: `src/components/Navigation.astro` — `nav_cta_clicked`
- **Modified**: `src/pages/docs.astro` — `docs_section_clicked`
- **Created**: `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

## Next steps

To visualize user behavior from these events, create an **"Analytics basics"** dashboard in PostHog at [https://us.i.posthog.com/project/2/dashboards](https://us.i.posthog.com/project/2/dashboards) with the following suggested insights:

1. **CTA & Nav clicks over time** — Trend chart for `cta_clicked`, `nav_cta_clicked`, `docs_cta_clicked` to see top-of-funnel engagement
2. **Pricing plan interest funnel** — Funnel from any page visit → `pricing_plan_clicked` or `contact_sales_clicked` to measure pricing page conversion
3. **Pricing plan breakdown** — Bar/pie chart of `pricing_plan_clicked` broken down by the `plan` property to see Starter vs Pro interest
4. **Docs section popularity** — Bar chart of `docs_section_clicked` broken down by the `section` property to see which docs are most visited
5. **Enterprise intent** — Trend for `contact_sales_clicked` to monitor enterprise lead interest

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
