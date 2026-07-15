# PostHog post-wizard report

PostHog product analytics was added to this Astro site using `posthog-js`. Initialization is centralized in `src/components/PostHog.astro`, reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, guards against repeated initialization during view transitions with `window.__posthog_initialized`, and enables automatic history-change pageviews. The component is included by the existing shared layout. Conversion-oriented click events were added to the navigation, home page, pricing page, and documentation hub. The production build completed successfully.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Tracks clicks on primary conversion calls to action such as starting a trial or getting started. | `src/components/Navigation.astro` |
| `trial_started` | Tracks a visitor selecting a free trial from the landing page or pricing page. | `src/pages/index.astro` |
| `pricing_plan_selected` | Tracks a visitor selecting a specific pricing plan. | `src/pages/pricing.astro` |
| `sales_contact_requested` | Tracks a visitor selecting the enterprise contact sales call to action. | `src/pages/pricing.astro` |
| `documentation_started` | Tracks a visitor opening a documentation topic from the documentation hub. | `src/pages/docs.astro` |

## Next steps

The PostHog MCP server was unavailable during this run, so no live dashboard or notebook could be created. Create a dashboard named `Analytics basics (wizard)` with trends for the instrumented events and a conversion view from CTA to trial selection.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any collaborator bootstrap documentation.
- [ ] Wire source-map upload into CI so production browser stack traces can be de-minified.
- [ ] Confirm events appear in the configured PostHog project by clicking the navigation CTA, trial CTA, pricing actions, and documentation topics.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches when integrating PostHog.
