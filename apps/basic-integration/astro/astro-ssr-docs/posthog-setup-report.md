<wizard-report>
# PostHog post-wizard report

The wizard has completed a full client-side PostHog integration for the NeuralFlow documentation site (Astro SSR). PostHog is initialized on every page via a new `posthog.astro` snippet component added to the base `Layout.astro`. Eight events are now captured across the homepage, navigation, sidebar, and key high-intent documentation pages. There are no API routes in this project, so all tracking is client-side; autocapture handles standard pageviews automatically.

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a hero CTA button ("Get Started" or "API Reference") on the homepage. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage to explore a documentation section. | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" call-to-action button in the top navigation bar. | `src/components/Navigation.astro` |
| `nav_github_clicked` | User clicks the GitHub link in the navigation bar. | `src/components/Navigation.astro` |
| `quickstart_started` | User visits the Quick Start page, marking the top of the integration funnel. | `src/pages/docs/quickstart.astro` |
| `api_reference_viewed` | User views the API overview page, indicating high intent to integrate. | `src/pages/docs/api/index.astro` |
| `authentication_docs_viewed` | User views the authentication documentation, indicating they are close to completing integration. | `src/pages/docs/api/authentication.astro` |
| `sidebar_link_clicked` | User clicks a navigation link in the docs sidebar to move between documentation sections. | `src/components/DocsSidebar.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829016)
- [Docs conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/02YaCMXo)
- [CTA clicks by button (wizard)](https://us.posthog.com/project/483112/insights/8iD4K4OO)
- [Feature card clicks (wizard)](https://us.posthog.com/project/483112/insights/DgYg5ixv)
- [Sidebar navigation clicks (wizard)](https://us.posthog.com/project/483112/insights/FDWZcDKr)
- [High-intent docs page views (wizard)](https://us.posthog.com/project/483112/insights/wCmoK0Sk)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
