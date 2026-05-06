<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site. The following changes were made:

- **Created** `src/components/posthog.astro` — PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Configured with `capture_pageview: 'history_change'` for automatic pageview tracking.
- **Updated** `src/layouts/Layout.astro` — Imported and rendered `<PostHog />` inside `<head>`, so all pages share a single initialization.
- **Updated** `src/pages/index.astro` — Tracks hero CTA button clicks.
- **Updated** `src/pages/pricing.astro` — Tracks clicks on each pricing plan CTA and the "Contact Sales" button.
- **Updated** `src/components/Navigation.astro` — Tracks the "Get Started" nav CTA.
- **Updated** `src/pages/docs.astro` — Tracks clicks on documentation section cards.
- **Created** `.env` — Stores `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` as environment variables (never hardcoded).

All event listener setup uses the `astro:page-load` event (in addition to `DOMContentLoaded`) so events re-attach correctly after soft navigation transitions.

## Events

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a CTA on the Starter or Pro pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card | `src/pages/docs.astro` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior. Click each link to open a pre-configured new insight:

- [Trial Conversion Funnel](https://us.posthog.com/project/2/insights/new) — Funnel: `$pageview` → `start_free_trial_clicked` (measures hero-to-trial conversion rate)
- [Pricing CTA Clicks Trend](https://us.posthog.com/project/2/insights/new) — Trend: `pricing_plan_clicked` broken down by `plan` property
- [Contact Sales Trend](https://us.posthog.com/project/2/insights/new) — Trend: `contact_sales_clicked` over time
- [Nav Get Started Clicks](https://us.posthog.com/project/2/insights/new) — Trend: `nav_get_started_clicked` over time
- [Docs Engagement](https://us.posthog.com/project/2/insights/new) — Trend: `docs_section_clicked` broken down by `section` property

Add all five to a new **"Analytics basics"** dashboard: [Create dashboard](https://us.posthog.com/project/2/dashboards/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
