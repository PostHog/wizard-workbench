# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow documentation site. Changes include:

- **`src/components/posthog.astro`** (new) — PostHog browser snippet component using `is:inline` to prevent Astro processing. Reads token and host from `PUBLIC_POSTHOG_PROJECT_TOKEN` / `PUBLIC_POSTHOG_HOST` env vars.
- **`src/lib/posthog-server.ts`** (new) — Singleton `posthog-node` client for server-side tracking. Reads from `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST` env vars.
- **`src/pages/api/feedback.ts`** (new) — API route that captures `doc_feedback_submitted` server-side, accepting `page`, `helpful`, and `distinctId` in the request body; passes PostHog session and distinct IDs via headers.
- **`src/layouts/Layout.astro`** — Imports and mounts `<PostHog />` in the document `<head>` so every page initialises analytics.
- **`src/layouts/DocsLayout.astro`** — Adds a "Was this page helpful?" feedback widget at the bottom of every docs page; submits to `/api/feedback` with session and distinct IDs attached.
- **`src/pages/index.astro`** — Tracks hero CTA clicks (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked`).
- **`src/components/Navigation.astro`** — Tracks "Get Started" nav link clicks (`nav_get_started_clicked`).
- **`src/pages/docs/quickstart.astro`** — Fires `quickstart_viewed` on load (top of conversion funnel).
- **`src/pages/docs/installation.astro`** — Fires `installation_viewed` on load (strong SDK adoption signal).
- **`src/pages/docs/api/authentication.astro`** — Fires `api_authentication_viewed` on load (production-readiness signal).
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` written (and `.gitignore`-covered).
- **`package.json`** — `posthog-js` and `posthog-node` added as dependencies.

## Events

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button on the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' CTA button on the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage, indicating interest in a specific documentation section. | `src/pages/index.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide page, indicating they are actively evaluating NeuralFlow integration. | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User viewed the Installation page, a strong signal they intend to integrate the SDK. | `src/pages/docs/installation.astro` |
| `api_authentication_viewed` | User viewed the API Authentication docs, signaling intent to build a production integration. | `src/pages/docs/api/authentication.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' call-to-action link in the top navigation bar. | `src/components/Navigation.astro` |
| `doc_feedback_submitted` | User submitted helpful/not-helpful feedback on a documentation page via the server-side feedback API. | `src/pages/api/feedback.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/2/dashboard/1730002)
  - [Docs conversion funnel](https://us.i.posthog.com/project/2/insights/9360001) — `get_started_clicked` → `quickstart_viewed` → `api_authentication_viewed`
  - [CTA engagement over time](https://us.i.posthog.com/project/2/insights/9360002) — `get_started_clicked` + `nav_get_started_clicked` trend
  - [Doc feedback quality signal](https://us.i.posthog.com/project/2/insights/9360003) — `doc_feedback_submitted` by `helpful` property
  - [Feature interest breakdown](https://us.i.posthog.com/project/2/insights/9360004) — `feature_card_clicked` by card
  - [Docs engagement funnel steps over time](https://us.i.posthog.com/project/2/insights/9360005) — `quickstart_viewed` + `installation_viewed` + `api_authentication_viewed` trend

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
