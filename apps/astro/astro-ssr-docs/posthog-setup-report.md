<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The integration includes:

- **Client-side analytics** via the PostHog JS snippet, embedded in the root `Layout.astro` through a reusable `posthog.astro` component. All pages using this layout automatically get analytics.
- **Server-side client** via `posthog-node` with a singleton pattern in `src/lib/posthog-server.ts`, ready for use in any API routes.
- **10 tracked events** across the homepage, documentation pages, navigation, and sidebar — covering the full developer onboarding funnel from landing page through to API reference engagement.
- **Environment variables** configured in `.env` with `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` for client-side use and `POSTHOG_API_KEY` / `POSTHOG_HOST` for server-side use.

## New files created

| File | Purpose |
|------|---------|
| `src/components/posthog.astro` | Client-side PostHog JS snippet component (`is:inline` to avoid TS errors) |
| `src/lib/posthog-server.ts` | Server-side `posthog-node` singleton client |

## Files modified

| File | Change |
|------|--------|
| `src/layouts/Layout.astro` | Imports and renders `<PostHog />` in `<head>` |
| `src/pages/index.astro` | Tracks hero CTA and feature card clicks |
| `src/pages/docs/quickstart.astro` | Tracks quickstart page view |
| `src/pages/docs/installation.astro` | Tracks installation page view |
| `src/pages/docs/api/authentication.astro` | Tracks authentication docs view |
| `src/pages/docs/api/endpoints.astro` | Tracks API endpoints docs view |
| `src/components/Navigation.astro` | Tracks GitHub link and nav CTA clicks |
| `src/components/DocsSidebar.astro` | Tracks sidebar navigation clicks |

## Events instrumented

| Event Name | Description | File |
|-----------|-------------|------|
| `get_started_clicked` | User clicked the 'Get Started' CTA button on the home page hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button on the home page hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the home page, indicating interest in a specific doc section | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User viewed the Quick Start guide page — top of the conversion funnel for developer onboarding | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User viewed the Installation guide — key step in developer onboarding funnel | `src/pages/docs/installation.astro` |
| `docs_api_authentication_viewed` | User viewed the API Authentication docs — indicates high intent to integrate | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User viewed the API Endpoints reference — deep engagement with the API | `src/pages/docs/api/endpoints.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `sidebar_link_clicked` | User clicked a link in the documentation sidebar to navigate between docs sections | `src/components/DocsSidebar.astro` |

## Next steps

We recommend building the following insights and a dashboard in PostHog to keep an eye on user behavior based on the events just instrumented:

- **[PostHog Project](https://us.posthog.com/project/238460)** — Your PostHog project home
- **[Create Dashboard](https://us.posthog.com/project/238460/dashboard)** — Create an "Analytics basics" dashboard

### Suggested insights to create

1. **Developer Onboarding Funnel** — Funnel: `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_api_authentication_viewed` → `docs_api_endpoints_viewed`
2. **Homepage CTA Clicks** — Trend: `get_started_clicked`, `api_reference_clicked`, `feature_card_clicked` over 30 days
3. **Docs Content Engagement** — Bar chart: count of each `docs_*_viewed` event to see most popular content
4. **High-Intent Signals** — Trend: `github_link_clicked` + `nav_get_started_clicked` over time
5. **Sidebar Navigation Breakdown** — `sidebar_link_clicked` broken down by `destination` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
