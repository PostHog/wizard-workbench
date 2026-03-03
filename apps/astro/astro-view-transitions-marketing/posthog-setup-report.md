<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro marketing site. The integration uses the PostHog JavaScript web snippet with proper View Transitions support, ensuring accurate pageview tracking during soft navigation and preventing stack overflow errors from the ClientRouter.

## Changes made

- **Created** `src/components/posthog.astro` — PostHog snippet with `window.__posthog_initialized` guard and `capture_pageview: 'history_change'` for automatic pageview tracking during soft navigation
- **Updated** `src/layouts/Layout.astro` — imported and mounted the PostHog component inside `<head>`, making it active on every page
- **Updated** `src/pages/index.astro` — added `cta_clicked` and `docs_cta_clicked` events on hero CTAs
- **Updated** `src/pages/pricing.astro` — added `pricing_page_viewed`, `pricing_plan_selected`, and `contact_sales_clicked` events
- **Updated** `src/components/Navigation.astro` — added `nav_get_started_clicked` event on the nav CTA
- **Updated** `src/pages/docs.astro` — added `docs_section_clicked` event with section name property
- **Created** `.env` — set `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables

## Instrumented events

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary 'Start Free Trial' CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked 'Read the Docs' in the hero section | `src/pages/index.astro` |
| `pricing_page_viewed` | User viewed the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a specific pricing plan (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked 'Get Started' in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, Integrations, etc.) | `src/pages/docs.astro` |

## Next steps

We recommend building the following insights in PostHog to monitor your key business metrics:

1. **Conversion Funnel** — Funnel: `pricing_page_viewed` → `pricing_plan_selected`
2. **Free Trial CTA Trend** — Trend: `cta_clicked` + `nav_get_started_clicked` over time
3. **Pricing Plan Breakdown** — Bar chart: `pricing_plan_selected` broken down by `plan` property
4. **Docs Engagement** — Trend: `docs_section_clicked` broken down by `section` property
5. **Enterprise Contact Sales** — Trend: `contact_sales_clicked` over time

To create these, go to **[PostHog → Insights](https://us.posthog.com/project/2/insights)** and use the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
