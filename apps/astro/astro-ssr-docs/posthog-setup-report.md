<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow Docs Astro SSR project. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): Client-side PostHog analytics snippet using `is:inline` and `define:vars` to inject environment variables safely. Prevents TypeScript errors from Astro processing.
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` in `<head>`, ensuring all pages (via `DocsLayout` and direct `Layout` usage) initialize PostHog automatically.
- **`src/components/Navigation.astro`** (edited): Tracks `github_link_clicked` and `nav_cta_clicked` events on navigation bar interactions.
- **`src/components/DocsSidebar.astro`** (edited): Tracks `docs_sidebar_link_clicked` with label and href properties for every sidebar navigation action.
- **`src/pages/index.astro`** (edited): Tracks `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` (with card title and href) from the homepage hero and feature grid.
- **`src/pages/docs/quickstart.astro`** (edited): Fires `quickstart_viewed` on load — marks the top of the developer onboarding funnel.
- **`src/pages/docs/api/authentication.astro`** (edited): Fires `authentication_docs_viewed` — a high-intent signal that a developer is evaluating the API.
- **`src/pages/docs/api/endpoints.astro`** (edited): Fires `api_endpoints_viewed` on load.
- **`src/pages/docs/workflows.astro`** (edited): Fires `workflows_docs_viewed` on load — signals interest in the automation feature set.
- **`.env`** (created): Stores `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` — referenced by `posthog.astro` via `import.meta.env`.

## Events

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" button in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes card title and href) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User navigates via the docs sidebar (includes label and href) | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of the onboarding funnel | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the Authentication docs — high-intent API integration signal | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User views the API Endpoints reference page | `src/pages/docs/api/endpoints.astro` |
| `workflows_docs_viewed` | User views the Workflows documentation page | `src/pages/docs/workflows.astro` |

## Next steps

To build insights and a dashboard in PostHog using these events, visit your PostHog project and create the following:

**Suggested dashboard: "Analytics basics"**

1. **Developer onboarding funnel** — Funnel insight from `get_started_clicked` → `quickstart_viewed` → `authentication_docs_viewed`. Shows how many visitors progress from the homepage CTA into active API evaluation.

2. **Homepage engagement** — Trends insight showing `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` over time. Reveals which homepage CTAs drive the most engagement.

3. **Docs sidebar navigation** — Trends insight for `docs_sidebar_link_clicked` broken down by `href` property. Identifies which docs sections are most frequently visited.

4. **API interest signals** — Trends insight combining `authentication_docs_viewed` and `api_endpoints_viewed`. High values signal strong developer intent to integrate.

5. **Workflow feature interest** — Trends insight for `workflows_docs_viewed`. Tracks interest in the automation feature set.

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
