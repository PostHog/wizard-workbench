<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site.

## Changes made

### New files
- **`src/components/posthog.astro`** — PostHog initialization snippet component using the `is:inline` directive to prevent Astro from processing the snippet. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` values.

### Modified files
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog loads on every page of the site.
- **`src/pages/index.astro`** — Tracks hero CTA button clicks (`hero_cta_clicked`, `hero_docs_cta_clicked`).
- **`src/components/Navigation.astro`** — Tracks the nav "Get Started" CTA click (`nav_get_started_clicked`).
- **`src/pages/pricing.astro`** — Tracks pricing plan CTA clicks (`pricing_plan_clicked` with `plan` and `price_usd` properties) and enterprise contact sales (`contact_sales_clicked`).
- **`src/pages/docs.astro`** — Tracks which documentation section card was clicked (`docs_section_clicked` with `section` property).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the homepage hero — top of conversion funnel | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicks "Read the Docs" in the homepage hero | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" CTA in the top navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_clicked` | User clicks a plan CTA on the pricing page (Starter/Pro) — key conversion signal. Properties: `plan`, `price_usd` | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" for the Enterprise plan. Properties: `plan: 'enterprise'` | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation category card. Properties: `section` (e.g. `getting_started`, `api_reference`) | `src/pages/docs.astro` |

## Next steps

To start analyzing user behavior, create an **"Analytics basics"** dashboard in PostHog ([https://us.i.posthog.com](https://us.i.posthog.com)) with these recommended insights:

1. **CTA Conversion Funnel** — Funnel from `hero_cta_clicked` or `nav_get_started_clicked` → `pricing_plan_clicked` → shows how many hero visitors convert to pricing interest.
2. **Pricing Plan Interest** — Trend or breakdown of `pricing_plan_clicked` by `plan` property — reveals which plan attracts the most intent.
3. **Enterprise Pipeline** — Trend of `contact_sales_clicked` — tracks enterprise lead generation over time.
4. **Docs Engagement** — Breakdown of `docs_section_clicked` by `section` property — shows which docs are most needed.
5. **Hero CTA Clicks** — Trend of `hero_cta_clicked` + `hero_docs_cta_clicked` — measures effectiveness of homepage messaging.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
