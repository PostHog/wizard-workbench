<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Docs Astro SSR application. The following changes were made:

- **`src/components/posthog.astro`** (new): PostHog client-side initialization snippet using the `is:inline` directive to prevent Astro from processing it. Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/layouts/Layout.astro`** (edited): Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog is loaded on every page (directly and via `DocsLayout`).
- **`src/pages/index.astro`** (edited): Tracks `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` events on button and card interactions.
- **`src/components/Navigation.astro`** (edited): Tracks `github_link_clicked` and `nav_get_started_clicked` events in the nav bar.
- **`src/components/DocsSidebar.astro`** (edited): Tracks `sidebar_link_clicked` events with `label` and `destination` properties on every sidebar navigation link.
- **`src/pages/docs/quickstart.astro`** (edited): Fires `quickstart_viewed` on load (top of developer onboarding funnel) and `code_copied` when a user clicks a code block.
- **`src/pages/docs/installation.astro`** (edited): Fires `installation_viewed` on load (signals SDK setup intent).
- **`src/pages/docs/api/authentication.astro`** (edited): Fires `authentication_docs_viewed` on load (top of API adoption funnel).
- **`.env`** (new): `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` set with correct values. `.gitignore` coverage ensured.
- **`package.json`** (updated): `posthog-node` added as a dependency for future server-side event tracking in API routes.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked "Get Started" in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked "API Reference" in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the nav bar | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked "Get Started" CTA in the nav bar | `src/components/Navigation.astro` |
| `sidebar_link_clicked` | User clicked a sidebar navigation link | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide (onboarding funnel top) | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User viewed the Installation page (SDK setup intent) | `src/pages/docs/installation.astro` |
| `authentication_docs_viewed` | User viewed Authentication docs (API adoption funnel top) | `src/pages/docs/api/authentication.astro` |
| `code_copied` | User copied a code snippet from the Quick Start page | `src/pages/docs/quickstart.astro` |

## Next steps

Visit your PostHog project to create an **"Analytics basics"** dashboard with these recommended insights:

- **Developer Onboarding Funnel** — Conversion funnel: `installation_viewed` → `quickstart_viewed` → `code_copied`
- **Homepage CTA Engagement** — Trend of `get_started_clicked` and `api_reference_clicked` over time
- **Feature Card Clicks by Destination** — Breakdown of `feature_card_clicked` by `destination` property
- **Sidebar Navigation Popularity** — Breakdown of `sidebar_link_clicked` by `label` to see which docs sections are most accessed
- **API Adoption Funnel** — Conversion funnel: `authentication_docs_viewed` → `api_reference_clicked`

[Open your PostHog project dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
