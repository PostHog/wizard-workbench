<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site for NeuralFlow AI.

**What was done:**

- Created `src/components/posthog.astro` — a reusable PostHog initialization component using the web snippet with an `is:inline` directive. Includes a `window.__posthog_initialized` guard to prevent stack overflow errors during soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking as users navigate between pages.
- Updated `src/layouts/Layout.astro` — imported and added `<PostHog />` inside `<head>`, alongside `<ViewTransitions />`, so all pages are covered.
- Added event tracking to four files using `is:inline` scripts that listen on both `DOMContentLoaded` and `astro:page-load` (for soft navigation support), and remove listeners before re-adding to prevent duplicate handlers.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked 'Start Free Trial' in the hero section (`cta: start_free_trial, location: hero`) | `src/pages/index.astro` |
| `cta_clicked` | User clicked 'Read the Docs' in the hero section (`cta: read_docs, location: hero`) | `src/pages/index.astro` |
| `cta_clicked` | User clicked 'Get Started' in the navigation bar (`cta: get_started, location: nav`) | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicked the Starter plan CTA (`plan: starter, price: 29`) | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked the Pro plan CTA (`plan: pro, price: 99`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise plan (`plan: enterprise`) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a docs section card (`section: <section-name>`) | `src/pages/docs.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key user behavior:

1. **CTA Conversion Funnel** — Funnel from `cta_clicked` → `pricing_plan_selected` to measure how many visitors who click a CTA go on to select a pricing plan.
2. **Pricing Plan Breakdown** — Bar chart of `pricing_plan_selected` broken down by the `plan` property (`starter` vs `pro`) to see which plan is most popular.
3. **CTA Clicks Over Time** — Trend of `cta_clicked` events over time, broken down by `cta` property, to track marketing effectiveness.
4. **Contact Sales Clicks** — Trend of `contact_sales_clicked` to measure enterprise interest.
5. **Docs Engagement** — Bar chart of `docs_section_clicked` broken down by `section` to see which documentation areas users find most useful.

Create your dashboard here: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
