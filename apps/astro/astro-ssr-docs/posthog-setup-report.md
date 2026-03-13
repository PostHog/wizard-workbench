<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). The integration covers both client-side event tracking via the PostHog JavaScript snippet and a server-side singleton using `posthog-node`.

**Files created:**
- `src/components/posthog.astro` — PostHog web snippet component initialized from environment variables, using `is:inline` to prevent Astro TypeScript processing
- `src/lib/posthog-server.ts` — Singleton `getPostHogServer()` for server-side tracking via `posthog-node`
- `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`

**Files modified:**
- `src/layouts/Layout.astro` — imports and renders `<PostHog />` in `<head>` so every page loads the analytics snippet
- `src/pages/index.astro` — CTA and feature card click events
- `src/components/Navigation.astro` — navigation CTA and GitHub link events
- `src/components/DocsSidebar.astro` — sidebar navigation click events
- `src/pages/docs/quickstart.astro` — funnel entry-point view event
- `src/pages/docs/installation.astro` — SDK adoption intent view event
- `src/pages/docs/api/index.astro` — developer engagement view event
- `src/pages/docs/api/authentication.astro` — deep engagement view event

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the "Get Started" hero CTA button | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" hero button | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the top navigation | `src/components/Navigation.astro` |
| `nav_github_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start guide (top of funnel) | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page (SDK adoption signal) | `src/pages/docs/installation.astro` |
| `api_docs_viewed` | User views the API Reference overview (developer engagement) | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the Authentication docs (production integration intent) | `src/pages/docs/api/authentication.astro` |
| `sidebar_link_clicked` | User clicks a link in the docs sidebar | `src/components/DocsSidebar.astro` |

## Next steps

We've outlined five recommended insights for a **"Analytics basics"** dashboard. You can create them in PostHog:

1. **Developer Onboarding Funnel** — Funnel insight tracking the path `quickstart_viewed` → `installation_viewed` → `api_docs_viewed` → `authentication_docs_viewed`. Shows where developers drop off on the way to production-ready integration.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

2. **CTA Click Trends** — Trend insight showing `get_started_clicked`, `api_reference_clicked`, and `nav_get_started_clicked` over time. Measures how effectively the docs drive developer intent.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

3. **Feature Card Clicks by Topic** — Bar chart of `feature_card_clicked` broken down by the `title` property. Reveals which product areas generate the most interest from the homepage.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Docs Navigation Patterns** — Bar chart of `sidebar_link_clicked` broken down by `label`. Shows which documentation sections users navigate to most via the sidebar.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **GitHub Interest** — Trend of `nav_github_clicked` over time. Useful for correlating external developer interest spikes with content or marketing changes.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

[Create "Analytics basics" dashboard →](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
