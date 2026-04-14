<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow AI Astro (View Transitions) marketing site. Here's a summary of everything that was set up:

**What was done:**
- Installed `posthog-js` as a dependency.
- Created `src/components/posthog.astro` — a reusable PostHog initialization component that uses a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro ClientRouter soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking.
- Updated `src/layouts/Layout.astro` — imported the PostHog component and added it to the `<head>`, so every page in the site is automatically instrumented.
- Added event tracking scripts (using `astro:page-load` + `DOMContentLoaded` for view transition compatibility) to four files.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Get Started / Start Free Trial / Contact Sales); includes `plan` property (starter / pro / enterprise) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card; includes `section` property (getting-started / api-reference / integrations / workflows / security / faq) | `src/pages/docs.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **CTA Clicks over time** — Trends chart for `cta_clicked` and `nav_cta_clicked` to monitor top-of-funnel engagement.
2. **Pricing Plan Interest** — Trends chart for `pricing_plan_clicked` broken down by the `plan` property to see which plan attracts the most interest.
3. **Docs Section Engagement** — Trends chart for `docs_section_clicked` broken down by the `section` property to understand which docs content is most popular.
4. **Hero CTA vs Docs CTA** — Trends chart comparing `cta_clicked` vs `docs_cta_clicked` to understand whether visitors are conversion-ready or still exploring.
5. **Conversion Funnel** — Funnel insight from `$pageview` (where `$current_url` contains `/pricing`) → `pricing_plan_clicked` to measure pricing page conversion.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
