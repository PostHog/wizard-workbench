# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. The integration includes:

- **Client-side tracking** via `@posthog/react` with `PostHogProvider` wrapping the app in `__root.tsx`
- **Server-side tracking** via `posthog-node` with a singleton pattern in `src/utils/posthog-server.ts`
- **Reverse proxy configuration** in `vite.config.ts` to route PostHog requests through `/ingest`
- **Exception capture** enabled automatically via the PostHog provider options
- **Error boundary tracking** with automatic exception capture and user interaction events

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `invoice_paid` | Server-side event when an invoice is successfully marked as paid via the API endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | Server-side event when a new invoice is created via the API endpoint | `src/routes/api/invoices.ts` |
| `invoice_mark_paid_clicked` | Client-side event when user clicks the Mark as Paid button on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_details_viewed` | Client-side event when user views the full details of an invoice | `src/routes/posts.$postId.tsx` |
| `cta_clicked` | Client-side event when user clicks a call-to-action button on the home page | `src/routes/index.tsx` |
| `error_boundary_shown` | Client-side event when an error boundary is displayed to the user | `src/components/DefaultCatchBoundary.tsx` |
| `error_retry_clicked` | Client-side event when user clicks the Try Again button after an error | `src/components/DefaultCatchBoundary.tsx` |

## Files Modified

- `src/routes/__root.tsx` - Added PostHogProvider for client-side analytics
- `src/utils/posthog-server.ts` - Created server-side PostHog client singleton
- `vite.config.ts` - Added PostHog reverse proxy configuration
- `src/routes/api/invoices.$invoiceId.pay.ts` - Added server-side invoice payment tracking
- `src/routes/api/invoices.ts` - Added server-side invoice creation tracking
- `src/routes/posts.$postId.tsx` - Added client-side invoice interaction events
- `src/routes/index.tsx` - Added CTA click tracking
- `src/components/DefaultCatchBoundary.tsx` - Added error tracking and exception capture

## Environment Variables

The following environment variables have been configured in `.env`:

- `VITE_PUBLIC_POSTHOG_KEY` - Your PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` - PostHog API host (https://us.i.posthog.com)

## Next steps

We recommend building the following insights in PostHog to monitor user behavior:

1. **Invoice Conversion Funnel** - Track users from `cta_clicked` (View Invoices) → `invoice_details_viewed` → `invoice_mark_paid_clicked` → `invoice_paid`
2. **Invoice Payment Rate** - Compare `invoice_created` vs `invoice_paid` events over time
3. **CTA Engagement** - Breakdown of `cta_clicked` events by `cta_name` property
4. **Error Monitoring** - Track `error_boundary_shown` events to identify user experience issues
5. **Error Recovery Rate** - Ratio of `error_retry_clicked` to `error_boundary_shown`

To create these insights, go to your PostHog dashboard at https://us.i.posthog.com and create a new dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
