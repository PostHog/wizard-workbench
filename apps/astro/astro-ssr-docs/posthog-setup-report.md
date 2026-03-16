<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow Docs Astro SSR project. Here's a summary of changes made:

- **`src/components/posthog.astro`** — Created a new PostHog client-side snippet component using the `is:inline` directive (required to prevent Astro from processing the script and causing TypeScript errors). Reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables via `define:vars`.
- **`src/layouts/Layout.astro`** — Imported the PostHog component and added it to the `<head>` section so it initializes on every page.
- **`src/pages/index.astro`** — Added click tracking for hero CTA buttons and feature cards.
- **`src/components/Navigation.astro`** — Added click tracking for the GitHub link and "Get Started" CTA in the nav bar.
- **`src/components/DocsSidebar.astro`** — Added click tracking for all sidebar navigation links, capturing the destination href and label as properties.
- **`src/pages/docs/quickstart.astro`** — Added a page-view event (top of SDK adoption funnel) and code-copy tracking on all code blocks.
- **`src/pages/docs/api/authentication.astro`** — Added a page-view event indicating API integration intent.
- **`src/pages/docs/api/endpoints.astro`** — Added a page-view event for API reference browsing.
- **`.env`** — Populated with `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `docs_get_started_clicked` | User clicks the 'Get Started' CTA button on the homepage hero section | `src/pages/index.astro` |
| `docs_api_reference_clicked` | User clicks the 'API Reference' CTA button on the homepage hero section | `src/pages/index.astro` |
| `docs_feature_card_clicked` | User clicks on a feature card on the homepage (with `card_title` property) | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User views the Quick Start guide page — top of SDK adoption funnel | `src/pages/docs/quickstart.astro` |
| `docs_code_copied` | User clicks a code block to copy a snippet (with `page` property) | `src/pages/docs/quickstart.astro` |
| `docs_authentication_viewed` | User views the Authentication page — indicates API integration intent | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User views the API Endpoints reference page | `src/pages/docs/api/endpoints.astro` |
| `docs_sidebar_link_clicked` | User clicks a docs sidebar link (with `href` and `label` properties) | `src/components/DocsSidebar.astro` |
| `docs_github_link_clicked` | User clicks the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `docs_nav_cta_clicked` | User clicks the 'Get Started' CTA in the main navigation bar | `src/components/Navigation.astro` |

## Next steps

To build insights and a dashboard from these events, visit your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Docs funnel — Homepage to Quickstart to API Reference** — Funnel with steps: `docs_get_started_clicked` → `docs_quickstart_viewed` → `docs_authentication_viewed` — shows how users move through the SDK adoption funnel.
2. **Feature card engagement** — Trends chart for `docs_feature_card_clicked` broken down by `card_title` — shows which docs sections users find most compelling.
3. **Code copy rate** — Unique users who fired `docs_code_copied` vs. `docs_quickstart_viewed` — measures how many quickstart readers actually copy the install command.
4. **Sidebar navigation patterns** — Trends for `docs_sidebar_link_clicked` broken down by `href` — reveals which docs sections users visit most.
5. **External GitHub click-through** — Trends for `docs_github_link_clicked` — tracks external developer interest signals.

- [PostHog project dashboard list](https://us.posthog.com/project/2/dashboard)
- [Create new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
