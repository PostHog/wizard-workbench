<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. Here is a summary of all changes made:

- **Installed packages**: `posthog-js` (client-side) and `posthog-node` (server-side) were added as dependencies.
- **Environment variables**: `.env` was created with `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.
- **`src/components/posthog.astro`** *(new)*: PostHog browser snippet component using `is:inline` and `define:vars` to safely inject environment variables. Loaded on every page via the layout.
- **`src/lib/posthog-server.ts`** *(new)*: Singleton `posthog-node` client for server-side event tracking. Exports `getPostHogServer()` and `shutdownPostHog()`.
- **`src/layouts/Layout.astro`** *(edited)*: Imported and rendered `<PostHog />` inside `<head>` so all pages get client-side tracking automatically.
- **`src/pages/index.astro`** *(edited)*: Added click tracking for the Get Started CTA, API Reference button, and all feature cards.
- **`src/components/Navigation.astro`** *(edited)*: Added click tracking for all top nav links.
- **`src/pages/docs/quickstart.astro`** *(edited)*: Fires `quickstart_viewed` on load (top of conversion funnel).
- **`src/pages/docs/installation.astro`** *(edited)*: Fires `installation_viewed` on load.
- **`src/pages/docs/api/index.astro`** *(edited)*: Fires `api_docs_viewed` on load.
- **`src/pages/docs/api/authentication.astro`** *(edited)*: Fires `authentication_docs_viewed` on load.
- **`src/pages/docs/api/endpoints.astro`** *(edited)*: Fires `endpoints_docs_viewed` on load.
- **`src/pages/docs/workflows.astro`** *(edited)*: Fires `workflows_docs_viewed` on load.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `docs_nav_clicked` | User clicks a link in the top navigation bar | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page (top of SDK adoption funnel) | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page (intent to set up SDK) | `src/pages/docs/installation.astro` |
| `api_docs_viewed` | User views the API Reference index (developer engagement) | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the Authentication docs (intent to integrate) | `src/pages/docs/api/authentication.astro` |
| `endpoints_docs_viewed` | User views the API Endpoints reference | `src/pages/docs/api/endpoints.astro` |
| `workflows_docs_viewed` | User views the Workflows documentation | `src/pages/docs/workflows.astro` |

## Next steps

We've outlined five insights for an "Analytics basics" dashboard to keep an eye on user behavior. Create the dashboard and add each insight in PostHog:

- **[New dashboard →](https://us.posthog.com/project/2/dashboard/new)** Create a dashboard named "Analytics basics", then add these insights:

1. **[Docs adoption funnel →](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)** — Funnel: `quickstart_viewed` → `installation_viewed` → `api_docs_viewed`. Tracks how many visitors progress from discovering the quickstart to reading the API docs.

2. **[Get Started CTA clicks →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend of `get_started_clicked` over time. Shows how effectively the homepage drives users into the docs funnel.

3. **[Top feature cards →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend of `feature_card_clicked` broken down by `card_title`. Reveals which docs topics attract the most interest from the homepage.

4. **[Documentation page engagement →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend with all five `*_viewed` events on one chart (`quickstart_viewed`, `installation_viewed`, `api_docs_viewed`, `authentication_docs_viewed`, `endpoints_docs_viewed`, `workflows_docs_viewed`). Shows which pages drive the most engagement.

5. **[Nav link clicks →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)** — Trend of `docs_nav_clicked` broken down by `label`. Shows which navigation items users interact with most.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
