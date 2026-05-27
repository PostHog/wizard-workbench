<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro (View Transitions) marketing site for NeuralFlow AI.

## Changes made

- **`src/components/posthog.astro`** *(new)* — PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during ClientRouter soft navigation. Reads token and host from environment variables. Configured with `capture_pageview: 'history_change'` for automatic pageview tracking across view transitions.
- **`src/layouts/Layout.astro`** — Imported and rendered `<PostHog />` in `<head>` so all pages are instrumented.
- **`src/components/Navigation.astro`** — Tracks `get_started_clicked` on the nav CTA. Uses named handler with remove-then-add pattern for safe re-attachment after soft navigation.
- **`src/pages/index.astro`** — Tracks `start_free_trial_clicked` (hero CTA) and `read_docs_clicked` (docs CTA). Both use named handlers for deduplication.
- **`src/pages/pricing.astro`** — Tracks `pricing_plan_selected` (all three plan CTAs with `plan` property) and `contact_sales_clicked` (Enterprise plan).
- **`src/pages/docs.astro`** — Tracks `docs_section_clicked` (all six section cards with `section` property).
- **`.env`** *(new)* — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables set and gitignored.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `get_started_clicked` | User clicks "Get Started" in the main navigation | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicks a CTA on the pricing page (includes `plan`: starter, pro, or enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a docs section card (includes `section`: getting_started, api_reference, integrations, workflows, security, faq) | `src/pages/docs.astro` |

## Next steps

We've outlined five key insights to build in your [PostHog dashboard](/dashboard):

1. **Free trial conversion funnel** — Funnel from `$pageview` (home) → `start_free_trial_clicked` → `pricing_plan_selected` to see where users drop off.
2. **Top CTAs trend** — Trends for `start_free_trial_clicked`, `get_started_clicked`, and `pricing_plan_selected` over time to measure marketing effectiveness.
3. **Pricing plan breakdown** — Breakdown of `pricing_plan_selected` by `plan` property (starter / pro / enterprise) to see which tier attracts most interest.
4. **Docs engagement** — Trends for `docs_section_clicked` broken down by `section` to identify the most-visited documentation areas.
5. **Enterprise sales interest** — Trend of `contact_sales_clicked` to track enterprise lead intent over time.

To create the "Analytics basics" dashboard, go to [Dashboards](/dashboard) in PostHog, click **New dashboard**, and add the insights above using the **Trends** and **Funnels** insight types with the event names listed in the table.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
