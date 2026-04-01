<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow Astro SSR documentation site. Here is a summary of what was added:

- **`src/components/posthog.astro`** — New component that initialises the PostHog web snippet using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables. Uses the `is:inline` directive to prevent Astro from processing it.
- **`src/layouts/Layout.astro`** — Updated to import and render `<PostHog />` in the `<head>`, so every page on the site is tracked.
- **`src/pages/index.astro`** — Click tracking added for the "Get Started" and "API Reference" hero CTAs, and for all feature cards (with card title and destination href as properties).
- **`src/components/Navigation.astro`** — Click tracking added for the GitHub link in the top navigation.
- **`src/components/DocsSidebar.astro`** — Click tracking added for sidebar navigation links (with label and href as properties).
- **`src/pages/docs/quickstart.astro`** — `quickstart_viewed` event fires on page load (top of getting-started funnel).
- **`src/pages/docs/installation.astro`** — `installation_viewed` event fires on page load.
- **`src/pages/docs/api/index.astro`** — `api_docs_viewed` event fires on page load.

Environment variables written to `.env`:
- `PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog project token (exposed to browser)
- `PUBLIC_POSTHOG_HOST` — PostHog ingest host
- `POSTHOG_PROJECT_TOKEN` — PostHog project token (server-side)
- `POSTHOG_HOST` — PostHog ingest host (server-side)

Packages installed: `posthog-js`, `posthog-node`

## Events

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the "Get Started" CTA button on the homepage hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" CTA button on the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage; includes `card_title` and `href` properties | `src/pages/index.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of the getting-started conversion funnel | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page — indicates active intent to use the SDK | `src/pages/docs/installation.astro` |
| `github_link_clicked` | User clicks the GitHub link in the main navigation | `src/components/Navigation.astro` |
| `sidebar_link_clicked` | User clicks a sidebar navigation link; includes `label` and `href` properties | `src/components/DocsSidebar.astro` |
| `api_docs_viewed` | User views the API Reference overview page | `src/pages/docs/api/index.astro` |

## Next steps

We've prepared an "Analytics basics" dashboard for you in PostHog. Set it up with these five insights to track user behaviour across the key journeys:

1. **Getting started funnel** — Funnel insight with steps: `get_started_clicked` → `quickstart_viewed` → `installation_viewed`. Tracks how many visitors convert from the homepage CTA to completing the getting-started flow.

2. **API interest funnel** — Funnel insight with steps: `api_reference_clicked` → `api_docs_viewed`. Measures how many users who click the API Reference CTA follow through to the API docs.

3. **Feature card clicks over time** — Trend insight for `feature_card_clicked`, broken down by `href`. Shows which feature cards drive the most engagement.

4. **Sidebar navigation clicks** — Trend insight for `sidebar_link_clicked`, broken down by `label`. Reveals which documentation sections are most visited from the sidebar.

5. **External GitHub clicks** — Trend insight for `github_link_clicked` over time. Indicates how many docs visitors are interested in the GitHub repo.

- [Go to PostHog dashboards](https://us.posthog.com/project/238460/dashboards)
- [Create a new insight](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
