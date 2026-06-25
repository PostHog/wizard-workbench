<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your NeuralFlow documentation site. PostHog client-side analytics are now active across all pages via a reusable `posthog.astro` component injected into the root `Layout.astro`. Ten events are tracked covering the full developer onboarding funnel — from homepage CTA clicks through quickstart, installation, and API reference page views — as well as sidebar and navigation engagement. A server-side PostHog Node.js singleton (`src/lib/posthog-server.ts`) is in place for any future API route instrumentation.

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button on the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' CTA button on the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage, indicating interest in a specific docs section. | `src/pages/index.astro` |
| `docs_quickstart_viewed` | User viewed the Quick Start guide, the top of the developer onboarding funnel. | `src/pages/docs/quickstart.astro` |
| `docs_installation_viewed` | User viewed the Installation page, a key step in the SDK onboarding flow. | `src/pages/docs/installation.astro` |
| `docs_api_authentication_viewed` | User viewed the Authentication docs page, indicating active API integration intent. | `src/pages/docs/api/authentication.astro` |
| `docs_api_endpoints_viewed` | User viewed the API Endpoints reference page, indicating they are building an integration. | `src/pages/docs/api/endpoints.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation bar. | `src/components/Navigation.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' CTA button in the navigation bar. | `src/components/Navigation.astro` |
| `sidebar_link_clicked` | User clicked a link in the documentation sidebar to navigate between doc sections. | `src/components/DocsSidebar.astro` |

## Next steps

We've built some insights and added them to your PostHog dashboard to keep an eye on user behavior:

- **Dashboard**: [Analytics dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- **Developer Onboarding Funnel**: [View insight](https://us.posthog.com/project/483112/insights/qj4zgztm)
- **Homepage CTA Clicks**: [View insight](https://us.posthog.com/project/483112/insights/sE4bfAVE)
- **Feature Card Engagement**: [View insight](https://us.posthog.com/project/483112/insights/ExTPpaFF)
- **API Reference Exploration**: [View insight](https://us.posthog.com/project/483112/insights/rMNTbqjF)
- **Navigation Engagement**: [View insight](https://us.posthog.com/project/483112/insights/qeywmhJBagentId)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
