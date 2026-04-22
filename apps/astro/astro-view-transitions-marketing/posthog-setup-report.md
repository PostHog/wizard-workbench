<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site for NeuralFlow AI.

**Changes made:**

- Created `src/components/posthog.astro`: A reusable PostHog initialization component using the web snippet with an `is:inline` script. Includes a `window.__posthog_initialized` guard to prevent stack overflow errors during View Transitions soft navigation, and sets `capture_pageview: 'history_change'` for automatic pageview tracking on every route change.
- Updated `src/layouts/Layout.astro`: Imported and rendered the `<PostHog />` component inside `<head>`, so all pages receive analytics automatically.
- Added event tracking to `src/pages/index.astro`: Captures `free_trial_started` (hero "Start Free Trial" click) and `docs_link_clicked` (hero "Read the Docs" click) using `astro:page-load` + `DOMContentLoaded` listeners for correct View Transitions behavior.
- Added event tracking to `src/pages/pricing.astro`: Captures `pricing_plan_clicked` (with `plan` and `price` properties) for Starter and Pro plan CTAs, and `contact_sales_clicked` for the Enterprise card.
- Added event tracking to `src/pages/docs.astro`: Captures `docs_section_clicked` (with `section` property) on each documentation card click.
- Added event tracking to `src/components/Navigation.astro`: Captures `nav_get_started_clicked` on the nav CTA.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event | Description | File |
|-------|-------------|------|
| `free_trial_started` | User clicks 'Start Free Trial' CTA in the homepage hero | `src/pages/index.astro` |
| `docs_link_clicked` | User clicks 'Read the Docs' link in the homepage hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing CTA (Starter or Pro plan), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks 'Contact Sales' on the Enterprise pricing card | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card, with `section` name property | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To build insights in PostHog, visit your project and create a dashboard named **"Analytics basics"** with the following suggested insights:

1. **Free trial conversion funnel** — Funnel from `$pageview` (home) → `free_trial_started` or `pricing_plan_clicked`
2. **Pricing plan breakdown** — Trends of `pricing_plan_clicked` broken down by `plan` property (starter vs. pro)
3. **Contact sales leads** — Trend of `contact_sales_clicked` over time
4. **Docs engagement** — Trends of `docs_section_clicked` broken down by `section` property
5. **Nav vs. hero CTA comparison** — Trend comparing `nav_get_started_clicked` vs. `free_trial_started`

Log in to your PostHog project at https://us.i.posthog.com to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
