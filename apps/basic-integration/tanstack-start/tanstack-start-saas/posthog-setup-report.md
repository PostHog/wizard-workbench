# PostHog post-wizard report

The PostHog SDKs are installed and configured for this TanStack Start application. Client-side analytics is initialized at the root with environment-backed configuration, preserving PostHog's default autocapture, session recording, and pageview behavior. A singleton Node client supports reliable server-side capture with immediate flushing.

The invoice workflow now captures non-sensitive product signals on successful submission and on payment requests. The instrumentable invoice API handlers also record completed invoice creation and payment transitions when callers provide PostHog distinct-ID and session-ID headers. Event properties contain only invoice IDs, amounts, boolean metadata, session correlation, and source; user-entered invoice titles and descriptions are not captured.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | Records a completed invoice creation with non-sensitive invoice metadata. | `src/routes/api/invoices.ts` |
| `invoice_marked_paid` | Records a successful invoice payment status change on the server. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_payment_requested` | Records when a user requests to mark an invoice as paid. | `src/routes/posts.$postId.tsx` |
| `invoice_creation_submitted` | Records when a user submits the create-invoice form. | `src/routes/posts.index.tsx` |

## Next steps

The PostHog MCP service was unavailable while creating in-app artifacts, so no dashboard, insights, or notebook could be created during this run. Create an **Analytics basics (wizard)** dashboard in PostHog and add trend insights for `invoice_creation_submitted`, `invoice_payment_requested`, `invoice_created`, and `invoice_marked_paid` once MCP connectivity is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in this project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
