<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. Here is a summary of all changes made:

- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the entire app in `RootDocument`, initializing posthog-js with the project token, reverse proxy host (`/ingest`), exception capture, and debug mode in development.
- **`vite.config.ts`** — Added reverse proxy configuration routing `/ingest/static`, `/ingest/array`, and `/ingest` to the PostHog ingestion endpoints to improve reliability and avoid ad-blockers.
- **`src/utils/posthog-server.ts`** *(new file)* — Singleton server-side PostHog client using `posthog-node`, used for server-side event capture in API routes.
- **`src/routes/posts.index.tsx`** — Captures `invoice_created` after a user successfully submits the create invoice form.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_paid` when a user marks an invoice as paid from the detail view.
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_paid` when marking paid from the full detail view, and `invoice_pdf_download_clicked` when the Download PDF button is clicked.
- **`src/routes/users.$userId.tsx`** — Captures `team_member_viewed` when a user's profile page is loaded.
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` on POST, including session ID correlation headers.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_payment_processed` on payment POST, including session ID correlation headers.

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | User submits the create invoice form successfully | `src/routes/posts.index.tsx` |
| `invoice_paid` | User marks an invoice as paid from the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server-side: invoice created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_payment_processed` | Server-side: invoice payment processed via POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `team_member_viewed` | User views a team member profile page | `src/routes/users.$userId.tsx` |

## Next steps

We've pre-configured insight URLs for your "Analytics basics" dashboard. Click each link to open a pre-populated insight in PostHog, then save it to a new dashboard named **"Analytics basics"**:

1. **Invoice creation trend** — Track how many invoices are created over time:
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"invoice_created","type":"events","order":0,"name":"invoice_created"}]}

2. **Invoice payment funnel** — Conversion from invoice created to invoice paid:
   https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"invoice_created","type":"events","order":0,"name":"invoice_created"},{"id":"invoice_paid","type":"events","order":1,"name":"invoice_paid"}]}

3. **Invoice paid trend** — Track how many invoices are marked as paid over time:
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"invoice_paid","type":"events","order":0,"name":"invoice_paid"}]}

4. **PDF download engagement** — Track how often users click to download invoice PDFs:
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"invoice_pdf_download_clicked","type":"events","order":0,"name":"invoice_pdf_download_clicked"}]}

5. **Team member profile views** — Track engagement with team member profiles:
   https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"team_member_viewed","type":"events","order":0,"name":"team_member_viewed"}]}

Your PostHog project: https://us.posthog.com/project/2/

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
