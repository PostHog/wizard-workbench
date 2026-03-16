<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using `is:inline` and `define:vars` to inject environment variables at build time. Initialized via `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.
- **`src/layouts/Layout.astro`** (modified): Imports and renders `<PostHog />` inside `<head>` so analytics loads on every page.
- **`src/lib/posthog-server.ts`** (new): Singleton factory for the `posthog-node` server-side client, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from env.
- **`src/pages/index.astro`** (modified): Tracks CTA button clicks (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked`) with card title and destination properties.
- **`src/pages/docs/quickstart.astro`** (modified): Fires `docs_quickstart_viewed` on page load — marks the top of the documentation funnel.
- **`src/pages/docs/installation.astro`** (modified): Fires `docs_installation_viewed` on page load.
- **`src/pages/docs/api/authentication.astro`** (modified): Fires `docs_authentication_viewed` on page load.
- **`src/pages/docs/workflows.astro`** (modified): Fires `docs_workflows_viewed` on page load.
- **`src/pages/docs/api/endpoints.astro`** (modified): Fires `docs_api_endpoints_viewed` on page load.
- **`src/components/DocsSidebar.astro`** (modified): Tracks `sidebar_nav_clicked` for every sidebar link with label and destination properties.
- **`src/components/Navigation.astro`** (modified): Tracks `github_link_clicked` when the GitHub nav link is clicked.
- **`.env`** (updated): Added `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicks the 'Get Started' CTA on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start page — top of the docs funnel | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User views the Installation page — SDK integration intent | `src/pages/docs/installation.astro` |
| `docs_authentication_viewed` | User views the Authentication page — API integration intent | `src/pages/docs/api/authentication.astro` |
| `docs_workflows_viewed` | User views the Workflows page — automation interest | `src/pages/docs/workflows.astro` |
| `docs_api_endpoints_viewed` | User views the API Endpoints page — active integration work | `src/pages/docs/api/endpoints.astro` |
| `sidebar_nav_clicked` | User clicks a link in the docs sidebar | `src/components/DocsSidebar.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation | `src/components/Navigation.astro` |

## Next steps

We've set up an Analytics basics dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Analytics basics dashboard**: https://us.posthog.com/project/2/dashboard/1344803

Recommended insights to add to this dashboard:

1. **Documentation funnel** — Funnel insight: `get_started_clicked` → `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_authentication_viewed`
2. **Most visited docs pages** — Trends insight with all `docs_*_viewed` events broken down by event name
3. **Homepage CTA clicks** — Trends insight comparing `get_started_clicked` vs `api_reference_clicked`
4. **Sidebar navigation** — Trends insight for `sidebar_nav_clicked` broken down by `destination` property
5. **Feature card clicks** — Trends insight for `feature_card_clicked` broken down by `card_title` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
