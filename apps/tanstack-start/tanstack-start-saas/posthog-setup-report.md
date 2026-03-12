<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. The integration includes client-side event tracking with `@posthog/react`, server-side event tracking with `posthog-node`, automatic exception capture in the error boundary, and a Vite reverse proxy for reliable PostHog ingestion. The `PostHogProvider` is initialized in the root shell component (`__root.tsx`) to cover the entire application, and a singleton server-side PostHog client was created for use in API routes.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User successfully created a new invoice via the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_detail_viewed` | User viewed a specific invoice's detail page (top of conversion funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicked 'Mark as Paid' on an invoice (inline view) | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicked 'Mark as Paid' on an invoice (full detail view) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicked the Download PDF button on an invoice full detail page | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User viewed a team member's profile page | `src/routes/users.$userId.tsx` |
| `app_error_caught` | Application error was caught by the default error boundary | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_payment_processed` | Invoice payment was processed server-side via POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Invoice was created server-side via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_updated` | Invoice was updated server-side via PATCH /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice was deleted server-side via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've prepared suggested insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create a dashboard named **"Analytics basics"** in PostHog and add the following insights:

- [Invoice Creation Trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22invoice_created%22%7D%5D) — Trends: `invoice_created` over time
- [Invoice Payment Funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22invoice_detail_viewed%22%7D%2C%7B%22id%22%3A%22invoice_marked_paid%22%7D%5D) — Funnel: `invoice_detail_viewed` → `invoice_marked_paid`
- [Invoice Actions Overview](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22invoice_created%22%7D%2C%7B%22id%22%3A%22invoice_marked_paid%22%7D%2C%7B%22id%22%3A%22invoice_pdf_download_clicked%22%7D%5D) — Trends: `invoice_created`, `invoice_marked_paid`, `invoice_pdf_download_clicked`
- [Server-side Invoice Operations](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22invoice_payment_processed%22%7D%2C%7B%22id%22%3A%22invoice_created_server%22%7D%2C%7B%22id%22%3A%22invoice_updated%22%7D%2C%7B%22id%22%3A%22invoice_deleted%22%7D%5D) — Trends: server-side invoice operations
- [Application Errors](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22app_error_caught%22%7D%5D) — Trends: `app_error_caught` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
