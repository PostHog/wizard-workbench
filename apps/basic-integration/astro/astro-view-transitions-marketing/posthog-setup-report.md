<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI Astro marketing site. Here's what was done:

- **Created `src/components/posthog.astro`** — loads the PostHog JS snippet with a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions soft navigation. Uses `capture_pageview: 'history_change'` to automatically track pageviews on each client-side route change.
- **Updated `src/layouts/Layout.astro`** — imported and rendered the `<PostHog />` component inside `<head>` so it initializes on every page.
- **Updated `src/pages/index.astro`** — captures `cta_clicked` and `docs_cta_clicked` when users interact with the hero section CTAs.
- **Updated `src/pages/pricing.astro`** — captures `pricing_plan_selected` (with the plan name) for Starter and Pro tiers, and `contact_sales_clicked` for the Enterprise tier.
- **Updated `src/pages/docs.astro`** — captures `docs_section_clicked` (with the section name) for each documentation card.
- **Updated `src/components/Navigation.astro`** — captures `nav_cta_clicked` when users click the "Get Started" button in the nav bar.
- **Set environment variables** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written to `.env` (gitignored). All PostHog initialization reads from these variables — no tokens are hardcoded.

All scripts use `is:inline` to prevent Astro from processing them, and each setup function handles both `DOMContentLoaded` and `astro:page-load` events so listeners re-attach correctly after view transitions. Event listeners are removed before re-adding to prevent duplicates during soft navigation.

## Events

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA on the Starter or Pro pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a section card in the Documentation page | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" button in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog ([/dashboard](/dashboard)) with these recommended insights:

1. **CTA conversion trend** — Trends chart for `cta_clicked` and `nav_cta_clicked` over time to track top-of-funnel momentum.
2. **Pricing plan funnel** — Funnel from any pageview → `pricing_plan_selected` to measure pricing page conversion rate.
3. **Pricing plan breakdown** — Trends chart for `pricing_plan_selected` broken down by `plan` property to see which tier is most popular.
4. **Contact Sales clicks** — Trends chart for `contact_sales_clicked` to track enterprise pipeline interest.
5. **Docs engagement** — Trends chart for `docs_section_clicked` broken down by `section` property to see which docs topics get the most interest.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
