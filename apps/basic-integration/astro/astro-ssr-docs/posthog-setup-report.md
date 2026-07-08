# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow documentation site (Astro SSR). The following changes were made:

- **`src/components/posthog.astro`** — New component containing the PostHog JS snippet, initialized with environment variables. Uses `is:inline` to prevent Astro from processing the script.
- **`src/layouts/Layout.astro`** — Updated to import and render the `posthog.astro` component in `<head>`, enabling PostHog tracking across all pages.
- **`src/lib/posthog-server.ts`** — New singleton for the `posthog-node` server-side client, ready for use in future API routes.
- **`src/pages/index.astro`** — Added inline event tracking for homepage CTA buttons (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked` with a `section` property).
- **`src/components/Navigation.astro`** — Added inline event tracking for the GitHub link (`github_link_clicked`) and navigation "Get Started" CTA (`nav_get_started_clicked`).
- **`src/pages/docs/quickstart.astro`** — Added `quickstart_viewed` event on page load, marking entry into the developer onboarding funnel.
- **`.env`** — Created with `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary "Get Started" CTA button in the hero section of the homepage. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the "API Reference" secondary CTA button in the hero section of the homepage. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage, indicating interest in a specific documentation section. Property: `section`. | `src/pages/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar. | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide page, marking entry into the developer onboarding funnel. | `src/pages/docs/quickstart.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818065)
- [Developer onboarding funnel](https://us.posthog.com/project/483112/insights/O1ZkLbNE) — Conversion from "Get Started" click to Quickstart page view
- [Homepage CTA clicks over time](https://us.posthog.com/project/483112/insights/ME1jNaac) — Daily trend of Get Started vs API Reference button clicks
- [Feature card clicks by section](https://us.posthog.com/project/483112/insights/xuRuJbh0) — Which docs sections attract the most interest from the homepage grid
- [Navigation engagement over time](https://us.posthog.com/project/483112/insights/jgbl4G24) — Daily trend of GitHub link and nav CTA clicks
- [Quickstart page views over time](https://us.posthog.com/project/483112/insights/LI9Bt7hi) — Volume of developers entering the onboarding funnel

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
