# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The following changes were made:

- **New file `src/components/posthog.astro`**: Client-side PostHog snippet component using `is:inline` to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **New file `src/lib/posthog-server.ts`**: Server-side PostHog singleton using `posthog-node`, ready for use in any API routes. Reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables.
- **Updated `src/layouts/Layout.astro`**: Imports and renders `<PostHog />` in `<head>`, so all pages automatically load the analytics snippet.
- **Updated `src/pages/index.astro`**: Tracks `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` events on the homepage.
- **Updated `src/components/Navigation.astro`**: Tracks `github_link_clicked` and `nav_cta_clicked` events in the top navigation bar.
- **Updated `src/components/DocsSidebar.astro`**: Tracks `docs_nav_link_clicked` events (with label and destination) for all sidebar navigation links.
- **Updated `src/pages/docs/quickstart.astro`**: Fires `quickstart_viewed` — top of the SDK onboarding funnel.
- **Updated `src/pages/docs/installation.astro`**: Fires `installation_viewed` — signals active SDK adoption intent.
- **Updated `src/pages/docs/api/index.astro`**: Fires `api_docs_viewed` — signals developer interest in the REST API.
- **Updated `src/pages/docs/api/authentication.astro`**: Fires `authentication_docs_viewed` — strong signal of active API integration.
- **New `.env`**: PostHog public token and host set for both client-side (`PUBLIC_` prefix) and server-side variables.
- **Installed packages**: `posthog-js` and `posthog-node`.

## Events

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (with `card_title`, `destination`) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of SDK adoption funnel | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page — intent to adopt the SDK | `src/pages/docs/installation.astro` |
| `docs_nav_link_clicked` | User clicks a sidebar navigation link (with `label`, `destination`) | `src/components/DocsSidebar.astro` |
| `api_docs_viewed` | User views the API Reference overview — developer interest signal | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the Authentication docs — active API integration signal | `src/pages/docs/api/authentication.astro` |

## Next steps

To build a dashboard from these events, navigate to your PostHog project and create an **"Analytics basics"** dashboard with insights such as:

1. **SDK Adoption Funnel** — Funnel: `quickstart_viewed` → `installation_viewed` → `api_docs_viewed` → `authentication_docs_viewed`
2. **Homepage CTA Clicks** — Trend: `get_started_clicked` + `api_reference_clicked` over time
3. **Feature Card Engagement** — Breakdown of `feature_card_clicked` by `card_title`
4. **Docs Navigation Heatmap** — Breakdown of `docs_nav_link_clicked` by `label`
5. **External Link Clicks** — Trend: `github_link_clicked` over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
