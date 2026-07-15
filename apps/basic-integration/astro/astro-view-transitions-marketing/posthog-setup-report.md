# PostHog post-wizard report

PostHog has been integrated into this Astro marketing site. The browser SDK is initialized once from the shared layout using the Astro view-transition-safe `window.__posthog_initialized` guard. Initialization uses the configured public environment variables and automatic pageview capture with `capture_pageview: 'history_change'`.

The site now records high-value marketing interactions for trial intent, pricing selection, sales contact intent, and documentation interest. Event listeners are registered on Astro's `astro:page-load` lifecycle event so they work after soft navigation. No authentication or server-side routes are present, so no user identification or server instrumentation was applicable.

| Event name | Description | File |
| --- | --- | --- |
| `trial_cta_clicked` | A visitor clicks a call to action to begin a free trial. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing plan to get started. | `src/pages/pricing.astro` |
| `sales_contact_requested` | A visitor requests contact with sales from the enterprise plan. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | A visitor selects a documentation topic from the documentation hub. | `src/pages/docs.astro` |

## Next steps

A dashboard and shareable notebook could not be created because the PostHog MCP service was unreachable during this run. Once it is available, create **Analytics basics (wizard)** with trends for each event above and a conversion funnel from `trial_cta_clicked` to `pricing_plan_selected`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in this project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
