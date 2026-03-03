<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your NeuralFlow documentation site. PostHog is initialized via a client-side snippet in `src/components/posthog.astro`, which is included in the root `Layout.astro` so it loads on every page. Ten custom events were instrumented across key pages and navigation components to track visitor engagement throughout the documentation site. All PostHog credentials are stored in environment variables (`.env`) and never hardcoded.

## Changes made

| File | Change |
|------|--------|
| `src/components/posthog.astro` | **Created** — PostHog initialization snippet using `is:inline` and `define:vars` for env vars |
| `src/layouts/Layout.astro` | **Updated** — Imports and renders `<PostHog />` in `<head>` for site-wide tracking |
| `src/pages/index.astro` | **Updated** — Tracks hero CTA clicks and feature card clicks |
| `src/components/Navigation.astro` | **Updated** — Tracks GitHub link and nav CTA clicks |
| `src/components/DocsSidebar.astro` | **Updated** — Tracks sidebar navigation link clicks |
| `src/pages/docs/quickstart.astro` | **Updated** — Tracks quickstart page views and "What's Next" link clicks |
| `src/pages/docs/installation.astro` | **Updated** — Tracks installation page views |
| `src/pages/docs/api/authentication.astro` | **Updated** — Tracks authentication docs page views |
| `.env` | **Created** — `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_API_KEY`, `POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicks the primary "Get Started" CTA button on the homepage hero | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" button on the homepage hero | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (includes `card_title`, `card_href`) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `docs_nav_cta_clicked` | User clicks the "Get Started" CTA link in the navigation bar | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a docs sidebar link (includes `label`, `href`) | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User views the Quick Start page — top of the developer onboarding funnel | `src/pages/docs/quickstart.astro` |
| `whats_next_link_clicked` | User clicks a "What's Next" inline link at the bottom of the quickstart page | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page — second step in the developer onboarding funnel | `src/pages/docs/installation.astro` |
| `authentication_docs_viewed` | User views the Authentication docs — signals serious API integration intent | `src/pages/docs/api/authentication.astro` |

## Next steps

To track your users and visualize behavior, create an **"Analytics basics"** dashboard in [PostHog](https://us.posthog.com) with these recommended insights:

1. **Developer onboarding funnel** — Funnel insight: `quickstart_viewed` → `installation_viewed` → `authentication_docs_viewed`. Shows how many visitors progress through the developer onboarding journey.

2. **Homepage CTA conversions** — Trend insight: `get_started_clicked` + `api_reference_clicked`. Shows which homepage CTAs drive the most engagement.

3. **Feature card popularity** — Trend insight: `feature_card_clicked` broken down by `card_title`. Shows which documentation sections attract the most homepage clicks.

4. **Docs sidebar navigation** — Trend insight: `docs_sidebar_link_clicked` broken down by `label`. Shows which documentation sections are most visited.

5. **External engagement** — Trend insight: `github_link_clicked` over time. Shows how many visitors click through to your GitHub repository.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
