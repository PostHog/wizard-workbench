# PostHog post-wizard report

The wizard integrated PostHog into this TanStack Start application for browser and server analytics. It installed the React, browser, and Node SDKs; initialized client analytics at the root; added a singleton server client with immediate flushing and exception autocapture; configured environment-backed project settings; and instrumented critical invoice creation, update, deletion, payment, and failure flows. The production build and TypeScript check completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `invoice_created` | An invoice was successfully created with amount and due-date context. | `src/utils/invoices.ts` |
| `invoice_marked_paid` | A pending invoice was successfully marked as paid. | `src/utils/invoices.ts` |
| `invoice_created` | An invoice was successfully created through the invoices API. | `src/routes/api/invoices.ts` |
| `invoice_updated` | An invoice was successfully updated through the invoices API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | An invoice was successfully deleted through the invoices API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_marked_paid` | A pending invoice was successfully marked as paid through the payment API. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_creation_failed` | An invoice creation attempt failed in the client workflow. | `src/routes/posts.index.tsx` |
| `invoice_payment_failed` | An invoice payment attempt failed in the client workflow. | `src/routes/posts.$postId.tsx` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable during this run. Once access is restored, create an **Analytics basics (wizard)** dashboard with trends for invoice lifecycle and failure events, plus a creation-to-payment funnel.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
