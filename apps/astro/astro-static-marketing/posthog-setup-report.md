<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro static marketing site.

## What was done

- **Created `src/components/posthog.astro`** — A reusable PostHog initialization component using the web snippet with `is:inline` to prevent Astro from processing it. Credentials are injected via `define:vars` from environment variables.
- **Updated `src/layouts/Layout.astro`** — Imported and rendered `<PostHog />` in the `<head>` so all pages are automatically instrumented.
- **Set up `.env`** — Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- **Added event tracking** to five files covering the key user journeys across the marketing site.

## Tracked events

| Event | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a plan CTA (Starter or Pro). Includes `plan_name` property. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise card | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the top navigation | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a docs section card. Includes `section_name` property. | `src/pages/docs.astro` |
| `features_page_viewed` | User views the features page (top of conversion funnel) | `src/pages/features.astro` |

## Next steps

### Dashboard — "Analytics basics"

The API key provided does not have the `dashboard:write` scope, so the dashboard could not be created automatically. To set it up manually, visit PostHog and create a new dashboard named **"Analytics basics"** with these five insights:

1. **Conversion funnel** — `features_page_viewed` → `hero_cta_clicked` → `pricing_plan_clicked`
   - Reveals how many visitors who explore features move on to the pricing page and click a plan.
2. **Hero CTA trend** — `hero_cta_clicked` over time
   - Tracks interest in starting a free trial from the homepage hero.
3. **Pricing plan breakdown** — `pricing_plan_clicked` broken down by `plan_name`
   - Shows which pricing tier (Starter vs Pro) drives the most clicks.
4. **Enterprise pipeline** — `contact_sales_clicked` over time
   - Monitors inbound B2B / enterprise interest.
5. **Navigation engagement** — `nav_cta_clicked` over time
   - Measures how effective the top-nav "Get Started" CTA is.

Create your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
