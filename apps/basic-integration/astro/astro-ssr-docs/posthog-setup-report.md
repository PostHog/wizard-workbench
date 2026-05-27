<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new) — PostHog client-side snippet component using `is:inline` and `define:vars` to inject environment variables safely. Initialised via `posthog.init()` with token and host from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.
- **`src/layouts/Layout.astro`** (edited) — Imports and renders `<PostHog />` inside `<head>`, ensuring PostHog is loaded on every page of the site.
- **`src/pages/index.astro`** (edited) — Tracks `get_started_clicked` and `api_reference_clicked` on the hero CTAs, and `feature_card_clicked` (with `section` property) on each of the six feature cards.
- **`src/components/Navigation.astro`** (edited) — Tracks `github_link_clicked` and `nav_get_started_clicked` on the nav bar links.
- **`src/pages/docs/quickstart.astro`** (edited) — Captures `quickstart_viewed` on page load, marking the entry to the developer onboarding funnel.
- **`src/components/DocsSidebar.astro`** (edited) — Tracks `docs_sidebar_link_clicked` with `destination` and `label` properties on every sidebar navigation link.
- **`src/lib/posthog-server.ts`** (new) — Singleton `posthog-node` client for server-side event tracking in any future API routes.
- **`.env`** (created) — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` added and covered by `.gitignore`.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA in the hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" secondary CTA in the hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the home page (`section` property indicates which) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start guide — top of the developer onboarding funnel | `src/pages/docs/quickstart.astro` |
| `docs_sidebar_link_clicked` | User clicks a sidebar link (`destination` and `label` properties indicate the target) | `src/components/DocsSidebar.astro` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these suggested insights:

1. **Get Started funnel** — Funnel from `get_started_clicked` → `quickstart_viewed` to measure CTA-to-onboarding conversion.
2. **Feature card clicks over time** — Trends for `feature_card_clicked` broken down by `section` to see which docs sections attract the most interest.
3. **Sidebar navigation trends** — Trends for `docs_sidebar_link_clicked` broken down by `destination` to identify the most-visited docs pages.
4. **Hero CTA comparison** — Trends comparing `get_started_clicked` vs `api_reference_clicked` to understand user intent split.
5. **GitHub link clicks** — Trends for `github_link_clicked` as a community engagement signal.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboards/new)
- [Insights explorer](https://us.posthog.com/project/2/insights)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
