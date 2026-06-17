<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow documentation site. The integration includes a client-side PostHog snippet loaded on every page via the root layout, a server-side `posthog-node` singleton for API route tracking, and a new docs feedback API route. Seven events are instrumented across five files, covering the top of the documentation conversion funnel (hero CTAs), in-page navigation, code engagement, and user feedback.

| Event | Description | File |
|---|---|---|
| `get_started_clicked` | User clicks "Get Started" hero CTA button | `src/pages/index.astro` |
| `api_reference_clicked` | User clicks "API Reference" hero CTA button | `src/pages/index.astro` |
| `feature_card_clicked` | User clicks a feature card on the homepage | `src/pages/index.astro` |
| `github_link_clicked` | User clicks the GitHub link in navigation | `src/components/Navigation.astro` |
| `sidebar_link_clicked` | User clicks a docs sidebar navigation link | `src/components/DocsSidebar.astro` |
| `code_snippet_copied` | User copies a code block (copy button added) | `src/layouts/DocsLayout.astro` |
| `docs_feedback_submitted` | User submits helpful/not-helpful feedback on a docs page (client + server-side via `/api/feedback`) | `src/layouts/DocsLayout.astro` + `src/pages/api/feedback.ts` |

## Next steps

We've prepared five insights for your "Analytics basics (wizard)" dashboard. Create them in PostHog using the links below, then group them into a new dashboard named **Analytics basics (wizard)**.

1. **Get Started conversions** — [New insight](https://us.posthog.com/project/2/insights/new): Trends — event `get_started_clicked` over time. Shows top-of-funnel CTA engagement.

2. **Feature card breakdown** — [New insight](https://us.posthog.com/project/2/insights/new): Trends — event `feature_card_clicked` broken down by the `feature` property. Reveals which doc sections draw the most interest from the homepage.

3. **Docs navigation funnel** — [New insight](https://us.posthog.com/project/2/insights/new): Funnel — steps: `get_started_clicked` → `sidebar_link_clicked` → `code_snippet_copied`. Tracks how many visitors move from intent to active reading to implementation.

4. **Code snippet copies by page** — [New insight](https://us.posthog.com/project/2/insights/new): Trends — event `code_snippet_copied` broken down by `page` property. Identifies the most action-driving documentation pages.

5. **Docs page feedback** — [New insight](https://us.posthog.com/project/2/insights/new): Trends — event `docs_feedback_submitted` broken down by `helpful` property. Surfaces which pages readers find useful vs. unclear.

[View all dashboards](https://us.posthog.com/project/2/dashboard) | [Create new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `POSTHOG_PROJECT_TOKEN`, and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
