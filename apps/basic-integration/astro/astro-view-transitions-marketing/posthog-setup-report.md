# PostHog post-wizard report

The wizard integrated PostHog into this Astro View Transitions marketing site. It added guarded browser initialization using Astro public environment variables, automatic pageview tracking for history changes, and four conversion-oriented custom events. The production build completed successfully. Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during setup.

| Event | Description | File |
| --- | --- | --- |
| `free_trial_started` | A visitor clicks the primary free-trial call to action on the home page. | `src/pages/index.astro` |
| `navigation_get_started_clicked` | A visitor clicks the persistent Get Started call to action in the navigation. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | A visitor selects a pricing plan, including the selected plan as a non-PII property. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | A visitor selects a topic from the documentation landing page. | `src/pages/docs.astro` |

## Next steps

The planned PostHog dashboard and shareable notebook remain to be created once PostHog MCP access is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
