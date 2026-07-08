<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog analytics integration for the NeuralFlow documentation site. A new `posthog.astro` snippet component was created and mounted in the root `Layout.astro` so every page automatically initialises PostHog. Ten events were instrumented across six files, covering homepage conversion CTAs, documentation navigation, high-intent API page views, and the quickstart activation funnel.

| Event name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the primary "Get Started" CTA button on the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the "API Reference" CTA button on the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks one of the feature cards on the homepage grid. | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub external link in the top navigation bar. | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" call-to-action button in the navigation bar. | `src/components/Navigation.astro` |
| `quickstart_viewed` | User views the Quick Start page, marking the top of the integration conversion funnel. | `src/pages/docs/quickstart.astro` |
| `code_snippet_copied` | User copies a code snippet from the Quick Start guide. | `src/pages/docs/quickstart.astro` |
| `authentication_docs_viewed` | User views the Authentication documentation page, a high-intent signal for API adoption. | `src/pages/docs/api/authentication.astro` |
| `api_overview_viewed` | User views the API Overview page, indicating interest in programmatic integration. | `src/pages/docs/api/index.astro` |
| `docs_sidebar_link_clicked` | User navigates using a link in the documentation sidebar. | `src/components/DocsSidebar.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816748)
- [Homepage CTA clicks](https://us.posthog.com/project/483112/insights/Oiyyxo64)
- [Quickstart conversion funnel](https://us.posthog.com/project/483112/insights/0eG86lj9)
- [API adoption funnel](https://us.posthog.com/project/483112/insights/HcD2fvr9)
- [Docs navigation engagement](https://us.posthog.com/project/483112/insights/5FObUcb3)
- [High-intent API page views](https://us.posthog.com/project/483112/insights/2WgF5D8A)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
