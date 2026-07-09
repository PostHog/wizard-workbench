<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro SSR documentation site (NeuralFlow Docs). Client-side tracking via the PostHog web snippet has been added to the root layout, with event captures on homepage CTAs, feature card navigation, docs page views, quickstart guide views, API docs views, and GitHub link/nav CTA clicks.

| Event Name | Description | File |
|---|---|---|
| `get_started_clicked` | User clicked the primary 'Get Started' CTA button on the homepage hero section. | `src/pages/index.astro` |
| `api_reference_clicked` | User clicked the 'API Reference' button on the homepage hero section. | `src/pages/index.astro` |
| `feature_card_clicked` | User clicked one of the feature cards on the homepage to navigate to a docs section. | `src/pages/index.astro` |
| `docs_page_viewed` | User viewed a documentation page, capturing which section they navigated to. | `src/layouts/DocsLayout.astro` |
| `quickstart_guide_viewed` | User viewed the Quick Start guide — the top of the conversion funnel toward becoming an active user. | `src/pages/docs/quickstart.astro` |
| `api_docs_viewed` | User viewed the API Overview page, indicating developer interest. | `src/pages/docs/api/index.astro` |
| `github_link_clicked` | User clicked the GitHub link in the navigation, indicating interest in the open-source repository. | `src/components/Navigation.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' CTA in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824428)
- **Insight**: [Homepage CTA engagement (wizard)](https://us.posthog.com/project/483112/insights/HTF8ek8S) — Trends: Get Started, API Reference, Nav CTA clicks over 30 days
- **Insight**: [Docs navigation funnel: homepage to API docs (wizard)](https://us.posthog.com/project/483112/insights/BoHKdSvY) — Funnel: CTA click → docs page → API overview
- **Insight**: [Docs page views by section (wizard)](https://us.posthog.com/project/483112/insights/FEtZ4gr4) — Bar chart: docs page views broken down by URL path
- **Insight**: [Feature card interest (wizard)](https://us.posthog.com/project/483112/insights/4HyeJ2W7) — Pie chart: feature card clicks broken down by section
- **Insight**: [Developer interest: quickstart + API docs views (wizard)](https://us.posthog.com/project/483112/insights/ZoJKLAq3) — Area chart: quickstart views, API docs views, GitHub clicks over 30 days

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. The variables are: `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
