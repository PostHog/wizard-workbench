<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. Changes include:

- **Client-side initialization**: Added `PostHogProvider` from `@posthog/react` to the root shell component (`__root.tsx`), wrapping the entire app with session replay, exception capture, and debug mode in development.
- **Reverse proxy**: Configured Vite dev-server proxy (`/ingest`, `/ingest/static`, `/ingest/array`) to route PostHog requests through the local server, improving ad-blocker resilience and CORS reliability.
- **Server-side client**: Created `src/utils/posthog-server.ts` with a singleton `posthog-node` client used in API route handlers.
- **Client-side events**: Added `usePostHog` hooks and `posthog.capture()` calls across invoice and analytics dashboard pages.
- **Server-side events**: Added `posthog.capture()` calls in the invoice pay, create, and delete API routes, including `$session_id` correlation headers.
- **Error tracking**: Added `posthog.captureException(error)` to the global `DefaultCatchBoundary` component, and enabled `capture_exceptions: true` in `PostHogProvider` for automatic JS error capture.
- **Environment variables**: Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_mark_paid_clicked` | User clicks Mark as Paid on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_full_details_clicked` | User clicks View Full Details to navigate to the deep invoice view | `src/routes/posts.$postId.tsx` |
| `invoice_mark_paid_clicked` | User clicks Mark as Paid on the deep invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the deep invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `analytics_counter_incremented` | User clicks the Increment button on the analytics dashboard | `src/routes/deferred.tsx` |
| `error_encountered` (via `captureException`) | Global error boundary catches an unhandled error | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_payment_processed` | Server processes a successful invoice payment | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server records a newly created invoice via the API | `src/routes/api/invoices.ts` |
| `invoice_deleted` | Server records an invoice deletion via the API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built five insights and added them to a dashboard for you to keep an eye on user behavior:

- [Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Invoice Creation Trend](https://us.posthog.com/project/483112/insights/6LTCbhdy)
- [Invoice Payment Funnel](https://us.posthog.com/project/483112/insights/0z4q0rA9) — tracks invoice_created → invoice_mark_paid_clicked → invoice_payment_processed
- [Invoice Actions Overview](https://us.posthog.com/project/483112/insights/pcQ4MSwN) — created vs. paid vs. deleted over time
- [Invoice Detail Engagement](https://us.posthog.com/project/483112/insights/37rR7qZO) — full details views and PDF download clicks
- [Invoice Mark Paid by Source](https://us.posthog.com/project/483112/insights/ZVVkH0Uw) — mark-paid clicks broken down by source (detail vs. deep detail)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
