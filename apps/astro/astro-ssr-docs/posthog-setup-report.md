<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Docs Astro SSR project. The following changes were made:

- **`src/components/posthog.astro`** (new): Client-side PostHog snippet component using the `is:inline` directive to prevent Astro TypeScript processing. Initializes PostHog with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/lib/posthog-server.ts`** (new): Server-side PostHog singleton using `posthog-node`. Exports `getPostHogServer()` for use in SSR pages and `shutdownPostHog()` for graceful cleanup.
- **`src/layouts/Layout.astro`** (modified): Added `<PostHog />` component import and usage inside `<head>`, enabling client-side tracking across all pages that use this layout.
- **`src/pages/index.astro`** (modified): Added client-side click tracking for hero CTA buttons (`get_started_clicked`, `api_reference_clicked`) and feature cards (`feature_card_clicked`).
- **`src/components/Navigation.astro`** (modified): Added `nav_cta_clicked` event on the "Get Started" CTA in the navigation bar.
- **`src/pages/docs/quickstart.astro`** (modified): Added server-side `docs_quickstart_viewed` event via `posthog-node`.
- **`src/pages/docs/installation.astro`** (modified): Added server-side `docs_installation_viewed` event via `posthog-node`.
- **`src/pages/docs/api/authentication.astro`** (modified): Added server-side `docs_api_authentication_viewed` event via `posthog-node`.
- **`src/pages/docs/api/endpoints.astro`** (modified): Added server-side `docs_api_endpoints_viewed` event via `posthog-node`.
- **`src/pages/docs/workflows.astro`** (modified): Added server-side `docs_workflows_viewed` event via `posthog-node`.
- **`.env`** (created): Added `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, and `POSTHOG_HOST` environment variables.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the 'Get Started' button on the homepage hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' button on the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage to navigate to a docs section | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start guide page - top of the conversion funnel for SDK adoption | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User views the Installation page - indicates intent to integrate the SDK | `src/pages/docs/installation.astro` |
| `docs_api_authentication_viewed` | User views the Authentication docs page - key step in the developer onboarding funnel | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User views the API Endpoints reference page | `src/pages/docs/api/endpoints.astro` |
| `docs_workflows_viewed` | User views the Workflows documentation page | `src/pages/docs/workflows.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Developer onboarding funnel** — Funnel: `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_api_authentication_viewed`
2. **Homepage CTA engagement** — Trends: `get_started_clicked` + `api_reference_clicked` + `nav_cta_clicked` over time
3. **Most visited docs pages** — Trends: all `docs_*_viewed` events compared over time
4. **Feature card clicks by destination** — Trends: `feature_card_clicked` broken down by `destination` property
5. **Homepage to quickstart funnel** — Funnel: `$pageview` (path `/`) → `get_started_clicked` → `docs_quickstart_viewed`

Visit [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
