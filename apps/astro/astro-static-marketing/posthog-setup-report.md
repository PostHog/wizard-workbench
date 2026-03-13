<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro static marketing site. Here's a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables without Astro processing the script. Initializes PostHog on every page.
- **`src/layouts/Layout.astro`** (modified): Imports and renders `<PostHog />` inside `<head>` so analytics loads on every page of the site.
- **`src/components/Navigation.astro`** (modified): Tracks `get_started_clicked` when the nav CTA is clicked.
- **`src/pages/index.astro`** (modified): Tracks `start_free_trial_clicked` and `read_docs_clicked` from the hero section CTAs.
- **`src/pages/pricing.astro`** (modified): Tracks `pricing_plan_clicked` (with `plan` property: `starter` or `pro`) and `contact_sales_clicked` on the enterprise plan.
- **`src/pages/docs.astro`** (modified): Tracks `docs_section_clicked` (with `section` property: the clicked section title) on all docs card links.
- **`.env`** (created): Contains `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicked the 'Start Free Trial' CTA button on the homepage hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicked the 'Read the Docs' secondary CTA button on the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a CTA button on a pricing plan card (Starter or Pro), with `plan` property | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicked the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked on a documentation section card on the docs page, with `section` property | `src/pages/docs.astro` |

## Next steps

The API credentials available in this environment don't have write access to create dashboards and insights automatically. To set up an "Analytics basics" dashboard in PostHog, navigate to your project and create the following insights manually:

1. **Free Trial Conversion** — Trend of `start_free_trial_clicked` over time
2. **Pricing Funnel** — Funnel: `pricing_plan_clicked` → `start_free_trial_clicked` to measure conversion from pricing page
3. **CTA Engagement** — Breakdown of `get_started_clicked` and `start_free_trial_clicked` by location property
4. **Pricing Plan Breakdown** — `pricing_plan_clicked` broken down by `plan` property (starter vs. pro)
5. **Docs Engagement** — `docs_section_clicked` broken down by `section` property to see which docs are most popular

Visit your PostHog project at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
