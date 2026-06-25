# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. PostHog is now initialized client-side on every page via a reusable `posthog.astro` component injected into the shared `Layout.astro`. A singleton `posthog-node` server-side client was created at `src/lib/posthog-server.ts` and wired into the two highest-intent documentation pages (API Authentication and API Endpoints) to emit server-side events on each page render. Ten custom events are tracked across user interactions including homepage CTA clicks, feature card navigation, sidebar usage, code sample copying, the developer onboarding funnel, and developer acquisition signals.

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicked the Get Started or API Reference CTA button in the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked a feature card on the homepage to navigate to a documentation section. | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicked the Get Started CTA button in the main navigation bar. | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation, indicating developer interest. | `src/components/Navigation.astro` |
| `quickstart_viewed` | User viewed the Quick Start guide, marking entry into the developer onboarding funnel. | `src/pages/docs/quickstart.astro` |
| `code_sample_copied` | User copied a code sample from the documentation, indicating active engagement. | `src/layouts/DocsLayout.astro` |
| `sidebar_link_clicked` | User navigated to a documentation section using the sidebar links. | `src/components/DocsSidebar.astro` |
| `authentication_docs_viewed` | User viewed the Authentication documentation page, a high-intent signal for API integration. | `src/pages/docs/api/authentication.astro` |
| `api_endpoints_viewed` | User viewed the API Endpoints reference page, indicating intent to integrate the API. | `src/pages/docs/api/endpoints.astro` |
| `docs_next_steps_clicked` | User clicked a next steps or related link at the bottom of a documentation page. | `src/pages/docs/quickstart.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1761083)
- **Docs conversion funnel** — [quickstart_viewed → code_sample_copied → docs_next_steps_clicked](https://us.posthog.com/project/483112/insights/apZQiStH)
- **Hero CTA clicks** — [hero_cta_clicked breakdown by label](https://us.posthog.com/project/483112/insights/R341AMbW)
- **API docs high-intent views** — [authentication_docs_viewed + api_endpoints_viewed](https://us.posthog.com/project/483112/insights/Cu088O6e)
- **Feature card engagement** — [feature_card_clicked breakdown by label](https://us.posthog.com/project/483112/insights/AllAE01g)
- **Developer acquisition signals** — [github_link_clicked + nav_get_started_clicked](https://us.posthog.com/project/483112/insights/YykHG1bE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
