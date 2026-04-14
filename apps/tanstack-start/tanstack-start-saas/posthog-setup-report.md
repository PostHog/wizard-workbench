<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers both client-side and server-side tracking, with a reverse proxy for reliable event ingestion.

## Summary of changes

- **`vite.config.ts`** — Added a `/ingest` reverse proxy so PostHog events route through the dev server, avoiding CORS issues and improving reliability.
- **`src/utils/posthog-server.ts`** — New singleton server-side PostHog client using `posthog-node`, initialized from environment variables.
- **`src/routes/__root.tsx`** — Wrapped `RootDocument` body with `PostHogProvider` from `@posthog/react`, enabling client-side analytics and session replay across the entire app.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_viewed` (when the detail page renders) and `invoice_paid` (when the "Mark as Paid" button is clicked) client-side events.
- **`src/routes/users.$userId.tsx`** — Added `team_member_viewed` client-side event.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added `invoice_paid_server` server-side event upon successful payment, with session correlation headers.
- **`src/routes/api/invoices.ts`** — Added `invoice_created` server-side event upon successful invoice creation.
- **`src/routes/api/invoices.$invoiceId.ts`** — Added `invoice_updated` and `invoice_deleted` server-side events.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **Packages installed** — `posthog-js`, `@posthog/react`, `posthog-node`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `invoice_viewed` | Fired when a user views an invoice detail page — top of the payment funnel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Fired client-side when the user clicks "Mark as Paid" | `src/routes/posts.$postId.tsx` |
| `invoice_paid_server` | Server-side confirmation of a successful invoice payment via the API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Fired when a new invoice is created via `POST /api/invoices` | `src/routes/api/invoices.ts` |
| `invoice_updated` | Fired when invoice details are updated via `PATCH /api/invoices/:id` | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Fired when an invoice is deleted via `DELETE /api/invoices/:id` | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | Fired when a user views a team member's profile page | `src/routes/users.$userId.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Invoice payment funnel** — Funnel from `invoice_viewed` → `invoice_paid`. This shows where users drop off before completing payment.
2. **Invoices paid over time** — Trend of `invoice_paid` events, helping track revenue activity.
3. **Invoices created over time** — Trend of `invoice_created` events, showing business growth.
4. **Invoice deletions** — Trend of `invoice_deleted` events, a potential churn signal.
5. **Team engagement** — Trend of `team_member_viewed` events, showing how actively the team section is used.

To create the dashboard:
1. Go to your [PostHog project](https://us.i.posthog.com/project/2/dashboards)
2. Click **New dashboard** and name it "Analytics basics"
3. Add **New insight** for each of the five insights above using the event names from the table

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
