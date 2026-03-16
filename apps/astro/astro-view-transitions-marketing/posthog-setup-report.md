<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog web snippet component using `is:inline` to prevent Astro TypeScript processing. Wraps initialization in a `window.__posthog_initialized` guard to prevent stack overflow during View Transitions soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on client-side navigation. API key and host are read from environment variables.
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog is initialized on every page.
- **`src/pages/index.astro`** (edited): Tracks hero CTA clicks (`cta_clicked`, `docs_cta_clicked`).
- **`src/pages/pricing.astro`** (edited): Tracks pricing page view (`pricing_page_viewed`) and per-plan CTA clicks (`pricing_plan_clicked`, `contact_sales_clicked`).
- **`src/components/Navigation.astro`** (edited): Tracks nav bar "Get Started" CTA clicks (`nav_cta_clicked`).
- **`src/pages/docs.astro`** (edited): Tracks documentation section card clicks (`docs_section_clicked`).
- **`.env`** (created): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set for Astro's client-side env variable convention.

All event listener setup functions are registered on both `DOMContentLoaded` and `astro:page-load` to handle both initial loads and View Transitions soft navigations. Listeners are removed before re-adding to prevent duplicates during transitions.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked the "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked "Read the Docs" hero CTA | `src/pages/index.astro` |
| `pricing_page_viewed` | User viewed the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked a plan's CTA button (Starter or Pro) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card | `src/pages/docs.astro` |

## Next steps

To set up your "Analytics basics" dashboard, visit your PostHog project and create a new dashboard with the following recommended insights:

- **Pricing funnel**: Funnel from `pricing_page_viewed` → `pricing_plan_clicked` — tracks conversion through the pricing page
- **CTA engagement**: Trend of `cta_clicked` + `nav_cta_clicked` over time — tracks top-of-funnel interest
- **Plan breakdown**: Breakdown of `pricing_plan_clicked` by `plan` property — shows which plan resonates most
- **Docs engagement**: Breakdown of `docs_section_clicked` by `section` property — shows which docs topics are most popular
- **Enterprise interest**: Trend of `contact_sales_clicked` over time — tracks enterprise lead intent

[Create a new dashboard in PostHog →](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
