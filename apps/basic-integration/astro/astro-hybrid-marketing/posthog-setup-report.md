# PostHog post-wizard report

The wizard integrated PostHog into this Astro hybrid marketing site. It added the browser SDK initialization through the shared layout, configured a reusable server-side `posthog-node` singleton, and set the required public environment variables in `.env`. The contact API route now captures validated lead submissions and validation failures server-side, flushes events before responses return, and identifies contact leads with PII only as person properties. Client instrumentation captures marketing CTA clicks, pricing plan selections, and contact submission outcomes. Browser exception autocapture and API error capture are enabled.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures a click on the navigation marketing call to action. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | Captures selection of a pricing plan before a trial or sales conversion. | `src/pages/pricing.astro` |
| `contact_form_submitted` | Captures a successfully submitted contact form with the selected interest category. | `src/pages/contact.astro` |
| `contact_form_submission_failed` | Captures a contact form submission failure by error category. | `src/pages/contact.astro` |
| `contact_form_received` | Captures a validated contact request on the server with non-PII lead context. | `src/pages/api/contact.ts` |
| `contact_form_rejected` | Captures a server-side contact request rejection with its validation reason. | `src/pages/api/contact.ts` |

## Next steps

- `npm run build` completed successfully after the integration.
- Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable during this run.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
