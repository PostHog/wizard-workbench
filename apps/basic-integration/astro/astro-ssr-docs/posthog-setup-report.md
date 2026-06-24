<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for the NeuralFlow documentation site. The integration adds client-side event tracking via the PostHog web snippet, covering homepage CTA interactions, navigation clicks, and key documentation page visits across the conversion funnel.

**Files created:**
- `src/components/posthog.astro` — PostHog client-side snippet component (uses `is:inline` and environment variables)

**Files edited:**
- `src/layouts/Layout.astro` — imports and renders `<PostHog />` in the `<head>` so all pages are instrumented
- `src/components/Navigation.astro` — tracks `nav_get_started_clicked` when the top-nav CTA is clicked
- `src/pages/index.astro` — tracks `get_started_clicked`, `api_reference_clicked`, and `feature_card_clicked` (with card name property)
- `src/pages/docs/quickstart.astro` — fires `quickstart_page_viewed` (top of funnel)
- `src/pages/docs/installation.astro` — fires `installation_page_viewed`
- `src/pages/docs/api/authentication.astro` — fires `api_authentication_viewed`
- `src/pages/docs/api/endpoints.astro` — fires `api_endpoints_viewed`
- `src/pages/docs/workflows.astro` — fires `workflows_page_viewed`
- `src/pages/docs/automation.astro` — fires `automation_page_viewed`

**Environment variables added to `.env`:**
- `PUBLIC_POSTHOG_PROJECT_TOKEN` — client-side PostHog project token
- `PUBLIC_POSTHOG_HOST` — PostHog host URL (client-side)
- `POSTHOG_PROJECT_TOKEN` — server-side PostHog project token
- `POSTHOG_HOST` — PostHog host URL (server-side)

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button in the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button in the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked one of the feature cards on the homepage, indicating interest in a specific docs section. | `src/pages/index.astro` |
| `quickstart_page_viewed` | User viewed the Quick Start page, marking the top of the documentation conversion funnel. | `src/pages/docs/quickstart.astro` |
| `installation_page_viewed` | User viewed the Installation page, indicating intent to integrate the NeuralFlow SDK. | `src/pages/docs/installation.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA button in the top navigation bar. | `src/components/Navigation.astro` |
| `api_authentication_viewed` | User viewed the API authentication documentation, a key step in onboarding. | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User viewed the API endpoints reference page. | `src/pages/docs/api/endpoints.astro` |
| `workflows_page_viewed` | User viewed the Workflows documentation page, showing interest in automation features. | `src/pages/docs/workflows.astro` |
| `automation_page_viewed` | User viewed the Automation page, indicating exploration of advanced platform capabilities. | `src/pages/docs/automation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [Documentation Onboarding Funnel](https://us.i.posthog.com/project/483112/insights/En0PoGzv)
- [CTA Click Trends](https://us.i.posthog.com/project/483112/insights/YCQrLGLl)
- [Feature Card Clicks by Card](https://us.i.posthog.com/project/483112/insights/F2I3cQwk)
- [Docs Section Popularity](https://us.i.posthog.com/project/483112/insights/Kr1wenHZ)
- [Total Documentation Engagement](https://us.i.posthog.com/project/483112/insights/6XZmuWZw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
