<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI marketing site. Here is a summary of all changes made:

- Created `src/components/posthog.astro` — PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during Astro View Transitions soft navigation. Configured with `capture_pageview: 'history_change'` for automatic pageview tracking on every client-side route change.
- Updated `src/layouts/Layout.astro` — Imported and rendered `<PostHog />` inside `<head>` so every page gets analytics automatically.
- Added event tracking to four pages/components using the `astro:page-load` + `DOMContentLoaded` dual-listener pattern required for View Transitions.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA button on the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the "Read the Docs" secondary CTA button on the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked "Get Started" or "Start Free Trial" on a pricing plan card | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing card | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA link in the navigation bar | `src/components/Navigation.astro` |
| `doc_section_clicked` | User clicked a documentation section card (e.g. Getting Started, API Reference) | `src/pages/docs.astro` |

## Next steps

We've prepared the following insights for your "Analytics basics" dashboard. You can create it in PostHog at:

**[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)**

Recommended insights to add:

1. **[Hero CTA Conversion — Trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `cta_clicked` and `docs_link_clicked` over time to track homepage conversion interest.

2. **[Pricing Funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)** — Funnel from `$pageview` (Pricing page) → `pricing_plan_clicked` to measure pricing page conversion rate.

3. **[Pricing Plan Breakdown](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Breakdown of `pricing_plan_clicked` by the `plan` property (Starter, Pro) to see which plan is most popular.

4. **[Contact Sales Clicks](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Trend of `contact_sales_clicked` events to track enterprise interest over time.

5. **[Docs Engagement Breakdown](https://us.posthog.com/project/2/insights/new?insight=TRENDS)** — Breakdown of `doc_section_clicked` by the `section` property to see which documentation sections are most visited.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
