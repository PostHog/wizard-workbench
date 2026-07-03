# PostHog post-wizard report

The wizard has completed a deep integration of the NeuralFlow Astro SSR documentation site. PostHog client-side analytics have been added via the snippet pattern, with a reusable `posthog.astro` component included in the root layout so every page is instrumented automatically. Eight targeted events cover the key user actions across the docs site — CTA clicks on the home page, navigation bar interactions, and high-value docs page views that mark entry and progression through the documentation conversion funnel.

## Events added

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA button on the home hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" secondary CTA button on the home hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks one of the feature cards on the home page, indicating interest in a specific docs section. | `src/pages/index.astro` |
| `quickstart_viewed` | User lands on the Quick Start guide, marking the top of the documentation conversion funnel. | `src/pages/docs/quickstart.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar, indicating community or open-source interest. | `src/components/Navigation.astro` |
| `get_started_nav_clicked` | User clicks the "Get Started" CTA button in the top navigation bar. | `src/components/Navigation.astro` |
| `authentication_docs_viewed` | User views the authentication documentation page, signaling active API integration intent. | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User views the API endpoints reference page, indicating active API usage or exploration. | `src/pages/docs/api/endpoints.astro` |

## Files created or modified

- **Created** `src/components/posthog.astro` — PostHog browser snippet, initialized from env vars via `define:vars`
- **Modified** `src/layouts/Layout.astro` — added `<PostHog />` to `<head>` so all pages load the snippet
- **Modified** `src/pages/index.astro` — added `get_started_clicked`, `api_reference_clicked`, `feature_card_clicked` events
- **Modified** `src/components/Navigation.astro` — added `github_link_clicked`, `get_started_nav_clicked` events
- **Modified** `src/pages/docs/quickstart.astro` — added `quickstart_viewed` funnel entry event
- **Modified** `src/pages/docs/api/authentication.astro` — added `authentication_docs_viewed` conversion signal
- **Modified** `src/pages/docs/api/endpoints.astro` — added `api_endpoints_viewed` event

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793433)
- [Quickstart Views (Top of Funnel)](https://us.posthog.com/project/483112/insights/E3pO3cEf)
- [Docs Conversion Funnel](https://us.posthog.com/project/483112/insights/jlfglW4R)
- [Get Started CTA Clicks](https://us.posthog.com/project/483112/insights/kb5tXjEZ)
- [Feature Card Engagement](https://us.posthog.com/project/483112/insights/FP5M4hZP)
- [Navigation Engagement](https://us.posthog.com/project/483112/insights/vvnmfinV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
