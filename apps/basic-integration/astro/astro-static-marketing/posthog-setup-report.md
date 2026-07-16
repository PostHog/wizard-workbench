# PostHog post-wizard report

The wizard integrated PostHog into this static Astro marketing site. It installed `posthog-js`, configured the browser environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`, and added a reusable inline browser initialization component to the site layout. Autocapture, pageviews, session recording, and default analytics behavior remain enabled. The integration adds anonymous, non-PII product events to key conversion actions.

| Event name | Description | File |
| --- | --- | --- |
| `trial_cta_clicked` | A visitor clicks a call to action to start a free trial. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan call to action. | `src/pages/pricing.astro` |
| `sales_contact_clicked` | A visitor clicks the enterprise contact-sales call to action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | A visitor selects a documentation topic from the documentation hub. | `src/pages/docs.astro` |

## Next steps

The local PostHog integration is complete and `npm run build` passed. A PostHog dashboard and notebook could not be created because the configured PostHog MCP server was unavailable in this environment.

- Dashboard: not created (PostHog MCP connection unavailable)
- Insights: not created (PostHog MCP connection unavailable)
- Notebook: not created (PostHog MCP connection unavailable)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
