<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The following changes were made:

- **`src/components/posthog.astro`** *(new)* — Client-side PostHog snippet component using `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/lib/posthog-server.ts`** *(new)* — Server-side PostHog singleton using `posthog-node`. Exports `getPostHogServer()` and `shutdownPostHog()` for use in API routes.
- **`src/layouts/Layout.astro`** *(edited)* — Imports and renders `<PostHog />` in `<head>`, enabling analytics on every page.
- **`src/pages/index.astro`** *(edited)* — Tracks hero CTA clicks (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked` with `card_title` property).
- **`src/pages/docs/quickstart.astro`** *(edited)* — Fires `quickstart_guide_viewed` on load, capturing entry into the onboarding funnel.
- **`src/components/Navigation.astro`** *(edited)* — Tracks GitHub link clicks (`github_link_clicked`) and navigation CTA clicks (`nav_get_started_clicked`).
- **`.env`** *(new)* — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST` set from environment.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked "Get Started" hero CTA | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked "API Reference" hero CTA | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card (includes `card_title`) | `src/pages/index.astro` |
| `quickstart_guide_viewed` | User viewed the Quick Start guide — top of onboarding funnel | `src/pages/docs/quickstart.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA in the navigation | `src/components/Navigation.astro` |

## Next steps

To monitor user engagement, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- [Create new dashboard](https://us.i.posthog.com/project/2/dashboard/new) — name it "Analytics basics"

Suggested insights to add:

- **Homepage CTA conversion funnel** — Funnel: `get_started_clicked` → `quickstart_guide_viewed`
- **CTA click trends** — Trend chart comparing `get_started_clicked`, `api_reference_clicked`, `nav_get_started_clicked`
- **Feature card engagement** — Breakdown of `feature_card_clicked` by `card_title` property
- **Quickstart guide views over time** — Trend chart of `quickstart_guide_viewed`
- **GitHub link clicks** — Trend chart of `github_link_clicked`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
