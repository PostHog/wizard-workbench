# PostHog post-wizard report

PostHog has been integrated into the TanStack Start application with client-side initialization at the root, server-side `posthog-node` support for API and server-function operations, invoice lifecycle events, and exception capture in the application error boundaries. PostHog credentials are configured through environment variables.

| Event | Description | File |
|---|---|---|
| `invoice_created` | A new invoice is successfully created. | `src/routes/posts.index.tsx`, `src/routes/api/invoices.ts` |
| `invoice_marked_paid` | A pending invoice is successfully marked as paid. | `src/utils/invoices.ts` |
| `invoice_updated` | An existing invoice is successfully updated through the API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | An existing invoice is successfully deleted through the API. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_payment_completed` | An invoice payment is successfully completed. | `src/routes/posts.$postId.tsx`, `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_error` | An invoice route or loader reports an operational error. | `src/components/PostError.tsx` |
| `application_error` | The application renders its default error boundary. | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

The PostHog MCP server was unavailable during this run, so the requested live dashboard and notebook could not be created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap documentation.
- [ ] Wire source-map upload into CI so production stack traces de-minify.
