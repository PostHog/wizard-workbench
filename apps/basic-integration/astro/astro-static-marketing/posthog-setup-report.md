<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. Here is a summary of all changes made:

- **Created** `src/components/posthog.astro` — PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables at build time without TypeScript errors.
- **Updated** `src/layouts/Layout.astro` — Imported and embedded `<PostHog />` in the `<head>` so every page is instrumented automatically.
- **Updated** `src/pages/index.astro` — Added click tracking for the hero "Start Free Trial" (`cta_clicked`) and "Read the Docs" (`docs_link_clicked`) buttons.
- **Updated** `src/pages/pricing.astro` — Added `pricing_viewed` on page load, `pricing_plan_selected` on any plan CTA click (with `plan` and `price_usd` properties), and `contact_sales_clicked` on the Enterprise CTA.
- **Updated** `src/components/Navigation.astro` — Added `nav_cta_clicked` on the top-nav "Get Started" button.
- **Updated** `src/pages/docs.astro` — Added `doc_section_clicked` on each documentation section card, with a `section` property (e.g. "Getting Started", "API Reference").
- **Created** `.env` — Populated `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | Hero "Start Free Trial" button clicked | `src/pages/index.astro` |
| `docs_link_clicked` | Hero "Read the Docs" button clicked | `src/pages/index.astro` |
| `nav_cta_clicked` | Top-nav "Get Started" button clicked | `src/components/Navigation.astro` |
| `pricing_viewed` | Pricing page loaded (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_selected` | Any pricing plan CTA clicked (Starter / Pro / Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | Enterprise "Contact Sales" button clicked | `src/pages/pricing.astro` |
| `doc_section_clicked` | A documentation section card clicked | `src/pages/docs.astro` |

## Next steps

We recommend building the following insights and grouping them into an **"Analytics basics"** dashboard in PostHog:

1. **CTA conversion funnel** — Funnel: `pricing_viewed` → `pricing_plan_selected`. Tracks how many visitors who view pricing actually select a plan.
   [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Hero CTA clicks over time** — Trend: `cta_clicked`. Shows momentum in free-trial intent from the homepage hero.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Plan selection breakdown** — Trend: `pricing_plan_selected` broken down by `plan` property. Reveals which tier attracts the most interest.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Contact Sales clicks over time** — Trend: `contact_sales_clicked`. Tracks Enterprise lead intent.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Docs engagement by section** — Trend: `doc_section_clicked` broken down by `section` property. Shows which documentation topics resonate most.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Open PostHog project](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
