<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site — an Astro application using View Transitions (ClientRouter). The integration tracks key user interactions across the marketing funnel, from landing page CTAs through pricing plan selection and documentation exploration.

## What was done

- **Installed `posthog-js`** as a project dependency
- **Created `src/components/posthog.astro`** — a dedicated PostHog initialization component using the `is:inline` + `define:vars` pattern to safely inject environment variables into a client-side snippet. The component uses a `window.__posthog_initialized` guard to prevent re-initialization during Astro View Transitions, and sets `capture_pageview: 'history_change'` for automatic SPA-style pageview tracking
- **Updated `src/layouts/Layout.astro`** — imported and mounted the `<PostHog />` component in the `<head>` after `<ViewTransitions />`, ensuring it loads on every page
- **Updated `.env`** — added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables
- **Added 5 custom event tracking scripts** across pages and components, each using both `DOMContentLoaded` and `astro:page-load` listeners to correctly re-bind handlers after View Transitions soft navigations

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | Fired when the hero "Start Free Trial" CTA button is clicked | `src/pages/index.astro` |
| `docs_cta_clicked` | Fired when the hero "Read the Docs" button is clicked on the home page | `src/pages/index.astro` |
| `pricing_plan_selected` | Fired when a user clicks "Get Started", "Start Free Trial", or "Contact Sales" on a pricing plan (includes `plan`, `price`, and `cta_text` properties) | `src/pages/pricing.astro` |
| `nav_cta_clicked` | Fired when the "Get Started" CTA in the top navigation is clicked | `src/components/Navigation.astro` |
| `docs_section_clicked` | Fired when a user clicks on a documentation section card (includes `section` property, e.g. "Getting Started", "API Reference") | `src/pages/docs.astro` |

## Next steps

We've designed 5 insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. To set them up in PostHog, navigate to your project and create an **"Analytics basics"** dashboard with the following insights:

1. **Hero CTA Conversion Trend** — Trends chart tracking `cta_clicked` and `docs_cta_clicked` daily over 30 days. Shows which hero CTA drives more engagement.

2. **Pricing Plan Selection Funnel** — Funnel from pageview → `pricing_plan_selected`, broken down by `plan` property. Reveals which plans attract the most clicks and where users drop off.

3. **Pricing Plan Clicks by Plan** — Bar chart of `pricing_plan_selected` events grouped by `plan` property (Starter / Pro / Enterprise). Tracks relative interest in each plan.

4. **Navigation vs. Hero CTA Comparison** — Trends chart comparing `nav_cta_clicked` vs `cta_clicked` daily. Shows whether the nav or hero drives more "Get Started" intent.

5. **Docs Section Engagement** — Bar chart of `docs_section_clicked` events broken down by `section` property. Identifies which documentation sections users find most valuable.

You can create these in PostHog at: **https://us.posthog.com/project/2/dashboards**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
