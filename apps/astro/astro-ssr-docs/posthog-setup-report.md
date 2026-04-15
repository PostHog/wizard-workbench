<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The following changes were made:

- **`src/components/posthog.astro`** (created): Client-side PostHog snippet component, initialized using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables. Uses the `is:inline` directive to prevent Astro from processing the script.
- **`src/layouts/Layout.astro`** (edited): Imported and rendered `<PostHog />` in the `<head>` so all pages receive client-side analytics.
- **`src/lib/posthog-server.ts`** (created): Server-side `posthog-node` singleton (`getPostHogServer()`) for use in any future API routes. Reads from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`.env`** (created): All four PostHog environment variables set (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`).
- **`package.json`** (updated): `posthog-node` v5.29.2 added as a dependency.
- **Five page and component files** (edited): Click and view events added throughout.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes `card_title`, `card_href`) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a docs sidebar link (includes `section`, `label`, `href`) | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of the docs conversion funnel | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the Authentication docs — indicates API integration interest | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User views the API Endpoints reference — indicates active API exploration | `src/pages/docs/api/endpoints.astro` |
| `workflows_docs_viewed` | User views the Workflows docs — indicates interest in automation features | `src/pages/docs/workflows.astro` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five suggested insights:

1. **Docs conversion funnel** — Funnel insight: `get_started_clicked` → `quickstart_viewed` → `authentication_docs_viewed`
2. **Homepage CTA clicks** — Trend insight: `get_started_clicked` and `api_reference_clicked` over time
3. **Feature card engagement** — Breakdown insight: `feature_card_clicked` broken down by `card_title`
4. **Most visited docs sections** — Trend insight: `quickstart_viewed`, `workflows_docs_viewed`, `authentication_docs_viewed`, `api_endpoints_viewed`
5. **Sidebar navigation patterns** — Breakdown insight: `docs_sidebar_link_clicked` broken down by `section`

You can create this dashboard in your PostHog project here:
- **PostHog project**: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
