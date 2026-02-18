<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. PostHog is now initialized on every page via a reusable `posthog.astro` component embedded in the shared `Layout.astro`. Six conversion-critical and engagement events have been instrumented across the key pages and navigation, covering the full marketing-to-trial funnel. Environment variables are stored in `.env` using Astro's `PUBLIC_` prefix convention and are never hardcoded.

## Changes made

### New files
- **`src/components/posthog.astro`** — PostHog web snippet component using `is:inline` and `define:vars` to safely inject `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables. Initializes PostHog on every page load.
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` set. Covered by `.gitignore`.

### Modified files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>` so analytics runs on all pages.
- **`src/pages/index.astro`** — Added `cta_clicked` tracking for the hero "Start Free Trial" and "Read the Docs" buttons.
- **`src/pages/pricing.astro`** — Added `pricing_plan_viewed` on page load; `cta_clicked` for Starter and Pro plan buttons; `contact_sales_clicked` for the Enterprise plan.
- **`src/pages/docs.astro`** — Added `docs_section_clicked` tracking for all six documentation section cards with `section` property.
- **`src/components/Navigation.astro`** — Added `nav_cta_clicked` tracking for the persistent "Get Started" nav CTA button.

## Event inventory

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a primary CTA button; includes `cta_label`, `plan`, `location`, `page` properties | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_viewed` | User viewed the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan — high-value lead signal | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a docs section card; includes `section` property (e.g. "Getting Started", "API Reference") | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the persistent "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Recommended PostHog dashboard: "Analytics basics"

Create a dashboard in PostHog at https://us.posthog.com/project/238460/dashboard with the following insights:

1. **CTA Conversion Funnel** — Funnel: `pricing_plan_viewed` → `cta_clicked` → `contact_sales_clicked`
2. **CTA Clicks by Location** — Trend of `cta_clicked` broken down by the `location` property
3. **Pricing Page Views vs CTA Clicks** — Trend comparing `pricing_plan_viewed` vs `cta_clicked` (page=pricing)
4. **Enterprise Sales Leads** — Trend of `contact_sales_clicked` over time
5. **Docs Engagement by Section** — Trend of `docs_section_clicked` broken down by `section` property

## Next steps

Once traffic flows to the site, head to your PostHog project to explore:

- **Funnels**: https://us.posthog.com/project/238460/insights/new?insight=FUNNELS — Build the `pricing_plan_viewed → cta_clicked → contact_sales_clicked` funnel to measure marketing conversion.
- **Trends**: https://us.posthog.com/project/238460/insights/new?insight=TRENDS — Chart `cta_clicked` over time, broken down by `plan` or `location` to see which CTAs perform best.
- **Session Replay**: https://us.posthog.com/project/238460/replay — Watch real user sessions to understand how visitors navigate the marketing site.
- **PostHog Project**: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
