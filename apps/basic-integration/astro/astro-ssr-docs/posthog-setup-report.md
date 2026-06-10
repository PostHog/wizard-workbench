<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for this Astro SSR documentation site. A browser snippet component (`src/components/posthog.astro`) was created and injected into the shared `Layout.astro` so every page initializes PostHog automatically. Client-side event tracking was added across the homepage and navigation for key engagement actions, and two funnel-entry pageview events were added to the Quick Start and API Overview documentation pages. Environment variables are stored in `.env` and referenced via Astro's `PUBLIC_` prefix — no tokens are hardcoded in source files.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the "Get Started" CTA button in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage grid (includes `card_title` and `destination` properties) | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicks the GitHub link in the top navigation | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start guide — top of developer adoption funnel | `src/pages/docs/quickstart.astro` |
| `api_docs_viewed` | User views the API Overview page — top of developer integration funnel | `src/pages/docs/api/index.astro` |

## Next steps

The PostHog MCP API key didn't have the required scopes (`dashboard:write`, `insight:write`, `query:read`) to create the dashboard programmatically. You can build it manually using the tracked events above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named "Analytics basics (wizard)"

Suggested insights to add:
1. **Docs engagement funnel** — funnel from `get_started_clicked` → `quickstart_viewed` → `api_docs_viewed`
2. **Homepage CTA clicks over time** — trends for `get_started_clicked` and `api_reference_clicked`
3. **Feature card popularity** — `feature_card_clicked` broken down by `card_title`
4. **Nav engagement** — trends for `nav_cta_clicked` and `github_link_clicked`
5. **Developer funnel entry** — trends for `quickstart_viewed` and `api_docs_viewed`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
