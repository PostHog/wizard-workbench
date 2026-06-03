<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. PostHog client-side tracking is now active on every page via a shared `posthog.astro` component injected into the root layout. Ten custom events have been instrumented across the homepage, navigation bar, docs sidebar, and four high-value documentation pages, covering the full developer activation funnel from landing on the homepage through exploring the API reference.

## Files created

| File | Purpose |
|---|---|
| `src/components/posthog.astro` | PostHog snippet component — initialises the client-side SDK using environment variables |
| `.env` | PostHog public token and host (both public and server-side variants) |

## Files edited

| File | Changes |
|---|---|
| `src/layouts/Layout.astro` | Imports and renders `<PostHog />` in `<head>` so tracking is active on every page |
| `src/pages/index.astro` | Tracks `get_started_clicked`, `api_reference_clicked`, `feature_card_clicked` |
| `src/components/Navigation.astro` | Tracks `nav_cta_clicked`, `github_link_clicked` |
| `src/components/DocsSidebar.astro` | Tracks `docs_sidebar_link_clicked` with label and href |
| `src/pages/docs/quickstart.astro` | Tracks `quickstart_viewed` |
| `src/pages/docs/installation.astro` | Tracks `installation_viewed` |
| `src/pages/docs/api/index.astro` | Tracks `api_docs_viewed` |
| `src/pages/docs/api/authentication.astro` | Tracks `authentication_docs_viewed` |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary "Get Started" CTA in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the "API Reference" button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage (includes `card_title`, `card_href`) | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicked "Get Started" in the top navigation bar | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicked a docs sidebar link (includes `link_label`, `link_href`) | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User viewed the Quick Start page — top of the developer activation funnel | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User viewed the Installation page | `src/pages/docs/installation.astro` |
| `api_docs_viewed` | User viewed the API Overview page | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User viewed the Authentication docs | `src/pages/docs/api/authentication.astro` |

## Next steps

A PostHog dashboard could not be created automatically because the configured API key is missing the `dashboard:write` and `query:read` scopes. To create a dashboard manually, visit [PostHog Dashboards](/dashboard) and build insights around:

- **Developer activation funnel** — `quickstart_viewed` → `installation_viewed` → `api_docs_viewed` → `authentication_docs_viewed`
- **Homepage CTA conversion** — trends for `get_started_clicked` and `api_reference_clicked` over time
- **Feature card popularity** — `feature_card_clicked` broken down by `card_title`
- **Docs navigation patterns** — `docs_sidebar_link_clicked` broken down by `link_href`
- **GitHub interest** — trend of `github_link_clicked`

To enable dashboard creation via the wizard in future, add the `dashboard:write`, `insight:write`, and `query:read` scopes to your PostHog personal API key at [/settings/user-api-keys](/settings/user-api-keys).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
