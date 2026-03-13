<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers both client-side and server-side event tracking with the `@posthog/react` and `posthog-node` SDKs.

**Summary of changes:**

- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the app shell (`RootDocument`) with environment-variable-backed config, proxy host, exception capture, and debug mode
- **`src/utils/posthog-server.ts`** — Created a new singleton PostHog server client (`getPostHogClient`) using `posthog-node` for server-side event capture
- **`vite.config.ts`** — Added `/ingest` proxy to route PostHog requests through the Vite dev server, avoiding CORS issues
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_marked_paid` when user marks an invoice paid from the invoice list view
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_marked_paid` (deep view) and `invoice_pdf_downloaded` when user clicks Download PDF
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` on POST requests
- **`src/routes/api/invoices.$invoiceId.ts`** — Server-side capture of `invoice_deleted` on DELETE requests
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_paid_api` when an invoice is paid via the API
- **`src/routes/index.tsx`** — Captures `cta_clicked` with the CTA name when users click "View Invoices" or "Manage Team" on the home page

| Event | Description | File |
|---|---|---|
| `invoice_marked_paid` | User marks an invoice as paid from the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User marks an invoice as paid from the deep invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | A new invoice is created via the server API | `src/routes/api/invoices.ts` |
| `invoice_deleted` | An invoice is deleted via the server API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_paid_api` | An invoice is paid via the server API endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_pdf_downloaded` | User clicks Download PDF button on invoice deep view | `src/routes/posts_.$postId.deep.tsx` |
| `cta_clicked` | User clicks a CTA button on the home page | `src/routes/index.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following insights to monitor CloudFlow's business health:

1. **Invoice payment rate** — Funnel: `$pageview` → `invoice_marked_paid` — tracks what % of invoice viewers complete payment
2. **Invoice creation trend** — Trend of `invoice_created` over time — monitor invoice volume
3. **Invoice deletion rate** — Trend of `invoice_deleted` vs `invoice_created` — track churn signals
4. **CTA engagement** — Breakdown of `cta_clicked` by `cta` property — understand home page engagement
5. **Payment method split** — Compare `invoice_marked_paid` (client) vs `invoice_paid_api` (server/API) — understand how payments are triggered

You can create these in PostHog at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
