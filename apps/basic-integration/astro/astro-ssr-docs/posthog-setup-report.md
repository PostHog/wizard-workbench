<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow documentation site (Astro SSR). Here's a summary of what was added:

- **`src/components/posthog.astro`** — New client-side PostHog snippet component using the `is:inline` directive to prevent Astro from processing it. Reads keys from environment variables.
- **`src/lib/posthog-server.ts`** — New singleton pattern for the `posthog-node` server-side client, ready for use in any API routes you add in the future.
- **`src/layouts/Layout.astro`** — Updated to import and render `<PostHog />` in the `<head>`, so all pages are automatically instrumented.
- **`src/pages/index.astro`** — Added click tracking for hero CTA buttons and feature cards.
- **`src/components/Navigation.astro`** — Added click tracking for the GitHub link and "Get Started" nav CTA.
- **`src/pages/docs/quickstart.astro`** — Added click tracking for "What's Next" links at the bottom of the quickstart guide.
- **`src/components/DocsSidebar.astro`** — Added click tracking for all sidebar navigation links.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the 'Get Started' CTA in the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' CTA in the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage (includes `card_title`, `href`) | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA in the top navigation bar | `src/components/Navigation.astro` |
| `quickstart_next_step_clicked` | User clicked a 'What's Next' link at the bottom of the quickstart guide (includes `link_text`, `href`) | `src/pages/docs/quickstart.astro` |
| `docs_sidebar_link_clicked` | User clicked a link in the documentation sidebar (includes `link_text`, `href`) | `src/components/DocsSidebar.astro` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to set up in PostHog. Create it at the link below, then add these five insights:

**Create dashboard:** https://us.posthog.com/project/2/dashboards/new

**Insights to add:**

1. **Homepage CTA Clicks** — Trend of `get_started_clicked` + `api_reference_clicked` over time to see which hero button drives more engagement.
   https://us.posthog.com/project/2/insights/new#insight=TRENDS

2. **Docs Engagement Funnel** — Funnel from `get_started_clicked` → `quickstart_next_step_clicked` to measure how many visitors who click "Get Started" actually progress through the quickstart guide.
   https://us.posthog.com/project/2/insights/new#insight=FUNNELS

3. **Feature Card Popularity** — Trend of `feature_card_clicked` broken down by `card_title` to see which docs sections attract the most interest.
   https://us.posthog.com/project/2/insights/new#insight=TRENDS

4. **Docs Navigation Patterns** — Trend of `docs_sidebar_link_clicked` broken down by `link_text` to understand which docs sections users visit most.
   https://us.posthog.com/project/2/insights/new#insight=TRENDS

5. **GitHub & Outbound Clicks** — Trend of `github_link_clicked` + `nav_get_started_clicked` to track external developer engagement.
   https://us.posthog.com/project/2/insights/new#insight=TRENDS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
