<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes client-side analytics via `PostHogProvider`, server-side event capture via `posthog-node`, a Vite reverse proxy to avoid CORS issues, and environment variable configuration.

**Changes made:**

- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the app shell. Enables automatic pageview tracking, session replay, and error tracking (`capture_exceptions: true`) across all routes.
- **`src/utils/posthog-server.ts`** — Created a singleton PostHog server-side client using `posthog-node`, used by all API route handlers.
- **`vite.config.ts`** — Added reverse proxy rules for `/ingest/static`, `/ingest/array`, and `/ingest` to route PostHog traffic through the dev server.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/routes/posts.$postId.tsx`** — Captures `invoice_marked_paid` when a user clicks "Mark as Paid".
- **`src/routes/posts_.$postId.deep.tsx`** — Captures `invoice_marked_paid` (with `source: deep_view`) and `invoice_pdf_downloaded` on the deep invoice view.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Captures server-side `invoice_paid_via_api` with session correlation via `X-PostHog-Session-Id` header.
- **`src/routes/api/invoices.ts`** — Captures server-side `invoice_created_via_api` after successful invoice creation.
- **`src/routes/api/invoices.$invoiceId.ts`** — Captures server-side `invoice_deleted_via_api` after invoice deletion.
- **`src/routes/index.tsx`** — Captures `home_cta_clicked` with a `cta` property (`view_invoices` or `manage_team`) when users click the homepage CTAs.

| Event | Description | File |
|---|---|---|
| `invoice_marked_paid` | User clicks "Mark as Paid" on an invoice | `src/routes/posts.$postId.tsx`, `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks "Download PDF" on the invoice deep view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid_via_api` | Invoice payment processed via POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_via_api` | New invoice created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_deleted_via_api` | Invoice deleted via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `home_cta_clicked` | User clicks "View Invoices" or "Manage Team" CTA on home page | `src/routes/index.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights to track the most important business metrics:

1. **Invoice Payment Rate (Trend)** — Track `invoice_marked_paid` over time to see payment velocity. [Create in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

2. **Invoice Payment Funnel** — Funnel from `$pageview` → `invoice_marked_paid` to measure conversion from invoice view to payment. [Create in PostHog](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

3. **API Invoice Activity (Trend)** — Multi-series trend of `invoice_created_via_api`, `invoice_paid_via_api`, and `invoice_deleted_via_api` to monitor API usage patterns. [Create in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Home Page CTA Engagement** — Trend of `home_cta_clicked` broken down by `cta` property to see which CTAs drive the most clicks. [Create in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **PDF Downloads vs Payments** — Compare `invoice_pdf_downloaded` vs `invoice_marked_paid` to understand which invoices get downloaded but not paid (churn signal). [Create in PostHog](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
