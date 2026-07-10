<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Astro SSR documentation site with PostHog. Client-side PostHog initialization was added through a reusable inline Astro component mounted in the shared layout, and a singleton `posthog-node` client was added for server-side tracking in API routes. Documentation engagement events were instrumented across homepage CTAs, top navigation, sidebar navigation, quickstart code examples, installation examples, and API reference views. A server-side API route now records forwarded CTA interactions and captures exceptions when analytics forwarding fails. Environment variables were configured in `.env` for both browser and server runtimes, and the project build completed successfully after the changes.

| Event name | Description | File |
| --- | --- | --- |
| `homepage_cta_clicked` | Captured when a visitor clicks a primary call-to-action from the homepage. | `src/pages/index.astro` |
| `docs_navigation_clicked` | Captured when a visitor navigates to another docs section from primary navigation or sidebar links. | `src/components/Navigation.astro` |
| `docs_sidebar_navigation_clicked` | Captured when a visitor selects a documentation topic from the sidebar. | `src/components/DocsSidebar.astro` |
| `quickstart_example_engaged` | Captured when a visitor interacts with the quick start example code block. | `src/pages/docs/quickstart.astro` |
| `installation_example_engaged` | Captured when a visitor interacts with the installation example code block. | `src/pages/docs/installation.astro` |
| `docs_api_reference_viewed` | Captured when a visitor views the API overview page as part of the documentation funnel. | `src/pages/docs/api/index.astro` |
| `server_docs_cta_recorded` | Captured on the server when a client CTA interaction is forwarded to the analytics API route. | `src/pages/api/events/docs.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831016)
- [Homepage CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/i7RHOVW6)
- [Top navigation clicks (wizard)](https://us.posthog.com/project/483112/insights/tEby6ytE)
- [Sidebar topic clicks (wizard)](https://us.posthog.com/project/483112/insights/ND9lsxF0)
- [Quickstart example engagement (wizard)](https://us.posthog.com/project/483112/insights/ik8q1SXC)
- [Homepage CTA to server recording funnel (wizard)](https://us.posthog.com/project/483112/insights/ix79N2HP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
