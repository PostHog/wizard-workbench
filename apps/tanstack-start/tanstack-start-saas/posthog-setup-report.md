<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. Here is a summary of all changes made:

- **`src/routes/__root.tsx`** — Wrapped the app shell in `PostHogProvider` from `@posthog/react`, enabling automatic pageview tracking, session replay, and exception capture across all routes.
- **`vite.config.ts`** — Added a reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` routes, routing PostHog traffic through the local dev server to avoid CORS issues.
- **`src/utils/posthog-server.ts`** _(new file)_ — Singleton server-side PostHog client using `posthog-node` for capturing events in API routes.
- **`src/routes/posts.index.tsx`** — Captures `invoice_created` after successful form submission, including invoice ID, title, amount, and due date. Captures exceptions on failure.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_paid` when a user marks an invoice as paid from the invoice detail panel. Captures exceptions on failure.
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_paid` from the full-detail view (with `source: 'full_details'`), and `invoice_pdf_download_clicked` when the Download PDF button is clicked. Captures exceptions on failure.
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` on POST, including session and distinct ID from request headers for session correlation.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_paid` on POST, including session and distinct ID from request headers.

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | User successfully creates a new invoice via the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_paid` | User marks an invoice as paid from the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the full invoice detail view (source: full_details) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server-side: invoice created via the POST /api/invoices endpoint | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server-side: invoice marked as paid via the POST /api/invoices/$invoiceId/pay endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We recommend building the following insights in your PostHog project to monitor the key business metrics tracked by these events:

1. **Invoice creation trend** — Trends insight on `invoice_created` to monitor how many invoices are being created over time.
2. **Invoice payment rate** — Trends insight comparing `invoice_created` vs `invoice_paid` to see payment conversion over time.
3. **Invoice-to-payment funnel** — Funnel insight with steps: `invoice_created` → `invoice_paid` to measure the conversion rate.
4. **PDF download engagement** — Trends insight on `invoice_pdf_download_clicked` to track engagement with the download feature.
5. **Server vs client payment capture** — Trends insight on `invoice_paid` broken down by `source` property to compare client vs API-side payment events.

You can create these in your [PostHog project](https://us.i.posthog.com/project/2/insights) and add them to a dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
