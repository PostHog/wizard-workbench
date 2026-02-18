<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow documentation site (Astro SSR). The integration includes:

- **Client-side analytics** via the PostHog JavaScript web snippet, initialized in a reusable `posthog.astro` component and injected into the root `Layout.astro` so it runs on every page.
- **Server-side client** via `posthog-node`, using a singleton pattern in `src/lib/posthog-server.ts` to avoid multiple client instances.
- **12 custom events** added across the homepage, documentation pages, and navigation components — covering conversion funnel entry points, content engagement, and navigation interactions.
- **Environment variables** configured in `.env` using Astro's `PUBLIC_` prefix convention for client-side keys and unprefixed keys for server-side use.

## Events added

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked "Get Started" on homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked "API Reference" on homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User viewed the Quick Start page — top of getting started funnel | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User viewed the Installation page | `src/pages/docs/installation.astro` |
| `docs_api_overview_viewed` | User viewed the API Reference overview | `src/pages/docs/api/index.astro` |
| `docs_authentication_viewed` | User viewed the Authentication page — key step before API integration | `src/pages/docs/api/authentication.astro` |
| `docs_endpoints_viewed` | User viewed the API Endpoints page | `src/pages/docs/api/endpoints.astro` |
| `docs_workflows_viewed` | User viewed the Workflows page | `src/pages/docs/workflows.astro` |
| `sidebar_link_clicked` | User clicked a navigation link in the docs sidebar | `src/components/DocsSidebar.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicked the GitHub link in the top navigation | `src/components/Navigation.astro` |

## New files created

| File | Purpose |
|---|---|
| `src/components/posthog.astro` | PostHog web snippet component (client-side, `is:inline`) |
| `src/lib/posthog-server.ts` | Singleton `posthog-node` client for server-side tracking |

## Modified files

| File | Change |
|---|---|
| `src/layouts/Layout.astro` | Imported and rendered `<PostHog />` in `<head>` |
| `src/components/Navigation.astro` | Added `github_link_clicked` and `nav_cta_clicked` events |
| `src/components/DocsSidebar.astro` | Added `sidebar_link_clicked` event with section/label context |
| `src/pages/index.astro` | Added hero CTA and feature card click events |
| `src/pages/docs/quickstart.astro` | Added `docs_quickstart_viewed` event |
| `src/pages/docs/installation.astro` | Added `docs_installation_viewed` event |
| `src/pages/docs/api/index.astro` | Added `docs_api_overview_viewed` event |
| `src/pages/docs/api/authentication.astro` | Added `docs_authentication_viewed` event |
| `src/pages/docs/api/endpoints.astro` | Added `docs_endpoints_viewed` event |
| `src/pages/docs/workflows.astro` | Added `docs_workflows_viewed` event |

## Next steps

We recommend building the following insights and a dashboard in PostHog to monitor user behavior based on the events just instrumented. Visit your PostHog project to create them:

- **[New Dashboard →](https://us.posthog.com/project/238460/dashboards)** — Create an "Analytics basics" dashboard with these insights:
  1. **Documentation Funnel** — Funnel: `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_api_overview_viewed` → `docs_authentication_viewed`
  2. **Homepage CTAs** — Trends: `get_started_clicked` and `api_reference_clicked` over time
  3. **Feature Card Clicks** — Trends: `feature_card_clicked` broken down by `card_title` property
  4. **Sidebar Navigation** — Trends: `sidebar_link_clicked` broken down by `section` property
  5. **API Docs Engagement** — Trends: `docs_api_overview_viewed`, `docs_authentication_viewed`, `docs_endpoints_viewed` together

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
