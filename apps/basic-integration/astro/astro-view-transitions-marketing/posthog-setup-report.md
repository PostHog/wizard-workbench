<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog initialization component using the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during Astro View Transitions (ClientRouter) soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking on soft navigation. Token and host are injected via `define:vars` from environment variables.
- **`src/layouts/Layout.astro`**: Added `<PostHog />` component import and render inside `<head>`, ensuring PostHog loads on every page.
- **`src/pages/index.astro`**: Added `start_free_trial_clicked` and `read_docs_clicked` events on the hero section CTAs using `astro:page-load` + `DOMContentLoaded` for View Transitions compatibility.
- **`src/pages/pricing.astro`**: Added `pricing_viewed` on page load (top of conversion funnel), `pricing_plan_selected` (with `plan` property) on Starter/Pro plan CTAs, and `contact_sales_clicked` on the Enterprise CTA.
- **`src/components/Navigation.astro`**: Added `get_started_clicked` on the nav bar CTA.
- **`src/pages/docs.astro`**: Added `docs_section_clicked` (with `section` property) on each documentation section card.
- **`.env`** (new/updated): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set with correct values.

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `get_started_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `pricing_viewed` | User views the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (Starter or Pro). Includes `plan` property | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise pricing tier | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card. Includes `section` property | `src/pages/docs.astro` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights to monitor user behavior and conversion:

1. **Trial signups funnel** — Funnel from `pricing_viewed` → `pricing_plan_selected` → `start_free_trial_clicked`. Shows your pricing-to-trial conversion rate.
2. **CTA clicks over time** — Trends chart for `start_free_trial_clicked`, `get_started_clicked`, and `contact_sales_clicked` together. Shows overall acquisition intent.
3. **Pricing plan breakdown** — Trends for `pricing_plan_selected` broken down by the `plan` property (`starter` vs `pro`). Shows which plan resonates most.
4. **Docs engagement** — Trends for `docs_section_clicked` broken down by `section`. Shows which documentation content drives the most interest.
5. **Hero CTA vs Nav CTA** — Trends comparing `start_free_trial_clicked` and `get_started_clicked`. Shows which entry point converts best.

Create the dashboard here: [New dashboard](/dashboard#newDashboard=true)

View all events in [Data management](/data-management/events).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
