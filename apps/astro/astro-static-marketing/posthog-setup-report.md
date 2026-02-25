<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI static Astro (SSG) site. Here is a summary of changes made:

- **`src/components/posthog.astro`** — Created a new reusable PostHog snippet component using the `is:inline` and `define:vars` Astro directives to safely inject the PostHog web snippet with environment variables, preventing TypeScript errors.
- **`src/layouts/Layout.astro`** — Imported and rendered `<PostHog />` in the `<head>` of the shared layout so every page automatically initializes PostHog analytics.
- **`src/pages/index.astro`** — Added `cta_clicked` event tracking to the hero "Start Free Trial" and "Read the Docs" CTA buttons.
- **`src/pages/pricing.astro`** — Added `pricing_plan_selected` event for the Starter and Pro plan buttons, and `contact_sales_clicked` for the Enterprise plan.
- **`src/pages/docs.astro`** — Added `docs_section_clicked` event tracking with event delegation on the docs grid, capturing which section was clicked.
- **`src/components/Navigation.astro`** — Added `nav_cta_clicked` event tracking on the "Get Started" navigation CTA.
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a hero CTA button (Start Free Trial or Read the Docs) with `cta_text` and `location` properties | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked the CTA on a pricing plan (Starter or Pro) with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the Contact Sales button on the Enterprise plan with `plan` and `price` properties | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card with `section` property | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the Get Started CTA in the navigation bar with `cta_text` and `location` properties | `src/components/Navigation.astro` |

## Next Steps

To create a dashboard for these events, visit your PostHog project and create a new dashboard named **"Analytics basics"** with the following suggested insights:

1. **CTA Conversion Funnel** — Trends for `cta_clicked` and `pricing_plan_selected` to measure how many visitors progress from landing page to pricing intent
2. **Pricing Plan Breakdown** — Breakdown of `pricing_plan_selected` by `plan` property to see which plan attracts the most interest
3. **Contact Sales Rate** — Trend of `contact_sales_clicked` to track Enterprise lead generation
4. **Docs Engagement by Section** — Breakdown of `docs_section_clicked` by `section` to see which docs are most popular
5. **Nav CTA vs Hero CTA Comparison** — Side-by-side trend of `nav_cta_clicked` and `cta_clicked` to compare conversion entry points

Visit your PostHog project at: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
