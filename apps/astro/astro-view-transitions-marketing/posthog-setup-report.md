<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions / ClientRouter). The following changes were made:

- **`src/components/posthog.astro`** (new): PostHog web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and `capture_pageview: 'history_change'` for automatic pageview tracking across all view transitions.
- **`src/layouts/Layout.astro`**: Imported and added `<PostHog />` to the `<head>`, ensuring analytics loads on every page via the shared layout.
- **`src/pages/index.astro`**: Added `astro:page-load`-safe event listeners tracking hero CTA and docs link clicks.
- **`src/pages/pricing.astro`**: Added tracking for all three pricing plan CTA clicks (Starter, Pro, Enterprise) with plan name and price properties.
- **`src/pages/docs.astro`**: Added tracking for documentation section card clicks with section name property.
- **`src/components/Navigation.astro`**: Added tracking for the navigation "Get Started" CTA click.
- **`.env`**: Created with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary 'Start Free Trial' CTA on the homepage hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the 'Read the Docs' link on the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card (Getting Started, API Reference, etc.) | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

- **CTA conversion funnel** — steps: `$pageview` (path = `/`) → `cta_clicked` → `pricing_plan_clicked`. Shows how many homepage visitors reach pricing intent.
- **Pricing plan breakdown** — trend of `pricing_plan_clicked` broken down by `plan` property. Shows which tier is most popular.
- **CTA click volume** — trend of `cta_clicked` + `nav_cta_clicked` over time. Tracks overall top-of-funnel demand.
- **Docs engagement** — trend of `docs_section_clicked` broken down by `section`. Shows which documentation topics attract most interest.
- **Homepage entry to docs** — steps: `$pageview` (path = `/`) → `docs_link_clicked`. Measures how many homepage visitors explore documentation.

Use the links below to get started:

- [New dashboard](https://us.posthog.com/project/2/dashboards/new)
- [New funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- [New trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [All dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
