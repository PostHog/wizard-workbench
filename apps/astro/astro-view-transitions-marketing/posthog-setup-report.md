<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site.

## What was done

- **Installed** `posthog-js` as a dependency.
- **Created** `src/components/posthog.astro` — a reusable PostHog initialization component that uses the `is:inline` directive to avoid TypeScript processing, wraps initialization in a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking.
- **Updated** `src/layouts/Layout.astro` — imported and mounted the `<PostHog />` component in the `<head>`, so analytics are available across all pages.
- **Added event tracking** to four files covering the key conversion and engagement touchpoints.
- **Configured** environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `trial_started` | User clicked "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked "Read the Docs" in the hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicked a Starter or Pro pricing plan CTA (includes `plan` and `price_usd` properties) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card (includes `section` property) | `src/pages/docs.astro` |

## Next steps

Visit your PostHog project to explore the data as it comes in:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Insights Explorer](https://us.posthog.com/project/238460/insights)

Suggested insights to create manually:

1. **Trial Conversion Funnel** — Funnel: `$pageview` → `trial_started` → `pricing_plan_selected`
2. **CTA Clicks Over Time** — Trend: `trial_started` + `nav_cta_clicked` combined
3. **Pricing Plan Breakdown** — `pricing_plan_selected` broken down by `plan` property
4. **Enterprise Pipeline** — `contact_sales_clicked` over time
5. **Docs Engagement by Section** — `docs_section_clicked` broken down by `section` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
