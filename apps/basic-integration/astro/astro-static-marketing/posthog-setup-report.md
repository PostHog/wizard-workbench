# PostHog post-wizard report

The wizard completed a PostHog analytics integration for this static Astro marketing site. It installed the browser SDK, added global browser initialization using Astro public environment variables, and instrumented conversion-focused client-side interactions. PostHog autocapture and session recording remain enabled at their defaults.

| Event name | Event description | File |
|---|---|---|
| `trial_cta_clicked` | Captures when a visitor selects a free-trial call to action. | `src/pages/index.astro` |
| `pricing_plan_selected` | Captures when a visitor selects a pricing-plan call to action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | Captures when a visitor selects a documentation topic. | `src/pages/docs.astro` |
| `navigation_cta_clicked` | Captures when a visitor selects the primary navigation call to action. | `src/components/Navigation.astro` |

## Next steps

The PostHog MCP server was unavailable during dashboard creation, so no dashboard, insights, or shareable notebook could be created in this run. Reconnect the PostHog MCP server and create an **Analytics basics (wizard)** dashboard with insights based on the four events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

The Astro static integration skill remains available under `.claude/skills/integration-astro-static/` for future PostHog work.
