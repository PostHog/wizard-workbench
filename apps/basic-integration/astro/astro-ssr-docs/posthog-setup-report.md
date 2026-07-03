<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for the NeuralFlow documentation site. PostHog is initialized client-side via a new `src/components/posthog.astro` snippet component, which is imported into the root `src/layouts/Layout.astro` and rendered in the `<head>` of every page. Ten custom events are tracked across six files to measure developer intent, content engagement, and navigation patterns. All PostHog credentials are stored in `.env` using the `PUBLIC_` prefix for Astro's client-side exposure.

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary 'Get Started' CTA button on the home page hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' button on the home page hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the home page, indicating interest in a specific docs section. | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation bar. | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page, indicating top-of-funnel intent to integrate the SDK. | `src/pages/docs/quickstart.astro` |
| `installation_viewed` | User views the Installation page, indicating active SDK adoption intent. | `src/pages/docs/installation.astro` |
| `api_overview_viewed` | User views the API overview page, indicating intent to integrate via REST API. | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the authentication documentation, a key step in the API integration funnel. | `src/pages/docs/api/authentication.astro` |
| `docs_sidebar_navigated` | User clicks a sidebar link to navigate between documentation sections. | `src/components/DocsSidebar.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795667)
- [Developer Journey Funnel (wizard)](https://us.posthog.com/project/483112/insights/9aljp3Q4)
- [CTA Clicks Trend (wizard)](https://us.posthog.com/project/483112/insights/RW7cRxNM)
- [Feature Card Clicks by Section (wizard)](https://us.posthog.com/project/483112/insights/FdWjOXEq)
- [Docs Sidebar Navigation (wizard)](https://us.posthog.com/project/483112/insights/yHcytwOd)
- [GitHub Link Clicks (wizard)](https://us.posthog.com/project/483112/insights/jykn36vC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
