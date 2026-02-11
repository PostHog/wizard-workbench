# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. The integration includes both client-side and server-side event tracking, error tracking with exception capture, and comprehensive business event instrumentation for invoicing and team management workflows.

## Summary of Changes

### Infrastructure Files Created
- `src/utils/posthog-server.ts` - Server-side PostHog client singleton for API route event capture

### Files Modified

| File | Changes |
|------|---------|
| `src/routes/__root.tsx` | Added `PostHogProvider` to wrap the app with client-side analytics, session replay, and automatic exception capture |
| `src/routes/posts.$postId.tsx` | Added `invoice_viewed` and `invoice_paid` event tracking |
| `src/routes/index.tsx` | Added `view_invoices_clicked`, `manage_team_clicked`, and `pending_invoice_clicked` event tracking |
| `src/routes/users.$userId.tsx` | Added `team_member_viewed` event tracking |
| `src/routes/api/invoices.ts` | Added server-side `invoice_created` event tracking |
| `src/routes/api/invoices.$invoiceId.pay.ts` | Added server-side `invoice_payment_completed` event tracking |
| `src/routes/api/invoices.$invoiceId.ts` | Added server-side `invoice_updated` and `invoice_deleted` event tracking |
| `src/components/DefaultCatchBoundary.tsx` | Added `error_displayed`, `error_retry_clicked` events and `captureException` for error tracking |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `invoice_viewed` | User views an invoice detail page - top of payment funnel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid - critical business conversion event | `src/routes/posts.$postId.tsx` |
| `view_invoices_clicked` | User clicks to view invoices from homepage - engagement action | `src/routes/index.tsx` |
| `manage_team_clicked` | User clicks to manage team from homepage - engagement action | `src/routes/index.tsx` |
| `pending_invoice_clicked` | User clicks on pending invoice notification from homepage | `src/routes/index.tsx` |
| `team_member_viewed` | User views a team member profile | `src/routes/users.$userId.tsx` |
| `invoice_created` | Server-side event when an invoice is created - business critical | `src/routes/api/invoices.ts` |
| `invoice_payment_completed` | Server-side event when invoice payment is processed - critical conversion | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Server-side event when an invoice is updated | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server-side event when an invoice is deleted - churn indicator | `src/routes/api/invoices.$invoiceId.ts` |
| `error_displayed` | Track when errors are displayed to users for debugging | `src/components/DefaultCatchBoundary.tsx` |
| `error_retry_clicked` | User clicks retry after an error | `src/components/DefaultCatchBoundary.tsx` |

## Configuration

Environment variables required (add to `.env` or `.env.local`):
```
VITE_PUBLIC_POSTHOG_KEY=your_posthog_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

Once you start receiving events in PostHog, consider creating these insights:

1. **Invoice Payment Funnel** - Track the conversion from `invoice_viewed` to `invoice_paid` and `invoice_payment_completed`
2. **Homepage Engagement** - Monitor `view_invoices_clicked` vs `manage_team_clicked` to understand user priorities
3. **Invoice Lifecycle** - Track `invoice_created` -> `invoice_updated` -> `invoice_payment_completed` vs `invoice_deleted`
4. **Error Rate Dashboard** - Monitor `error_displayed` events and correlate with user drop-off
5. **Team Engagement** - Track `team_member_viewed` events to understand team collaboration patterns

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
