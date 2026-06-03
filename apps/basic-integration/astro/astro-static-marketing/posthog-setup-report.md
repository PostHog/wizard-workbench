<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI Astro static marketing site.

## What was added

- **`src/components/posthog.astro`** — New PostHog initialization component using the web snippet with `is:inline` to prevent Astro from processing it. Reads token and host from environment variables.
- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in the `<head>` so every page is tracked.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written with the project's values.

Custom events were added to the following files:

| Event | Description | File |
|---|---|---|
| `clicked_hero_cta` | User clicked a CTA button in the homepage hero section (`start_free_trial` or `read_the_docs`) | `src/pages/index.astro` |
| `viewed_pricing` | User viewed the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `clicked_pricing_plan` | User clicked a CTA on a pricing plan card (starter, pro, or enterprise) | `src/pages/pricing.astro` |
| `clicked_nav_get_started` | User clicked the Get Started CTA in the navigation bar | `src/components/Navigation.astro` |
| `clicked_docs_section` | User clicked on a documentation section card on the docs page | `src/pages/docs.astro` |

## Next steps

The PostHog MCP's API key is missing the `query:read`, `insight:write`, and `dashboard:write` scopes needed to auto-create insights and a dashboard. To create the recommended "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboard) and add the following insights:

1. **Hero CTA clicks over time** — Trends chart for `clicked_hero_cta`, broken down by `cta` property, to see which CTA drives more engagement.
2. **Pricing page conversion funnel** — Funnel from `viewed_pricing` → `clicked_pricing_plan`, to measure how many visitors who view pricing go on to click a plan CTA.
3. **Pricing plan breakdown** — Trends chart for `clicked_pricing_plan` broken down by `plan` property (starter / pro / enterprise) to see which plan attracts the most interest.
4. **Nav CTA clicks over time** — Trends chart for `clicked_nav_get_started` to track top-of-funnel intent from the navigation.
5. **Docs engagement** — Trends chart for `clicked_docs_section` broken down by `section` property to identify the most-visited documentation topics.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
