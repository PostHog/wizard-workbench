<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site.

**What was done:**

- Created `src/components/posthog.astro` — a reusable PostHog initialization component using the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on every route change.
- Updated `src/layouts/Layout.astro` — imported the PostHog component and added it inside `<head>`, ensuring it is present on every page.
- Added event tracking to 4 pages/components using `is:inline` scripts with `astro:page-load` listeners for correct behavior under view transitions.
- Environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are stored in `.env` and referenced via `import.meta.env` — no tokens are hardcoded.

| Event | Description | File |
|---|---|---|
| `trial_started` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter or Pro); includes `plan_name` and `plan_price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" button in the top navigation | `src/components/Navigation.astro` |
| `doc_section_clicked` | User clicks a documentation section card; includes `section_name` property | `src/pages/docs.astro` |

## Next steps

To monitor these events, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Trial conversion funnel** — Funnel from `$pageview` → `pricing_plan_clicked` → `trial_started`, to measure homepage-to-trial conversion rate.
2. **Trial starts over time** — Trend chart for `trial_started` to track growth in trial signups.
3. **Pricing plan breakdown** — Bar chart of `pricing_plan_clicked` broken down by `plan_name` to see which plans attract the most interest.
4. **Contact sales requests** — Trend of `contact_sales_clicked` to track enterprise demand.
5. **Docs engagement by section** — Bar chart of `doc_section_clicked` broken down by `section_name` to identify most-visited documentation topics.

Navigate to [PostHog → Dashboards](https://us.i.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
