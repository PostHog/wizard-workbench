<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. The integration covers client-side event tracking across all pages of the documentation, with PostHog initialized on every page via a reusable component embedded in the root layout.

**New files created:**
- `src/components/posthog.astro` — Client-side PostHog web snippet, initialized with environment variables. Uses `is:inline` to avoid Astro TypeScript processing issues. Loaded in the `<head>` of every page via `Layout.astro`.
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side tracking, ready to use in future API routes.

**Existing files modified:**
- `src/layouts/Layout.astro` — Imports and renders the `<PostHog />` component in `<head>` for site-wide initialization.
- `src/layouts/DocsLayout.astro` — Added `code_snippet_copied` tracking via `copy` event listener on all `<pre>` elements.
- `src/components/DocsSidebar.astro` — Added `sidebar_link_clicked` tracking with `destination`, `section`, and `label` properties.
- `src/pages/index.astro` — Added `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` events.
- `src/pages/docs/quickstart.astro` — Added `docs_quickstart_viewed` event.
- `src/pages/docs/installation.astro` — Added `docs_installation_viewed` event.
- `src/pages/docs/concepts.astro` — Added `docs_concepts_viewed` event.
- `src/pages/docs/workflows.astro` — Added `docs_workflows_viewed` event.
- `src/pages/docs/automation.astro` — Added `docs_automation_viewed` event.
- `src/pages/docs/api/authentication.astro` — Added `docs_api_authentication_viewed` event.
- `src/pages/docs/api/endpoints.astro` — Added `docs_api_endpoints_viewed` event.

**Environment variables set** (in `.env`):
- `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` — client-side initialization
- `POSTHOG_API_KEY` / `POSTHOG_HOST` — server-side `posthog-node` client

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicks the primary 'Get Started' CTA button on the landing page hero section — top of the documentation conversion funnel. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' secondary CTA on the landing page — signals developer intent and interest in integrating the API. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks one of the feature cards on the landing page. Includes `feature` (card title) and `destination` properties. | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start guide — strong developer intent signal and critical step in the onboarding funnel. | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User views the SDK Installation page — signals serious evaluation intent, user is ready to set up the SDK. | `src/pages/docs/installation.astro` |
| `docs_api_authentication_viewed` | User views the Authentication documentation — high-intent signal for production API access setup. | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User views the API Endpoints reference — highest intent signal, user is actively building an integration. | `src/pages/docs/api/endpoints.astro` |
| `code_snippet_copied` | User copies a code snippet from the documentation. Includes `page` property. | `src/layouts/DocsLayout.astro` |
| `sidebar_link_clicked` | User clicks a navigation link in the docs sidebar. Includes `destination`, `section`, and `label` properties. | `src/components/DocsSidebar.astro` |
| `docs_workflows_viewed` | User views the Workflows guide — indicates interest in the workflow automation feature. | `src/pages/docs/workflows.astro` |
| `docs_automation_viewed` | User views the Automation page — indicates interest in email and event-driven automation capabilities. | `src/pages/docs/automation.astro` |
| `docs_concepts_viewed` | User views the Core Concepts overview — indicates a user in the learning/evaluation phase of the funnel. | `src/pages/docs/concepts.astro` |

## Next steps

We've designed an **"Analytics basics"** dashboard for your PostHog project with the following five insights to monitor user behavior and content performance. Visit your PostHog project to create them:

**[PostHog Project Dashboard — https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)**

Recommended insights to build:

1. **Documentation Conversion Funnel** — A funnel insight showing the developer onboarding journey:
   `get_started_clicked` → `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_api_authentication_viewed` → `docs_api_endpoints_viewed`

2. **Homepage CTA Performance** — A trend insight comparing `get_started_clicked` vs `api_reference_clicked` over time to understand what drives users into the docs.

3. **Feature Card Clicks Breakdown** — A bar chart of `feature_card_clicked` broken down by the `feature` property, showing which landing page features attract the most interest.

4. **Code Snippet Engagement** — A trend insight for `code_snippet_copied` broken down by `page` property to see which documentation pages drive the most active technical engagement.

5. **High-Intent Docs Engagement** — A stacked trend of `docs_api_authentication_viewed` and `docs_api_endpoints_viewed` to track the most commercially significant documentation visits over time.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
