# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro SSR documentation site. A `posthog.astro` client-side initialization component was created and wired into `Layout.astro` so every page loads the PostHog JS snippet. A `posthog-node` singleton (`src/lib/posthog-server.ts`) was created for server-side tracking. Client-side click events were added to the homepage hero CTAs, feature cards, navigation, and docs sidebar. Server-side page-load events were added to three high-value conversion pages (quickstart, installation, and API authentication docs) using the PostHog Node SDK in the Astro page frontmatter.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks the hero "Get Started" CTA button on the homepage | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks the hero "API Reference" CTA button on the homepage | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" button in the navigation | `src/components/Navigation.astro` |
| `github_link_clicked` | User clicks the GitHub link in the navigation | `src/components/Navigation.astro` |
| `docs_section_navigated` | User clicks a sidebar link to navigate to a doc section | `src/components/DocsSidebar.astro` |
| `quickstart_next_step_clicked` | User clicks a "What's Next?" link at the end of the quickstart guide | `src/pages/docs/quickstart.astro` |
| `quickstart_docs_viewed` | Server-side: user views the quickstart guide page | `src/pages/docs/quickstart.astro` |
| `installation_docs_viewed` | Server-side: user views the installation documentation page | `src/pages/docs/installation.astro` |
| `api_auth_docs_viewed` | Server-side: user views the API authentication documentation page | `src/pages/docs/api/authentication.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787336)
- [Documentation Adoption Funnel](https://us.posthog.com/project/483112/insights/9742999)
- [Homepage CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/9743002)
- [Feature Card Popularity](https://us.posthog.com/project/483112/insights/9743008)
- [Docs Section Navigation](https://us.posthog.com/project/483112/insights/9743009)
- [Content Engagement: Installation & API Auth Docs](https://us.posthog.com/project/483112/insights/9743013)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set: `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
