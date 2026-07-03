<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the NeuralFlow documentation site. The integration adds client-side event tracking via `posthog-js`, initialized through a reusable `posthog.astro` component mounted in the root `Layout.astro`. Ten events capture the full user journey — from home page CTA clicks, through documentation navigation and sidebar interactions, to developer-funnel milestone page views and code snippet copying.

| Event Name | Description | File |
|---|---|---|
| `docs_get_started_clicked` | User clicks the primary 'Get Started' CTA button on the home page hero section. | `src/pages/index.astro` |
| `docs_api_reference_clicked` | User clicks the 'API Reference' CTA button on the home page hero section. | `src/pages/index.astro` |
| `docs_feature_card_clicked` | User clicks a feature card on the home page to navigate into the docs. | `src/pages/index.astro` |
| `docs_nav_cta_clicked` | User clicks the 'Get Started' CTA link in the top navigation bar. | `src/components/Navigation.astro` |
| `docs_external_link_clicked` | User clicks the GitHub external link in the navigation bar. | `src/components/Navigation.astro` |
| `docs_sidebar_link_clicked` | User clicks a documentation section link in the sidebar navigation. | `src/components/DocsSidebar.astro` |
| `docs_code_snippet_copied` | User copies a code snippet from the documentation by clicking on it. | `src/layouts/DocsLayout.astro` |
| `docs_quickstart_viewed` | User views the Quick Start page, the top of the developer onboarding funnel. | `src/pages/docs/quickstart.astro` |
| `docs_api_overview_viewed` | User views the API Overview page, indicating intent to integrate with the API. | `src/pages/docs/api/index.astro` |
| `docs_installation_viewed` | User views the Installation page, a key step in the SDK onboarding funnel. | `src/pages/docs/installation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795663)
- [Docs CTA Clicks (wizard)](https://us.posthog.com/project/483112/insights/kO7QCJn0)
- [Developer Onboarding Funnel Views (wizard)](https://us.posthog.com/project/483112/insights/ooZ0Ikre)
- [Feature Card Interest by Feature (wizard)](https://us.posthog.com/project/483112/insights/8L99hPAb)
- [Code Snippet Engagement (wizard)](https://us.posthog.com/project/483112/insights/kmnQn1xV)
- [Navigation & Content Engagement (wizard)](https://us.posthog.com/project/483112/insights/9gYnnBel)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
