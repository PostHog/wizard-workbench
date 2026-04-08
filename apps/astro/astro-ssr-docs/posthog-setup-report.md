<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site (Astro SSR). PostHog is now initialized on every page via a shared client-side snippet component, and five meaningful events are captured across the homepage and key documentation pages to track user engagement and conversion intent.

## Changes made

| File | Change |
|------|--------|
| `src/components/posthog.astro` | **Created** — PostHog client-side snippet, initialized with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables using `is:inline` and `define:vars` |
| `src/layouts/Layout.astro` | **Updated** — Imports and renders `<PostHog />` in `<head>`, covering all pages through the shared layout |
| `src/pages/index.astro` | **Updated** — Tracks hero CTA clicks (`get_started_clicked`, `api_reference_clicked`) and feature card clicks (`feature_card_clicked`) |
| `src/pages/docs/quickstart.astro` | **Updated** — Fires `quickstart_viewed` on page load (top of conversion funnel) |
| `src/pages/docs/api/authentication.astro` | **Updated** — Fires `authentication_docs_viewed` on page load (high-intent signal) |
| `.env` | **Created** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set from project configuration |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicks the primary "Get Started" CTA button on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" CTA button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes `card_title` and `card_href` properties) | `src/pages/index.astro` |
| `quickstart_viewed` | User views the quickstart guide page — top of the conversion funnel | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the authentication documentation — indicates higher intent to integrate | `src/pages/docs/api/authentication.astro` |

## Next steps

You can build insights and a dashboard in PostHog to monitor these events:

- **Docs conversion funnel** — Funnel from `get_started_clicked` → `quickstart_viewed` → `authentication_docs_viewed` to see how many visitors progress from homepage to active integration intent.
- **Homepage CTA performance** — Trends of `get_started_clicked` vs `api_reference_clicked` to understand which entry point is more popular.
- **Feature card engagement** — Breakdown of `feature_card_clicked` by `card_title` to see which topics drive the most interest.
- **Quickstart adoption** — Trend of `quickstart_viewed` over time to track documentation reach.

Visit your [PostHog project](https://us.posthog.com) to create these insights and a dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
