<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration includes client-side event tracking via `@posthog/react`, server-side event capture via `posthog-node`, a reverse proxy for reliable event ingestion, and automatic exception capture.

**Changes made:**

- **`vite.config.ts`** — Added a `/ingest` reverse proxy to route PostHog requests through the dev server, improving reliability and avoiding ad-blockers.
- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the shell body so all routes have access to the PostHog client. Configured with `capture_exceptions: true` for automatic error tracking.
- **`src/utils/posthog-server.ts`** *(new file)* — Singleton `posthog-node` client for server-side event capture in API routes.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_marked_paid` when a user clicks "Mark as Paid" on the invoice detail page.
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_marked_paid` (with `source: deep_view`) when a user clicks "Mark as Paid" on the deep invoice detail page.
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` after a new invoice is successfully created via the API.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_payment_processed` after an invoice is marked as paid via the API endpoint.
- **`src/components/DefaultCatchBoundary.tsx`** — Calls `posthog.captureException(error)` when an unhandled React error is caught by the error boundary.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `invoice_marked_paid` | User clicks "Mark as Paid" on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks "Mark as Paid" on the deep invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server-side: new invoice created via the API | `src/routes/api/invoices.ts` |
| `invoice_payment_processed` | Server-side: invoice marked as paid via the payment API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `error_caught` | React error boundary captures an unhandled error | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Invoice payment trend** — Trend chart for `invoice_marked_paid` over time. Tracks payment velocity.
2. **Invoice creation volume** — Trend chart for `invoice_created` over time. Monitors new business activity.
3. **Payment processing funnel** — Funnel from `invoice_created` → `invoice_marked_paid`. Measures conversion from created to paid.
4. **Invoice payment processed (server)** — Trend chart for `invoice_payment_processed`. Validates server-side payment events correlate with client events.
5. **Errors over time** — Trend chart for `$exception` (auto-captured via `capture_exceptions: true`). Tracks application health.

Visit your PostHog project to create these: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
