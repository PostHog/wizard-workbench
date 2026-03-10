<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions). The integration includes the PostHog JS snippet with a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, automatic pageview tracking via `capture_pageview: 'history_change'`, and custom event tracking across key conversion touchpoints.

## Files changed

| File | Changes |
|------|---------|
| `src/components/posthog.astro` | **Created** — PostHog initialization component with `is:inline` directive, `window.__posthog_initialized` guard, and `capture_pageview: 'history_change'` for view transitions |
| `src/layouts/Layout.astro` | Imported and added `<PostHog />` component to `<head>` so it's included on every page |
| `src/pages/index.astro` | Added `cta_clicked` and `docs_cta_clicked` event tracking on hero CTA buttons |
| `src/pages/pricing.astro` | Added `pricing_plan_selected` (with `plan` and `price_per_month` properties) and `contact_sales_clicked` event tracking on pricing cards |
| `src/pages/docs.astro` | Added `docs_section_clicked` event tracking (with `section` property) on documentation section cards |
| `src/components/Navigation.astro` | Added `nav_cta_clicked` event tracking on the navigation "Get Started" button |
| `.env` | Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked the primary 'Start Free Trial' CTA button on the hero section of the homepage | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the 'Read the Docs' secondary CTA button on the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan button (Starter, Pro, or Enterprise) on the pricing page | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the Enterprise pricing card | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked on a documentation section card (Getting Started, API Reference, Integrations, etc.) | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **CTA Conversion Funnel** — Funnel from `$pageview` (homepage) → `cta_clicked` → `pricing_plan_selected`
2. **Pricing Plan Selection Breakdown** — Trends of `pricing_plan_selected` broken down by `plan` property (starter, pro, enterprise)
3. **CTA Click Trends** — Line graph of `cta_clicked` + `nav_cta_clicked` over time to track acquisition intent
4. **Enterprise Contact Sales Rate** — Trends of `contact_sales_clicked` — a key churn/conversion signal for enterprise pipeline
5. **Docs Engagement** — Trends of `docs_section_clicked` broken down by `section` to understand what documentation users look for most

To build this dashboard, visit your [PostHog project](https://us.posthog.com/project/2/insights) and create a new dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
