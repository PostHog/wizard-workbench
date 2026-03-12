<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro SSR documentation site (NeuralFlow Docs).

**Changes made:**

- Installed `posthog-js` and `posthog-node` as dependencies
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` (`.gitignore` covered)
- Created `src/components/posthog.astro` — client-side PostHog initialization using the web snippet with `is:inline` and environment variables
- Created `src/lib/posthog-server.ts` — singleton `posthog-node` client for server-side tracking in API routes
- Updated `src/layouts/Layout.astro` — imports and renders `<PostHog />` in `<head>` so all pages are tracked
- Added click-tracking scripts to `src/pages/index.astro` (hero CTAs and feature cards) and `src/components/Navigation.astro` (GitHub link, Get Started CTA)
- Added page-viewed events to five documentation pages in the developer onboarding funnel

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary 'Get Started' CTA in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' CTA in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA in the top navigation | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start guide — top of the developer funnel | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page — intent to integrate the SDK | `src/pages/docs/installation.astro` |
| `api_docs_viewed` | User views the main API reference index | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the Authentication documentation | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User views the full API endpoints reference | `src/pages/docs/api/endpoints.astro` |

## Next steps

We've prepared the following insights and dashboard for you to set up in PostHog to monitor user behavior. Visit your PostHog project and create an **"Analytics basics"** dashboard with these five insights:

1. **Developer Onboarding Funnel** — Funnel: `get_started_clicked` → `quickstart_viewed` → `installation_viewed`
2. **CTA Click Trends** — Trends line chart: `get_started_clicked`, `nav_get_started_clicked`, `api_reference_clicked`
3. **API Docs Engagement** — Trends line chart: `api_docs_viewed`, `authentication_docs_viewed`, `api_endpoints_viewed`
4. **Feature Card Clicks** — Trends bar chart: `feature_card_clicked` (break down by `card_title` property)
5. **GitHub Link Clicks** — Trends line chart: `github_link_clicked`

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
