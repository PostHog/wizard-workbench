# PostHog post-wizard report

The wizard integrated PostHog into this static Astro site using the `posthog-js` browser SDK. A reusable inline initialization component is included in the shared layout, with the project token and host loaded from Astro public environment variables. Custom conversion and engagement events were added to the primary navigation, homepage trial CTA, pricing plans, enterprise sales CTA, and documentation topic cards. Existing site structure and styling were preserved.

| Event name | Description | File |
|---|---|---|
| `trial_started` | User clicks a call-to-action to start a free trial. | `src/pages/index.astro` |
| `pricing_plan_selected` | User selects a paid plan from the pricing page. | `src/pages/pricing.astro` |
| `sales_contact_requested` | User clicks the enterprise contact sales call-to-action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | User selects a documentation topic card. | `src/pages/docs.astro` |
| `navigation_cta_clicked` | User clicks the primary navigation call-to-action. | `src/components/Navigation.astro` |

## Next steps

The PostHog MCP dashboard and notebook service was unavailable during this run, so no live dashboard, insights, or notebook could be created.

- Dashboard: Not created because the PostHog MCP server could not connect.
- Notebook: Not created because the PostHog MCP server could not connect.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap documentation used by collaborators.
- [ ] Wire source-map upload into CI so production browser stack traces can be de-minified.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
