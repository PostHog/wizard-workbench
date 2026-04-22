<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers client-side event tracking using `@posthog/react`, server-side event tracking using `posthog-node`, automatic exception capture, and a Vite reverse proxy for reliable ingestion.

## Changes summary

- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the app shell, enabling automatic pageview tracking, session replay, and exception capture across all routes.
- **`src/utils/posthog-server.ts`** *(new file)* — Singleton server-side PostHog client used in API routes.
- **`vite.config.ts`** — Added reverse proxy rules for `/ingest/static`, `/ingest/array`, and `/ingest` to route PostHog traffic through the dev server.
- **`.env`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form successfully | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks "Mark as Paid" on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_viewed` | User views a specific invoice detail page (funnel entry) | `src/routes/posts.$postId.tsx` |
| `team_member_viewed` | User views the profile page of a team member | `src/routes/users.$userId.tsx` |
| `app_error_occurred` | Unhandled error caught by DefaultCatchBoundary | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_paid_server` | Server-side: invoice marked as paid via API endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Server-side: invoice created via API endpoint | `src/routes/api/invoices.ts` |
| `invoice_updated_server` | Server-side: invoice updated via PATCH API endpoint | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted_server` | Server-side: invoice deleted via API endpoint | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

To build insights and a dashboard in PostHog, navigate to your PostHog project and create the following:

**Suggested insights for an "Analytics basics" dashboard:**

1. **Invoice creation funnel** — Funnel from `invoice_viewed` → `invoice_marked_paid` to measure conversion from viewing to payment.
2. **Invoices created over time** — Trend of `invoice_created` events to track business volume.
3. **Invoice payment rate** — Ratio of `invoice_marked_paid` to `invoice_created` events.
4. **Error frequency** — Trend of `app_error_occurred` events to monitor application health.
5. **Team activity** — Trend of `team_member_viewed` to understand collaboration patterns.

To create these, visit your PostHog project at https://us.i.posthog.com and navigate to **Insights** → **New insight**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
