# PostHog post-wizard report

PostHog analytics has been integrated into this Astro View Transitions marketing site. The `posthog-js` package is installed, and a reusable inline analytics component initializes PostHog from `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. Initialization is guarded with `window.__posthog_initialized` and uses `capture_pageview: 'history_change'` to support soft navigation without re-initializing the SDK.

The site captures conversion-oriented CTA and content-selection events. Event listeners are registered on Astro's `astro:page-load` event so they continue to work after view transitions. No authenticated user flow or server-side routes exist in this project, so no identify or server events were added.

| Event name | Description | File |
| --- | --- | --- |
| `trial_cta_clicked` | Captures a visitor selecting a free-trial call to action. | `src/components/Navigation.astro`, `src/pages/index.astro` |
| `documentation_cta_clicked` | Captures a visitor selecting the documentation call to action from the landing page. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures a visitor selecting a pricing plan or sales contact action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | Captures a visitor selecting a documentation topic card. | `src/pages/docs.astro` |

## Next steps

The PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP server was unreachable in this run. Create the following dashboard once the MCP service is available:

- **Analytics basics (wizard)** — include trend insights for `trial_cta_clicked`, `pricing_plan_selected`, and `documentation_topic_selected`, plus a funnel from `trial_cta_clicked` to `pricing_plan_selected`.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

An agent skill folder remains in this project for future agent development, providing current framework-specific PostHog integration guidance.
