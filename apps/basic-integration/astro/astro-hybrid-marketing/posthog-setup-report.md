# PostHog post-wizard report

PostHog was integrated into the Astro hybrid marketing site using environment-backed client initialization and a singleton `posthog-node` server client. The shared layout now loads the browser SDK, conversion actions are captured on the homepage, pricing page, and contact flow, and the contact API flushes server-side events before returning. Exception capture was added to the API error path.

| Event | Description | File |
|---|---|---|
| `trial_started` | Visitor clicks a call-to-action to begin a free trial. | `src/pages/index.astro` |
| `pricing_plan_selected` | Visitor selects a paid pricing plan to get started. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Visitor successfully submits the contact form. | `src/pages/api/contact.ts` and `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission fails due to validation or a server error. | `src/pages/contact.astro` |

## Next steps

Dashboard creation was not completed because the PostHog MCP server was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and deployment configuration.
- [ ] Wire source-map upload into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development using Claude Code. This will help ensure the model provides up-to-date approaches for integrating PostHog.
