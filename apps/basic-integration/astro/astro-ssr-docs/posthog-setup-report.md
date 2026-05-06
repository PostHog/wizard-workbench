<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the NeuralFlow documentation site (Astro SSR). PostHog client-side tracking is now active across all pages via a shared `PostHog.astro` component injected into the root layout. Eight events covering key user interactions — homepage CTAs, feature card clicks, sidebar navigation, GitHub link clicks, and the quickstart funnel — are captured via `posthog.capture()` using `is:inline` script tags to ensure compatibility with Astro's build pipeline. Environment variables are stored in `.env` and referenced via `import.meta.env.PUBLIC_*` (client-side) following Astro conventions.

## Files created or modified

| File | Change |
|------|--------|
| `src/components/PostHog.astro` | Created — PostHog JS snippet component using `is:inline` and env vars |
| `src/layouts/Layout.astro` | Modified — imports and renders `<PostHog />` in `<head>` |
| `src/pages/index.astro` | Modified — tracks `get_started_clicked`, `api_reference_clicked`, `feature_card_clicked` |
| `src/components/Navigation.astro` | Modified — tracks `nav_github_clicked`, `nav_cta_clicked` |
| `src/components/DocsSidebar.astro` | Modified — tracks `docs_sidebar_link_clicked` |
| `src/pages/docs/quickstart.astro` | Modified — tracks `docs_quickstart_viewed`, `docs_next_step_clicked` |
| `.env` | Created — stores `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `get_started_clicked` | User clicks the primary "Get Started" hero CTA | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" secondary hero CTA | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage (with `card_title` and `card_href` properties) | `src/pages/index.astro` |
| `nav_github_clicked` | User clicks the GitHub link in the top nav | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top nav | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a link in the docs sidebar (with `label` and `href` properties) | `src/components/DocsSidebar.astro` |
| `docs_quickstart_viewed` | User views the Quick Start page — top of onboarding funnel | `src/pages/docs/quickstart.astro` |
| `docs_next_step_clicked` | User clicks a "What's Next" link at the bottom of the quickstart page | `src/pages/docs/quickstart.astro` |

## Next steps

We've set up tracking for key user interactions. Use these events to build insights in PostHog:

- **Homepage → Docs conversion funnel**: `get_started_clicked` → `docs_quickstart_viewed` → `docs_next_step_clicked`
- **CTA effectiveness**: Compare `get_started_clicked` vs `api_reference_clicked` vs `nav_cta_clicked`
- **Documentation engagement**: Track which sidebar links (`docs_sidebar_link_clicked`) are most popular
- **External traffic signals**: Monitor `nav_github_clicked` to gauge interest in your GitHub repo
- **Feature card popularity**: Break down `feature_card_clicked` by `card_title` to see which topics resonate

Build these in your PostHog dashboards:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1130112)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [All dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-ssr/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
