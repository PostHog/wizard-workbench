<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow Astro SSR documentation site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new) — Client-side PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables at build time. Initialises `posthog-js` on every page.
- **`src/lib/posthog-server.ts`** (new) — Singleton pattern for the `posthog-node` server-side client, used for any future API route tracking.
- **`src/layouts/Layout.astro`** (edited) — Imports and renders `<PostHog />` inside `<head>` so every page in the site is tracked.
- **`src/pages/index.astro`** (edited) — Tracks `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` events on hero CTA and feature card clicks.
- **`src/components/Navigation.astro`** (edited) — Tracks `nav_get_started_clicked` when the top-nav "Get Started" CTA is clicked.
- **`src/pages/docs/quickstart.astro`** (edited) — Fires `quickstart_viewed` on page load (top of developer adoption funnel).
- **`src/pages/docs/api/authentication.astro`** (edited) — Fires `authentication_docs_viewed` on page load (signals API key setup intent).
- **`src/components/DocsSidebar.astro`** (edited) — Tracks `docs_sidebar_link_clicked` with `label` and `destination` properties on every sidebar navigation click.
- **`.env`** (created) — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` environment variables set.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | Hero "Get Started" button clicked | `src/pages/index.astro` |
| `api_reference_clicked` | Hero "API Reference" button clicked | `src/pages/index.astro` |
| `feature_card_clicked` | Feature card clicked on homepage (includes `card_title`, `destination`) | `src/pages/index.astro` |
| `nav_get_started_clicked` | Top-nav "Get Started" CTA clicked | `src/components/Navigation.astro` |
| `quickstart_viewed` | Quick Start page viewed — top of developer adoption funnel | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | Authentication docs viewed — signals intent to set up API keys | `src/pages/docs/api/authentication.astro` |
| `docs_sidebar_link_clicked` | Sidebar navigation link clicked (includes `label`, `destination`) | `src/components/DocsSidebar.astro` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Developer adoption funnel** — Funnel insight with steps: `get_started_clicked` → `quickstart_viewed` → `authentication_docs_viewed`. Shows the percentage of visitors who progress from the homepage CTA all the way to the authentication docs (a strong signal of integration intent).
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **Homepage CTA clicks over time** — Trend insight tracking `get_started_clicked` and `api_reference_clicked` event counts over time. Tracks overall acquisition/interest trends.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

3. **Most popular feature cards** — Trend insight for `feature_card_clicked` broken down by `card_title` property. Shows which features drive the most developer interest.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

4. **Top sidebar navigation destinations** — Trend insight for `docs_sidebar_link_clicked` broken down by `destination` property. Reveals the most-read sections of the docs.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

5. **Authentication docs views over time** — Trend insight for `authentication_docs_viewed`. A sustained increase is a leading indicator of growing developer adoption.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

[Open PostHog project](https://us.posthog.com/project/2)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
