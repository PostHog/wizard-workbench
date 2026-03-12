<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro marketing site (View Transitions mode).

## What was set up

- **`src/components/PostHog.astro`** — New PostHog snippet component using `is:inline` with a `window.__posthog_initialized` guard to prevent stack overflow during Astro's ClientRouter soft navigation. Configured with `capture_pageview: 'history_change'` for automatic pageview tracking on every view transition.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>`, so PostHog is active on every page.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` added (gitignore coverage ensured).

Event tracking scripts were added using `is:inline` and the `astro:page-load` event (in addition to `DOMContentLoaded`) so that listeners are re-registered correctly after each soft navigation.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the 'Start Free Trial' CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the 'Read the Docs' CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA button on a pricing plan (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |
| `features_viewed` | User viewed the features page — top of conversion funnel | `src/pages/features.astro` |

## Next steps

Dashboard and insight creation was skipped because the configured PostHog API key does not have `dashboard:write` or `insight:write` scopes. To create a dashboard manually, visit your PostHog project and add insights for these recommended views:

- **Trial CTA Conversion** — Trend of `cta_clicked` over time
- **Pricing Funnel** — Funnel: `features_viewed` → `pricing_plan_selected`
- **Pricing Plan Breakdown** — `pricing_plan_selected` broken down by the `plan` property
- **Contact Sales Clicks** — Trend of `contact_sales_clicked` over time
- **Docs Engagement** — `docs_section_clicked` broken down by `section` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
