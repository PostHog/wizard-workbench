<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI Astro static marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog web snippet component using `is:inline` and `define:vars` to pass environment variables. Initializes PostHog with the project token and host from env vars.
- **`src/layouts/Layout.astro`** (edited): Imported the PostHog component and added `<PostHog />` inside `<head>` so analytics loads on every page.
- **`src/pages/index.astro`** (edited): Added click event tracking for the "Start Free Trial" (`cta_clicked`) and "Read the Docs" (`docs_cta_clicked`) hero CTAs.
- **`src/pages/pricing.astro`** (edited): Added click event tracking for each pricing plan — `pricing_plan_selected` for Starter and Pro, and `contact_sales_clicked` for Enterprise.
- **`src/pages/docs.astro`** (edited): Added `docs_section_clicked` tracking (with `section` property) for all documentation section cards.
- **`src/components/Navigation.astro`** (edited): Added `nav_cta_clicked` tracking for the "Get Started" CTA in the nav bar.
- **`.env`** (created): Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

## Events tracked

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked "Read the Docs" CTA in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA (Starter or Pro), includes `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a docs section card, includes `section` property | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've designed an "Analytics basics" dashboard for you to track user behavior based on the events just instrumented. Create it in PostHog with these insights:

1. **CTA conversion trend** — Trends chart for `cta_clicked` + `pricing_plan_selected` over time to track top-of-funnel → pricing intent.
2. **Pricing funnel** — Funnel from `cta_clicked` → `pricing_plan_selected` to measure hero-to-pricing conversion rate.
3. **Plan breakdown** — Bar chart of `pricing_plan_selected` broken down by `plan` property (starter vs. pro) to see which plan attracts most interest.
4. **Contact sales clicks** — Trend for `contact_sales_clicked` to track enterprise pipeline interest.
5. **Docs engagement** — Bar chart of `docs_section_clicked` broken down by `section` property to see which docs sections are most popular.

Create the dashboard here: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
