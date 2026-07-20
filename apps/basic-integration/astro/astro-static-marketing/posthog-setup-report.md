# PostHog post-wizard report

The wizard initialized PostHog across the static Astro site through the shared layout, configured the client SDK from Astro public environment variables, and added targeted conversion tracking to primary marketing calls to action, pricing selections, and documentation topic selections. Autocapture and session recording remain at their SDK defaults. The production build completes successfully.

| Event | Description | File |
| --- | --- | --- |
| `free_trial_clicked` | A visitor clicks a free-trial call to action from the home page. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a plan or sales option from the pricing page. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | A visitor selects a documentation topic. | `src/pages/docs.astro` |
| `navigation_cta_clicked` | A visitor clicks the primary call to action in site navigation. | `src/components/Navigation.astro` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and in-app notebook could not be created. Reconnect the PostHog MCP server and create the dashboard named **Analytics basics (wizard)** using the events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
