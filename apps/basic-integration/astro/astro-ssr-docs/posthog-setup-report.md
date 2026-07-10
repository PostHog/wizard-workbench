# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the NeuralFlow documentation site. A PostHog analytics snippet was added to the root layout so every page is covered automatically. Event capture was added to the homepage CTAs, feature cards, navigation bar, and two high-intent documentation pages (Quick Start and Authentication). No server-side instrumentation was added because the project has no API routes; all events are captured in the browser.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA in the homepage hero section | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" secondary CTA in the homepage hero section | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks one of the feature cards on the homepage (includes `card_title` and `destination` properties) | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top navigation bar | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start guide page | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the Authentication documentation page | `src/pages/docs/api/authentication.astro` |

## Files changed

- **Created**: `src/components/posthog.astro` — PostHog browser snippet using `is:inline` and `define:vars` to inject env vars safely
- **Edited**: `src/layouts/Layout.astro` — imported and rendered `<PostHog />` in `<head>`
- **Edited**: `src/pages/index.astro` — added `get_started_clicked`, `api_reference_clicked`, `feature_card_clicked` capture
- **Edited**: `src/components/Navigation.astro` — added `github_link_clicked`, `nav_cta_clicked` capture
- **Edited**: `src/pages/docs/quickstart.astro` — added `quickstart_viewed` capture
- **Edited**: `src/pages/docs/api/authentication.astro` — added `authentication_docs_viewed` capture
- **Created**: `.env` — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829134)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/6a9gWUvT) — bar chart of all homepage and nav CTA clicks
- [Feature card clicks by section (wizard)](https://us.posthog.com/project/483112/insights/QsmcZwd4) — breakdown by which card title was clicked
- [Developer journey funnel (wizard)](https://us.posthog.com/project/483112/insights/uIIDmUA9) — conversion from "Get Started" → Quick Start → Authentication docs
- [Quick Start guide views (wizard)](https://us.posthog.com/project/483112/insights/XUif5re2) — daily trend of quickstart_viewed
- [GitHub link clicks (wizard)](https://us.posthog.com/project/483112/insights/wxk6rACl) — daily trend of github_link_clicked

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
