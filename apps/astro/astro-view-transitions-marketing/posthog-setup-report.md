<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **NeuralFlow AI** Astro marketing site. PostHog is now initialized with View Transitions support across all pages, with custom event tracking covering the core conversion funnel and user engagement touchpoints.

## Changes made

### New file
- **`src/components/posthog.astro`** — PostHog initialization snippet using the `is:inline` directive with a `window.__posthog_initialized` guard (prevents stack overflow during ClientRouter soft navigation) and `capture_pageview: 'history_change'` for automatic pageview tracking.

### Modified files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog loads on every page.
- **`src/components/Navigation.astro`** — Tracks `nav_cta_clicked` when the "Get Started" CTA in the navigation bar is clicked.
- **`src/pages/index.astro`** — Tracks `hero_cta_clicked` (Start Free Trial) and `hero_docs_cta_clicked` (Read the Docs) hero button clicks.
- **`src/pages/pricing.astro`** — Tracks `pricing_page_viewed` on arrival, `pricing_plan_cta_clicked` for Starter/Pro plan buttons (with `plan` and `price_per_month` properties), and `contact_sales_clicked` for the Enterprise plan.
- **`src/pages/features.astro`** — Tracks `features_page_viewed` to measure product interest at the top of the funnel.
- **`src/pages/docs.astro`** — Tracks `docs_section_clicked` with a `section` property (e.g., "Getting Started", "API Reference") for each documentation card clicked.

### Environment variables
- **`.env`** — `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` added and covered by `.gitignore`.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page — top of conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA on Starter or Pro pricing plan | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the top navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `features_page_viewed` | User views the features page, indicating product interest | `src/pages/features.astro` |

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog (https://us.posthog.com) with the following recommended insights:

1. **Conversion Funnel** — `features_page_viewed` → `pricing_page_viewed` → `pricing_plan_cta_clicked` or `contact_sales_clicked`
2. **Trial Start Trend** — Trend of `hero_cta_clicked` + `pricing_plan_cta_clicked` (filtered to Pro plan) over time
3. **Pricing Plan Breakdown** — Breakdown of `pricing_plan_cta_clicked` by `plan` property (Starter vs. Pro)
4. **Docs Engagement** — Breakdown of `docs_section_clicked` by `section` property to see which docs sections are most popular
5. **CTA Click Comparison** — Bar chart comparing all CTA events: `nav_cta_clicked`, `hero_cta_clicked`, `hero_docs_cta_clicked`, `contact_sales_clicked`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
