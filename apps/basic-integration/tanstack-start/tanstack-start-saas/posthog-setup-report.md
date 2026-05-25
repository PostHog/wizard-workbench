<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Start business management platform. The integration covers client-side event tracking, server-side event capture, error tracking via `capture_exceptions`, and a reverse proxy for reliable event delivery.

**Changes made:**

- **`src/utils/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture, using `posthog-node` with `flushAt: 1` and `flushInterval: 0` for immediate delivery.
- **`src/routes/__root.tsx`**: Wrapped the application shell with `PostHogProvider` from `@posthog/react`, configured with the reverse proxy host (`/ingest`), session replay, and automatic exception capture.
- **`vite.config.ts`**: Added reverse proxy rules routing `/ingest/static`, `/ingest/array`, and `/ingest` to PostHog's US ingestion and asset endpoints.
- **`src/routes/posts.$postId.tsx`**: Added `invoice_viewed` (funnel entry), `invoice_paid` (conversion), and `invoice_deep_view_opened` (engagement) events.
- **`src/routes/posts_.$postId.deep.tsx`**: Added `invoice_paid_deep` (conversion from deep view) and `invoice_pdf_download_clicked` (engagement) events.
- **`src/routes/api/invoices.$invoiceId.pay.ts`**: Added server-side `invoice_paid_api` event using `posthog-node`, reading session ID and distinct ID from request headers for cross-domain correlation.
- **`src/routes/api/invoices.ts`**: Added server-side `invoice_created_api` event to track new invoice creation via the API.
- **`src/routes/users.$userId.tsx`**: Added `team_member_viewed` event capturing which team member profiles are being viewed.
- **`src/routes/index.tsx`**: Added three CTA click events: `home_view_invoices_clicked`, `home_manage_team_clicked`, and `home_pending_invoice_clicked`.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `invoice_viewed` | User opens an invoice detail page (funnel entry) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User clicks "Mark as Paid" on the invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_deep_view_opened` | User clicks "View Full Details" on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_paid_deep` | User clicks "Mark as Paid" from the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks "Download PDF" on an invoice | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid_api` | Invoice marked as paid via the API endpoint (server-side) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_api` | New invoice created via the API endpoint (server-side) | `src/routes/api/invoices.ts` |
| `team_member_viewed` | User opens a team member profile page | `src/routes/users.$userId.tsx` |
| `home_view_invoices_clicked` | User clicks "View Invoices" CTA on the home page | `src/routes/index.tsx` |
| `home_manage_team_clicked` | User clicks "Manage Team" CTA on the home page | `src/routes/index.tsx` |
| `home_pending_invoice_clicked` | User clicks "View Invoice" from the pending items banner | `src/routes/index.tsx` |

## Next steps

Once events start flowing, head to your [PostHog project](https://us.i.posthog.com) to build dashboards. Suggested insights to create:

1. **Invoice payment funnel**: `invoice_viewed` → `invoice_paid` (or `invoice_paid_deep`) — tracks your core conversion rate.
2. **Invoice paid trend**: Daily/weekly trend of `invoice_paid` + `invoice_paid_api` — tracks payment volume over time.
3. **Home page CTA engagement**: Breakdown of `home_view_invoices_clicked` vs `home_manage_team_clicked` — shows which sections drive the most traffic.
4. **PDF download engagement**: Trend of `invoice_pdf_download_clicked` — measures how often users download invoices.
5. **Team member views**: Top viewed team members via `team_member_viewed` broken down by `user_name`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
