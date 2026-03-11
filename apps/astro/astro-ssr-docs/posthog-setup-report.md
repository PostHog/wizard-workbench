<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The integration covers both client-side and server-side tracking, following the singleton pattern for the server-side PostHog Node.js client.

## Summary of changes

- **`src/components/posthog.astro`** *(new)* — Client-side PostHog snippet using `is:inline` to avoid Astro TypeScript processing. Initialized from `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/lib/posthog-server.ts`** *(new)* — Server-side PostHog singleton client using `posthog-node`. Exports `getPostHogServer()` and `shutdownPostHog()` for use in API routes.
- **`src/layouts/Layout.astro`** *(edited)* — Imports and renders the `<PostHog />` component in `<head>`, enabling analytics on every page (homepage, all docs pages).
- **`src/pages/index.astro`** *(edited)* — Tracks hero CTA clicks (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked` with card title and href properties).
- **`src/components/Navigation.astro`** *(edited)* — Tracks navigation CTA clicks (`nav_cta_clicked`) and GitHub link clicks (`github_link_clicked`).
- **`src/components/DocsSidebar.astro`** *(edited)* — Tracks sidebar link clicks (`sidebar_nav_clicked` with label and href properties).
- **`src/pages/docs/quickstart.astro`** *(edited)* — Captures `docs_quickstart_viewed` on page load (top of activation funnel).
- **`src/pages/docs/installation.astro`** *(edited)* — Captures `docs_installation_viewed` on page load.
- **`src/pages/docs/api/authentication.astro`** *(edited)* — Captures `docs_authentication_viewed` on page load.
- **`src/pages/docs/workflows.astro`** *(edited)* — Captures `docs_workflows_viewed` on page load.
- **`src/pages/docs/api/endpoints.astro`** *(edited)* — Captures `docs_api_endpoints_viewed` on page load.
- **`.env`** *(new)* — Contains `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, and `POSTHOG_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button on the homepage hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button on the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked one of the feature cards on the homepage | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User viewed the Quick Start guide — top of the activation funnel | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User viewed the Installation guide — signals intent to set up the SDK | `src/pages/docs/installation.astro` |
| `docs_authentication_viewed` | User viewed the Authentication page — signals readiness to configure API keys | `src/pages/docs/api/authentication.astro` |
| `docs_workflows_viewed` | User viewed the Workflows page — indicates interest in automation capabilities | `src/pages/docs/workflows.astro` |
| `docs_api_endpoints_viewed` | User viewed the API Endpoints reference — signals active API exploration | `src/pages/docs/api/endpoints.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' CTA link in the top navigation bar | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation | `src/components/Navigation.astro` |
| `sidebar_nav_clicked` | User clicked a link in the docs sidebar to navigate between sections | `src/components/DocsSidebar.astro` |

## Next steps

To build a dashboard with insights for these events, go to your [PostHog project](https://us.posthog.com/project/2) and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Homepage CTA Conversion** — Funnel: `get_started_clicked` → `docs_quickstart_viewed` → `docs_installation_viewed`
2. **Docs Activation Funnel** — Funnel: `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_authentication_viewed`
3. **CTA Click Trends** — Trend: `get_started_clicked` + `api_reference_clicked` + `nav_cta_clicked` over time
4. **Top Feature Cards** — Breakdown of `feature_card_clicked` by `card_title` property
5. **Docs Content Engagement** — Trend: all `docs_*_viewed` events stacked over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
