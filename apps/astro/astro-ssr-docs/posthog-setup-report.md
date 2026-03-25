<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). Here is a summary of every change made:

- **`src/components/posthog.astro`** (new) — PostHog client-side snippet component using `is:inline` and `define:vars` to safely pass `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from environment variables into the browser snippet. This component is imported by the root layout so PostHog loads on every page.
- **`src/lib/posthog-server.ts`** (new) — Server-side PostHog singleton using `posthog-node`. Exports `getPostHogServer()` (singleton) and `shutdownPostHog()` for graceful teardown. Ready for use in any Astro API route.
- **`src/layouts/Layout.astro`** — Added `import PostHog` and `<PostHog />` inside `<head>`, enabling analytics across all pages.
- **`src/pages/index.astro`** — Added `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` events via an inline script listening on button/card clicks.
- **`src/components/Navigation.astro`** — Added `docs_nav_cta_clicked` event on the "Get Started" nav CTA.
- **`src/pages/docs/quickstart.astro`** — Added `quickstart_viewed` event on `DOMContentLoaded`.
- **`src/pages/docs/api/index.astro`** — Added `api_docs_viewed` event on `DOMContentLoaded`.
- **`src/pages/docs/api/authentication.astro`** — Added `authentication_docs_viewed` event on `DOMContentLoaded`.
- **`src/pages/docs/installation.astro`** — Added `installation_docs_viewed` event on `DOMContentLoaded`.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` written via wizard-tools (never hardcoded in source).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicked "Get Started" in the homepage hero — top of the onboarding funnel | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked "API Reference" in the homepage hero — indicates integration intent | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage | `src/pages/index.astro` |
| `docs_nav_cta_clicked` | User clicked "Get Started" in the top navigation bar | `src/components/Navigation.astro` |
| `quickstart_viewed` | User viewed the Quick Start page — key funnel entry point | `src/pages/docs/quickstart.astro` |
| `api_docs_viewed` | User viewed the API Reference overview — signals integration intent | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User viewed the Authentication docs — indicates readiness to integrate | `src/pages/docs/api/authentication.astro` |
| `installation_docs_viewed` | User viewed the Installation page — indicates SDK adoption intent | `src/pages/docs/installation.astro` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Developer onboarding funnel** — Funnel: `get_started_clicked` → `quickstart_viewed` → `installation_docs_viewed` → `api_docs_viewed` → `authentication_docs_viewed`. Shows where developers drop off on the path to integration.

2. **CTA engagement over time** — Trends line chart for `get_started_clicked`, `api_reference_clicked`, and `docs_nav_cta_clicked`. Reveals which entry points drive the most developer interest.

3. **Feature card clicks breakdown** — Trends breakdown of `feature_card_clicked` by `card_title` property. Shows which docs sections attract the most attention from the homepage.

4. **API integration intent trend** — Trends for `api_docs_viewed` and `authentication_docs_viewed` over time. Tracks how many developers reach the integration-ready stage of the funnel.

5. **Total docs engagement** — Trends stacked area chart combining all eight instrumented events. Gives an overview of documentation health and engagement volume.

You can create these at: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
