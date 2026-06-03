<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro static marketing site (NeuralFlow AI). The following changes were made:

- **`src/components/posthog.astro`** — New component that initialises PostHog using the web snippet with `is:inline` to prevent Astro/TypeScript processing. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` inside `<head>` so every page on the site initialises PostHog automatically.
- **`src/pages/index.astro`** — Added click handlers to the hero "Start Free Trial" and "Read the Docs" CTAs.
- **`src/pages/pricing.astro`** — Added click handlers to each plan CTA (Starter / Pro) and the Enterprise "Contact Sales" button, capturing the plan name and price as properties.
- **`src/pages/docs.astro`** — Added click handlers to each documentation section card, capturing the section name as a property.
- **`src/components/Navigation.astro`** — Added a click handler to the navigation "Get Started" CTA.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` values.

| Event | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicked "Start Free Trial" CTA in the hero | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked "Read the Docs" CTA in the hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a plan CTA; includes `plan_name` and `plan_price` | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" for the Enterprise tier | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a docs section card; includes `section_name` | `src/pages/docs.astro` |
| `get_started_clicked` | User clicked "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

A PostHog dashboard could not be created automatically because the current API key is missing the `dashboard:write` and `query:read` scopes. To create a dashboard manually, visit your [PostHog project](https://us.posthog.com/project/2/dashboards) and build insights from the events listed above. Recommended insights:

- **CTA conversion funnel** — Funnel from `pricing_plan_clicked` to `free_trial_clicked`
- **Plan selection breakdown** — Trends of `pricing_plan_clicked` broken down by `plan_name`
- **Docs engagement** — Trends of `docs_section_clicked` broken down by `section_name`
- **Navigation CTAs** — Trends of `get_started_clicked` over time
- **Enterprise interest** — Trends of `contact_sales_clicked` over time

To enable automatic dashboard creation in the future, add the `dashboard:write`, `insight:write`, and `query:read` scopes to your PostHog personal API key in [project settings](https://us.posthog.com/project/2/settings).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
