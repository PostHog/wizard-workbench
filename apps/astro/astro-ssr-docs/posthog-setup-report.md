<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The integration includes both client-side tracking via the PostHog JS snippet and a server-side singleton client using `posthog-node`. PostHog is initialized in the root `Layout.astro` so every page is covered automatically. Nine events were instrumented across the homepage, navigation, sidebar, and key documentation pages, providing visibility into user onboarding behavior and content engagement.

**Files created:**
- `src/components/posthog.astro` — PostHog JS snippet component (client-side initialization)
- `src/lib/posthog-server.ts` — Server-side PostHog singleton using `posthog-node`

**Files modified:**
- `src/layouts/Layout.astro` — Added PostHog component to `<head>`
- `src/pages/index.astro` — Hero CTA and feature card click tracking
- `src/components/Navigation.astro` — GitHub and Get Started nav link tracking
- `src/components/DocsSidebar.astro` — Sidebar link click tracking
- `src/pages/docs/quickstart.astro` — Quickstart page viewed event
- `src/pages/docs/installation.astro` — Installation page viewed event
- `src/pages/docs/api/authentication.astro` — Authentication page viewed event

**Environment variables added to `.env`:**
- `PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog project token (client-side)
- `PUBLIC_POSTHOG_HOST` — PostHog host (client-side)
- `POSTHOG_PROJECT_TOKEN` — PostHog project token (server-side)
- `POSTHOG_HOST` — PostHog host (server-side)

| Event | Description | File |
|-------|-------------|------|
| `docs_get_started_clicked` | User clicks the 'Get Started' button on the homepage hero section | `src/pages/index.astro` |
| `docs_api_reference_clicked` | User clicks the 'API Reference' button on the homepage hero section | `src/pages/index.astro` |
| `docs_feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start page — top of the onboarding funnel | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User views the Installation page — signals active intent to integrate | `src/pages/docs/installation.astro` |
| `docs_authentication_viewed` | User views the Authentication page — signals intent to set up API keys or OAuth | `src/pages/docs/api/authentication.astro` |
| `docs_nav_github_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `docs_nav_get_started_clicked` | User clicks the 'Get Started' CTA in the top navigation | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a link in the documentation sidebar | `src/components/DocsSidebar.astro` |

## Next steps

A dashboard named **"Analytics basics"** was planned with these 5 insights based on the instrumented events:

1. **Onboarding Funnel** — `docs_get_started_clicked` → `docs_quickstart_viewed` → `docs_installation_viewed` → `docs_authentication_viewed`
2. **Homepage CTA Clicks** — Trend of `docs_get_started_clicked` and `docs_api_reference_clicked` over time
3. **Feature Card Engagement** — Trend of `docs_feature_card_clicked` over time
4. **Docs Navigation Clicks** — Trend of `docs_sidebar_link_clicked` over time
5. **GitHub Link Clicks** — Trend of `docs_nav_github_clicked` over time

You can create these in your PostHog project at https://us.i.posthog.com once data starts flowing.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
