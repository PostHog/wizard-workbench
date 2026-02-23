<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow TanStack Start application. Here's a summary of every change made:

- **`src/utils/posthog-server.ts`** — Created a singleton `posthog-node` client used for all server-side event capture. Uses `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/routes/__root.tsx`** — Added `PostHogProvider` wrapping the shell body, enabling automatic pageview tracking, session replay, and exception capture across all routes. Uses `/ingest` reverse proxy for improved reliability.
- **`vite.config.ts`** — Added `/ingest` reverse proxy pointing to `https://us.i.posthog.com` to route PostHog requests through your own domain.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables (gitignore coverage ensured).
- **Client-side tracking** added to 5 files, **server-side tracking** added to 3 API route files, and **error tracking** added to the global error boundary.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | Fired when a user successfully creates a new invoice via the invoice creation form | `src/routes/posts.index.tsx` |
| `invoice_viewed` | Fired when a user navigates to view a specific invoice (top of conversion funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired when a user clicks 'Mark as Paid' on an invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired when a user clicks 'Mark as Paid' on the full invoice detail page (with `source: 'deep_view'`) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | Fired when a user clicks the Download PDF button on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `cta_clicked` | Fired when a user clicks a primary CTA button on the home page (View Invoices or Manage Team) | `src/routes/index.tsx` |
| `error_displayed` | PostHog exception capture whenever the global error boundary catches an error | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_created_server` | Server-side event fired when an invoice is successfully created via the API route | `src/routes/api/invoices.ts` |
| `invoice_paid_server` | Server-side event fired when an invoice payment is successfully processed via the API route | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_deleted_server` | Server-side event fired when an invoice is deleted via the API route | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We recommend creating the following insights and dashboard in PostHog to monitor your key business metrics:

### Suggested dashboard: "Analytics basics"

Go to [https://us.posthog.com/insights/new](https://us.posthog.com/insights/new) to create these insights, then add them to a new dashboard named **"Analytics basics"**:

1. **Invoice Creation to Payment Funnel** — A funnel from `invoice_viewed` → `invoice_marked_paid` to measure your payment conversion rate.
2. **Invoice Activity Over Time** — A line chart trending `invoice_created` and `invoice_marked_paid` daily.
3. **Homepage CTA Clicks** — A bar chart of `cta_clicked` broken down by `cta_label` to see which CTAs drive the most engagement.
4. **Invoice Lifecycle - Server Events** — A line chart of `invoice_created_server`, `invoice_paid_server`, and `invoice_deleted_server` to monitor backend activity.
5. **Invoice PDF Download Rate** — A line chart comparing `invoice_pdf_downloaded` vs `invoice_viewed` to measure PDF engagement.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
