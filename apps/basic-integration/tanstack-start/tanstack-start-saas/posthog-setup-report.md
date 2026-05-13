<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. Here is a summary of all changes made:

- **`package.json`** — Added `@posthog/react`, `posthog-js`, and `posthog-node` as dependencies.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`vite.config.ts`** — Added a reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the dev server (avoids ad blockers and improves reliability).
- **`src/routes/__root.tsx`** — Wrapped `RootDocument` body content with `PostHogProvider` for automatic pageview tracking, session replay, and exception capture across the entire app.
- **`src/utils/posthog-server.ts`** — Created a singleton server-side PostHog client using `posthog-node` for reliable server-side event capture.
- **`src/routes/posts.index.tsx`** — Added `invoice_created` capture on successful invoice form submission, plus `captureException` on error.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_paid` capture when a user clicks "Mark as Paid", plus `captureException` on error.
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created` capture on the `POST /api/invoices` endpoint.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid` capture on the `POST /api/invoices/:id/pay` endpoint, including `$session_id` correlation.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `invoice_created` | User successfully creates a new invoice via the form | `src/routes/posts.index.tsx` |
| `invoice_paid` | User clicks "Mark as Paid" on an invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_created` | Server confirms invoice creation via `POST /api/invoices` | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server confirms invoice payment via `POST /api/invoices/:id/pay` | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Invoice creation trend** — Time series of `invoice_created` events over time, to see growth in new invoices.
2. **Invoice payment rate** — A funnel from `invoice_created` → `invoice_paid`, showing what percentage of created invoices are eventually paid.
3. **Total invoices created** — A single-number metric of total `invoice_created` events (lifetime or rolling 30 days).
4. **Total invoices paid** — A single-number metric of total `invoice_paid` events.
5. **Invoice creation vs. payment over time** — A combined time series comparing `invoice_created` and `invoice_paid` to spot payment lag.

Create your dashboard and insights here:
- [New dashboard](https://us.posthog.com/project/2/dashboard/new)
- [New insight](https://us.posthog.com/project/2/insights/new)
- [Event explorer](https://us.posthog.com/project/2/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
