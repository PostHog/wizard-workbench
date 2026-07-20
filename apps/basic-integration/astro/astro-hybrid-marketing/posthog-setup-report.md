# PostHog post-wizard report

The wizard integrated PostHog into the Astro hybrid application for browser analytics and server-side contact-form tracking. It added environment-backed initialization, a reusable browser component in the shared layout, a singleton `posthog-node` client with immediate flushing and exception autocapture, client-to-server distinct/session correlation, conversion events, and exception capture. The production build completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `trial_cta_clicked` | A visitor clicks a call to action to begin a free trial. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a plan from the pricing page. | `src/pages/pricing.astro` |
| `contact_form_submitted` | The server successfully accepts a valid contact request. | `src/pages/api/contact.ts` |
| `contact_form_failed` | The contact API cannot process a submission because of a server error. | `src/pages/api/contact.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and notebook could not be created. Create an **Analytics basics (wizard)** dashboard when the MCP service is available, using the exact event names above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
