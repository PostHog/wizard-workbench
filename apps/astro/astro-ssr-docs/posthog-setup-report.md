# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the NeuralFlow documentation site — a server-rendered Astro (SSR) application. The integration includes:

- **`src/components/posthog.astro`** — New client-side PostHog initialization component using the web snippet with `is:inline` to prevent Astro TypeScript processing. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/lib/posthog-server.ts`** — New server-side PostHog singleton using `posthog-node`, ready for use in any future API routes. Uses `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables.
- **`src/layouts/Layout.astro`** — Updated to import and render `<PostHog />` in the `<head>`, enabling analytics across all pages that use this layout (including all documentation pages via `DocsLayout`).
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, and `POSTHOG_HOST`.

Ten events were added across six files to track developer onboarding, CTA engagement, navigation, and content discovery.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary 'Get Started' CTA button on the home page hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' button on the home page hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks one of the feature cards on the home page (includes `card_title` and `card_href` properties) | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA in the top navigation bar | `src/components/Navigation.astro` |
| `nav_github_clicked` | User clicks the GitHub link in the top navigation bar | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of the developer onboarding conversion funnel | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the Authentication documentation page — key step in developer activation funnel | `src/pages/docs/api/authentication.astro` |
| `docs_sidebar_link_clicked` | User clicks a link in the documentation sidebar (includes `section`, `destination`, and `label` properties) | `src/components/DocsSidebar.astro` |
| `docs_quickstart_link_clicked` | User clicks the 'Quick Start guide' link from the Docs Introduction page | `src/pages/docs/index.astro` |
| `workflows_viewed` | User views the Workflows documentation page — indicates interest in core platform features | `src/pages/docs/workflows.astro` |

## Next steps

Set up an **"Analytics basics"** dashboard in PostHog with these suggested insights to monitor user behavior:

1. **CTA Engagement Trend** — Trends chart for `get_started_clicked`, `api_reference_clicked`, and `nav_get_started_clicked` over time, showing how well CTAs drive developer intent.
2. **Developer Onboarding Funnel** — Funnel from `quickstart_viewed` → `authentication_docs_viewed`, revealing how many users who start the quickstart proceed to learn about authentication.
3. **Feature Card Clicks Breakdown** — Breakdown of `feature_card_clicked` by `card_title` property, showing which docs sections attract the most interest from the home page.
4. **Sidebar Navigation Breakdown** — Breakdown of `docs_sidebar_link_clicked` by `section` property, showing which documentation sections users navigate to most.
5. **Content Engagement Overview** — Trends chart combining `quickstart_viewed`, `workflows_viewed`, and `authentication_docs_viewed` to track overall docs engagement over time.

Create your dashboard at: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
