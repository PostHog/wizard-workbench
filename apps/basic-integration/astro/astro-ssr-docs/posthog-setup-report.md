<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the NeuralFlow documentation site. A `posthog.astro` snippet component was created and injected into the root `Layout.astro` so every page loads PostHog automatically. Ten events were instrumented across the homepage, navigation components, and key documentation pages to track docs engagement, conversion-funnel signals, and developer interest. Environment variables were added to `.env` for both client-side (`PUBLIC_` prefix) usage. `posthog-js` and `posthog-node` were installed via npm. Because this project has no API routes, all tracking is client-side only; `posthog-node` is available if API routes are added in the future.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary 'Get Started' CTA on the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the 'API Reference' CTA on the homepage, indicating developer intent. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage to navigate to a specific docs section. | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in the nav, showing interest in the open-source repository. | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a link in the docs sidebar to navigate between documentation sections. | `src/components/DocsSidebar.astro` |
| `quickstart_viewed` | User views the Quick Start page, marking entry into the getting-started funnel. | `src/pages/docs/quickstart.astro` |
| `api_authentication_viewed` | User views the Authentication docs page, a high-intent signal for API integration. | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User views the API Endpoints reference page, indicating active API exploration. | `src/pages/docs/api/endpoints.astro` |
| `workflow_docs_viewed` | User views the Workflows documentation page, showing interest in automation features. | `src/pages/docs/workflows.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818047)
- [Homepage CTA conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/5hqzBlGw)
- [Docs section engagement over time (wizard)](https://us.posthog.com/project/483112/insights/oBOaAj2B)
- [Feature card clicks by destination (wizard)](https://us.posthog.com/project/483112/insights/GBKqgW3n)
- [Docs sidebar navigation clicks (wizard)](https://us.posthog.com/project/483112/insights/OE8pF6uC)
- [GitHub link and API reference interest (wizard)](https://us.posthog.com/project/483112/insights/2UcWBFKi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
