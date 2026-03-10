<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this static Astro marketing site (NeuralFlow AI). Here is a summary of all changes made:

- **Created** `src/components/posthog.astro` — PostHog initialization component using the web snippet with `is:inline` directive. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **Updated** `src/layouts/Layout.astro` — Imports and renders `<PostHog />` in the `<head>` so all pages are tracked automatically.
- **Updated** `src/pages/index.astro` — Added inline script to capture hero CTA button clicks.
- **Updated** `src/pages/pricing.astro` — Added inline script to capture pricing plan selection and contact sales button clicks.
- **Updated** `src/components/Navigation.astro` — Added inline script to capture the nav "Get Started" CTA click.
- **Updated** `src/pages/docs.astro` — Added inline script to capture documentation section card clicks.
- **Created/updated** `.env` — Added `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables.
- **Installed** `posthog-js` package.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA button in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA button in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA button (Starter or Pro), includes `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" button on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" button in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card, includes `section` property | `src/pages/docs.astro` |

## Next steps

To create an "Analytics basics" dashboard in PostHog, go to your PostHog project and create a new dashboard with the following insights:

1. **Hero CTA Conversion Funnel** — Funnel: `cta_clicked` → downstream signup or trial activation
2. **Pricing Plan Selection** — Trend: `pricing_plan_selected` broken down by `plan` property to see which plans attract the most interest
3. **Contact Sales Requests** — Trend: `contact_sales_clicked` over time (Enterprise lead signal)
4. **Navigation CTA Clicks** — Trend: `nav_cta_clicked` over time
5. **Docs Engagement** — Trend: `docs_section_clicked` broken down by `section` property to see which documentation sections are most popular

Log into PostHog at [https://us.posthog.com](https://us.posthog.com) and create these insights once events start flowing in.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
