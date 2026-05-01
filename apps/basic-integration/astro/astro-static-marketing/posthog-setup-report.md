<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog initialization component using the web snippet with `is:inline` directive. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/layouts/Layout.astro`** (edited): Imported and rendered the `<PostHog />` component in `<head>` so every page on the site initializes PostHog automatically.
- **`src/pages/index.astro`** (edited): Added click tracking for the "Start Free Trial" hero CTA (`hero_cta_clicked`) and "Read the Docs" button (`hero_docs_clicked`).
- **`src/pages/pricing.astro`** (edited): Added tracking for pricing plan CTA clicks (`pricing_plan_selected` with `plan_name` and `plan_price` properties) and the Enterprise "Contact Sales" button (`contact_sales_clicked`).
- **`src/components/Navigation.astro`** (edited): Added tracking for the top-nav "Get Started" CTA (`nav_get_started_clicked`).
- **`src/pages/docs.astro`** (edited): Added tracking for documentation section card clicks (`docs_section_clicked` with `section_name` property).
- **`.env`** (new): Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.

## Events

| Event Name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a CTA on a Starter or Pro pricing plan (properties: `plan_name`, `plan_price`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan (properties: `plan_name`, `plan_price`) | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card (property: `section_name`) | `src/pages/docs.astro` |

## Next steps

To complete the setup, create an **"Analytics basics"** dashboard in PostHog with insights based on these events:

- https://us.posthog.com/project/2/insights/new — **Conversion Funnel**: `hero_cta_clicked` → `pricing_plan_selected` → `contact_sales_clicked`
- https://us.posthog.com/project/2/insights/new — **Hero CTA Clicks Over Time** (Trends): `hero_cta_clicked` volume by day
- https://us.posthog.com/project/2/insights/new — **Pricing Plan Breakdown** (Bar chart): `pricing_plan_selected` broken down by `plan_name`
- https://us.posthog.com/project/2/insights/new — **Docs Section Engagement** (Bar chart): `docs_section_clicked` broken down by `section_name`
- https://us.posthog.com/project/2/insights/new — **CTA Comparison** (Trends): Compare `hero_cta_clicked`, `nav_get_started_clicked`, and `contact_sales_clicked`

Dashboard creation link: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
