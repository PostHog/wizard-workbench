<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers both client-side event tracking and server-side event capture for all critical business operations.

**Changes made:**
- Installed `posthog-js` and `posthog-node` packages
- Added a reverse proxy for PostHog ingestion in `vite.config.ts`
- Wrapped the app in `PostHogProvider` in `src/routes/__root.tsx` (shellComponent) with exception capture enabled
- Created a singleton server-side PostHog client at `src/utils/posthog-server.ts`
- Added client-side event capture to invoice creation and payment flows
- Added server-side event capture to all invoice API endpoints (create, pay, delete)
- Configured environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in `.env`

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on invoice summary view | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks Mark as Paid on invoice full detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks Download PDF on invoice full detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server: invoice created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server: invoice marked paid via POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted` | Server: invoice deleted via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

To view your analytics, visit your PostHog project and create insights for:
- **Invoice creation funnel**: Track `invoice_created` events to see how many invoices are being created
- **Payment conversion**: Funnel from `invoice_created` → `invoice_marked_paid` to measure collection rate
- **Invoice deletion rate**: Monitor `invoice_deleted` events to spot churn signals
- **PDF downloads**: Track `invoice_pdf_downloaded` to see how many invoices are being exported

You can create an "Analytics basics" dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) with these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
