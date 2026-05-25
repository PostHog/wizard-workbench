<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this static Astro marketing site (NeuralFlow AI). Here's a summary of what was set up:

- **`src/components/posthog.astro`** — New PostHog snippet component using `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in the `<head>`, so PostHog loads on every page.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values (covered by `.gitignore`).
- **`src/pages/index.astro`** — Tracks hero CTA clicks: `start_free_trial_clicked` and `read_docs_clicked`.
- **`src/pages/pricing.astro`** — Fires `pricing_viewed` on load (top of conversion funnel), `pricing_plan_clicked` (with `plan` property) for Starter/Pro, and `contact_sales_clicked` for Enterprise.
- **`src/components/Navigation.astro`** — Tracks `nav_get_started_clicked` on the nav bar CTA.
- **`src/pages/docs.astro`** — Tracks `docs_section_clicked` with a `section` property for each documentation card.

| Event | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks "Start Free Trial" hero CTA | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks "Read the Docs" secondary hero CTA | `src/pages/index.astro` |
| `pricing_viewed` | User views the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a plan CTA (Starter/Pro), includes `plan` property | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" for the Enterprise plan | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a docs section card, includes `section` property | `src/pages/docs.astro` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to explore the events as they come in. Recommended insights to create:

- **Pricing conversion funnel** — `pricing_viewed` → `pricing_plan_clicked` / `contact_sales_clicked` — shows drop-off between viewing pricing and clicking a plan.
- **CTA click trends** — A trends chart of `start_free_trial_clicked` over time to track hero conversion rate.
- **Docs engagement breakdown** — `docs_section_clicked` broken down by the `section` property to see which docs sections are most popular.
- **Acquisition channel comparison** — Compare `nav_get_started_clicked` vs hero `start_free_trial_clicked` to see which CTA converts better.
- **Trial vs Sales intent** — Trend of `start_free_trial_clicked` vs `contact_sales_clicked` over time to understand self-serve vs enterprise intent.

You can create these at [Insights → New insight](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
