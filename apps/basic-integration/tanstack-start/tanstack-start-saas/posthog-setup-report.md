# PostHog post-wizard report

The wizard integrated PostHog for client-side analytics, session replay, and exception capture across the TanStack Start application. It added the React and Node SDKs, initialized client tracking at the root route, configured ingestion proxy routes, and introduced a singleton server client. Invoice creation and payment are captured server-side with the browser distinct ID and session ID for correlation. Event properties include only non-PII operational context.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | A user successfully creates a new invoice. | `src/utils/invoices.ts` |
| `invoice_paid` | A user successfully marks an invoice as paid. | `src/utils/invoices.ts` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP server was unavailable during this run. Once the server is available, create **Analytics basics (wizard)** with trends for `invoice_created` and `invoice_paid`, plus an invoice creation-to-payment funnel.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
