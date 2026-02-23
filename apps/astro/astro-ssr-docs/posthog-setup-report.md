<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow documentation site (Astro SSR). Here is a summary of all changes made:

## What was set up

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet using the `is:inline` directive to prevent Astro processing. Reads API key and host from `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`. Exposes `getPostHogServer()` for use in API routes, and `shutdownPostHog()` for graceful shutdown.
- **`src/layouts/Layout.astro`** (edited): Imports and renders the `<PostHog />` component inside `<head>` so every page is covered.
- **`.env`** (new): Contains `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, and `POSTHOG_HOST`. Covered by `.gitignore`.
- **12 events** instrumented across pages and components (see table below).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the 'Get Started' button in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage (props: `card_title`, `card_href`) | `src/pages/index.astro` |
| `docs_section_viewed` | User viewed the docs introduction page — top of onboarding funnel | `src/pages/docs/index.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide | `src/pages/docs/quickstart.astro` |
| `installation_docs_viewed` | User viewed the Installation documentation | `src/pages/docs/installation.astro` |
| `workflows_docs_viewed` | User viewed the Workflows documentation | `src/pages/docs/workflows.astro` |
| `api_docs_viewed` | User viewed the API overview documentation | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User viewed the Authentication documentation | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_docs_viewed` | User viewed the API Endpoints documentation | `src/pages/docs/api/endpoints.astro` |
| `sidebar_link_clicked` | User clicked a sidebar navigation link (props: `link_label`, `link_href`) | `src/components/DocsSidebar.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar | `src/components/Navigation.astro` |

## Next steps

Once you have data flowing, here are 5 recommended insights to build in PostHog at https://us.posthog.com/project/2/insights:

1. **Developer Onboarding Funnel** — Funnel: `docs_section_viewed` → `quickstart_viewed` → `installation_docs_viewed` → `api_docs_viewed`. Reveals where developers drop off during onboarding.

2. **Homepage CTA Performance** — Trends: `get_started_clicked` vs `api_reference_clicked`. Compare which CTA resonates more.

3. **API Exploration Journey** — Trends: `api_docs_viewed`, `authentication_docs_viewed`, `api_endpoints_docs_viewed` together. Track progression through API docs.

4. **Top Feature Card Clicks** — Trends: `feature_card_clicked` broken down by `card_title` property. See which features spark the most interest.

5. **Documentation Navigation Patterns** — Trends: `sidebar_link_clicked` broken down by `link_label` property. Understand which docs sections are most navigated to.

Add these insights to a new **"Analytics basics"** dashboard at https://us.posthog.com/project/2/dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
