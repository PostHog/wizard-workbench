<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. Here is a summary of all changes made:

- **`src/routes/__root.tsx`** — Added `PostHogProvider` from `@posthog/react` wrapping the app shell with `capture_exceptions: true`, a reverse proxy `api_host`, and debug mode in dev.
- **`vite.config.ts`** — Added a Vite dev-server reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` routes to improve ad-blocker resilience and PostHog asset delivery.
- **`src/utils/posthog-server.ts`** — Created a singleton PostHog Node.js client (`posthog-node`) for server-side event capture across API routes.
- **`src/routes/posts.$postId.tsx`** — Added `invoice_viewed` (top-of-funnel) and `invoice_mark_paid_clicked` (with session ID) client-side events.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Added server-side `invoice_paid` event with session and distinct ID correlation headers.
- **`src/routes/api/invoices.ts`** — Added server-side `invoice_created` event after successful invoice creation.
- **`src/routes/api/invoices.$invoiceId.ts`** — Added server-side `invoice_updated` and `invoice_deleted` events.
- **`src/routes/users.$userId.tsx`** — Added `team_member_viewed` client-side event.

## Events

| Event | Description | File |
|-------|-------------|------|
| `invoice_viewed` | User views an invoice detail page — top of payment conversion funnel | `src/routes/posts.$postId.tsx` |
| `invoice_mark_paid_clicked` | User clicks the Mark as Paid button on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Server-side: invoice status successfully updated to paid via the pay API route | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side: a new invoice is successfully created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_updated` | Server-side: an invoice is successfully updated via PATCH /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server-side: an invoice is successfully deleted via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/users.$userId.tsx` |

## Next steps

We've pre-configured some insights for you to keep an eye on user behavior, based on the events we just instrumented. Click each link to open the pre-filled insight in PostHog, then save it to a dashboard:

- [Invoice Payment Conversion Funnel](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjogIkZVTk5FTFMiLCAiZXZlbnRzIjogW3siaWQiOiAiaW52b2ljZV92aWV3ZWQiLCAidHlwZSI6ICJldmVudHMiLCAib3JkZXIiOiAwLCAibmFtZSI6ICJpbnZvaWNlX3ZpZXdlZCJ9LCB7ImlkIjogImludm9pY2VfbWFya19wYWlkX2NsaWNrZWQiLCAidHlwZSI6ICJldmVudHMiLCAib3JkZXIiOiAxLCAibmFtZSI6ICJpbnZvaWNlX21hcmtfcGFpZF9jbGlja2VkIn0sIHsiaWQiOiAiaW52b2ljZV9wYWlkIiwgInR5cGUiOiAiZXZlbnRzIiwgIm9yZGVyIjogMiwgIm5hbWUiOiAiaW52b2ljZV9wYWlkIn1dfQ==) — Full 3-step funnel from view → click → paid
- [Drop-off: Viewed but not Paid](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjogIkZVTk5FTFMiLCAiZXZlbnRzIjogW3siaWQiOiAiaW52b2ljZV92aWV3ZWQiLCAidHlwZSI6ICJldmVudHMiLCAib3JkZXIiOiAwLCAibmFtZSI6ICJpbnZvaWNlX3ZpZXdlZCJ9LCB7ImlkIjogImludm9pY2VfbWFya19wYWlkX2NsaWNrZWQiLCAidHlwZSI6ICJldmVudHMiLCAib3JkZXIiOiAxLCAibmFtZSI6ICJpbnZvaWNlX21hcmtfcGFpZF9jbGlja2VkIn1dfQ==) — Where users drop off in the payment flow
- [Invoice Activity: Created vs Paid](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjogIlRSRU5EUyIsICJldmVudHMiOiBbeyJpZCI6ICJpbnZvaWNlX3BhaWQiLCAidHlwZSI6ICJldmVudHMiLCAibmFtZSI6ICJpbnZvaWNlX3BhaWQifSwgeyJpZCI6ICJpbnZvaWNlX2NyZWF0ZWQiLCAidHlwZSI6ICJldmVudHMiLCAibmFtZSI6ICJpbnZvaWNlX2NyZWF0ZWQifV19) — Trend of invoices created vs invoices paid over time
- [Unique Invoice Views (Daily Active)](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjogIlRSRU5EUyIsICJldmVudHMiOiBbeyJpZCI6ICJpbnZvaWNlX3ZpZXdlZCIsICJ0eXBlIjogImV2ZW50cyIsICJtYXRoIjogImRhdSIsICJuYW1lIjogImludm9pY2Vfdmlld2VkIn1dfQ==) — Daily unique users viewing invoices
- [Team Member Profile Views](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjogIlRSRU5EUyIsICJldmVudHMiOiBbeyJpZCI6ICJ0ZWFtX21lbWJlcl92aWV3ZWQiLCAidHlwZSI6ICJldmVudHMiLCAibmFtZSI6ICJ0ZWFtX21lbWJlcl92aWV3ZWQifV19) — Trend of team member profile views

To build the "Analytics basics" dashboard:
1. Open each link above, review the insight, and click **Save**
2. Go to [Dashboards → New dashboard](https://us.posthog.com/project/2/dashboard/new)
3. Name it **Analytics basics** and add your saved insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
