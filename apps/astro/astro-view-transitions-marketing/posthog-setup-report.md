<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The following changes were made:

- **`src/components/posthog.astro`** (new file): PostHog web snippet component with View Transitions support. Includes a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and uses `capture_pageview: 'history_change'` for automatic pageview tracking. Environment variables are passed via Astro's `define:vars` directive.
- **`src/layouts/Layout.astro`**: Imported and rendered `<PostHog />` inside `<head>` so analytics loads on every page wrapped by this layout.
- **`src/pages/index.astro`**: Tracks hero CTA clicks — `start_free_trial_clicked` and `hero_docs_cta_clicked`.
- **`src/components/Navigation.astro`**: Tracks `nav_get_started_clicked` when the top-nav CTA is clicked.
- **`src/pages/pricing.astro`**: Tracks `pricing_plan_cta_clicked` (with `plan_name` and `plan_price`) for Starter and Pro plans, and `contact_sales_clicked` for the Enterprise plan.
- **`src/pages/docs.astro`**: Tracks `docs_section_clicked` (with `section_name`) when a documentation section card is clicked.
- **`src/components/Footer.astro`**: Tracks `footer_nav_clicked` (with `link_name`) for all footer navigation links.
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set with correct values.

All scripts use `astro:page-load` alongside `DOMContentLoaded` to re-attach event listeners after View Transitions soft navigation.

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicks "Read the Docs" from the hero section | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the top navigation | `src/components/Navigation.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA on a pricing plan card (includes `plan_name`, `plan_price`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise pricing card | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card (includes `section_name`) | `src/pages/docs.astro` |
| `footer_nav_clicked` | User clicks a footer navigation link (includes `link_name`) | `src/components/Footer.astro` |

## Next steps

We've prepared insights and a dashboard for you to keep an eye on user behavior. Visit the links below to set up your "Analytics basics" dashboard in PostHog:

- [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboards) — create a new dashboard named "Analytics basics" and add the insights below
- [Conversion funnel: Hero → Pricing → Signup](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"$pageview","name":"$pageview","type":"events","order":0,"properties":[{"key":"$current_url","value":"/","operator":"icontains"}]},{"id":"$pageview","name":"$pageview","type":"events","order":1,"properties":[{"key":"$current_url","value":"/pricing","operator":"icontains"}]},{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events","order":2}]}) — tracks users from homepage → pricing page → plan CTA click
- [Trend: CTA clicks over time](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"start_free_trial_clicked","name":"start_free_trial_clicked","type":"events"},{"id":"nav_get_started_clicked","name":"nav_get_started_clicked","type":"events"},{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events"}]}) — compares hero, nav, and pricing CTA click volume
- [Trend: Contact sales vs plan signups](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"contact_sales_clicked","name":"contact_sales_clicked","type":"events"},{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events"}]}) — monitors enterprise vs self-serve conversion intent
- [Breakdown: Pricing plan preference](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events","breakdown":"plan_name","breakdown_type":"event"}]}) — shows which pricing tier users are most drawn to
- [Trend: Docs engagement](https://us.posthog.com/project/238640/insights/new#{"insight":"TRENDS","events":[{"id":"docs_section_clicked","name":"docs_section_clicked","type":"events","breakdown":"section_name","breakdown_type":"event"}]}) — shows which documentation sections attract the most interest

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
