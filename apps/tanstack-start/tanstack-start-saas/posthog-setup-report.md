<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start SaaS application. The following changes were made:

- **`src/routes/__root.tsx`**: Added `PostHogProvider` from `@posthog/react` wrapping the app shell in the `RootDocument` component. Configured with the `/ingest` reverse proxy, exception capture, and environment-variable-based API key and host.
- **`src/utils/posthog-server.ts`** *(new file)*: Created a singleton PostHog Node.js client using `posthog-node` for server-side event capture in API routes.
- **`src/routes/posts.$postId.tsx`**: Added `invoice_marked_paid` capture when a user clicks "Mark as Paid" on an invoice, including invoice ID, title, and amount as properties.
- **`src/routes/posts_.$postId.deep.tsx`**: Added `invoice_marked_paid` capture when a user clicks "Mark as Paid" from the full invoice detail view, with a `source: 'deep_view'` property to distinguish it.
- **`src/routes/api/invoices.$invoiceId.pay.ts`**: Added server-side `invoice_paid_server` capture after a successful payment via the REST API, reading the `X-PostHog-Session-Id` header for session correlation.
- **`src/routes/api/invoices.ts`**: Added server-side `invoice_created_server` capture after a new invoice is successfully created via the REST API.
- **`vite.config.ts`**: Added a reverse proxy for `/ingest` → `https://us.i.posthog.com` to route PostHog requests through the Vite dev server.
- **`.env`**: Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

**Packages installed**: `posthog-js`, `@posthog/react`, `posthog-node`

| Event Name | Description | File |
|---|---|---|
| `invoice_marked_paid` | User clicked "Mark as Paid" on invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicked "Mark as Paid" on invoice full-detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid_server` | Invoice successfully marked as paid via REST API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | New invoice created via REST API | `src/routes/api/invoices.ts` |

## Next steps

To set up an "Analytics basics" dashboard in PostHog, navigate to your PostHog project and create a new dashboard with insights such as:

1. **Invoice payment rate** – Funnel from `invoice_marked_paid` to `invoice_paid_server` to see client vs. server-side payment confirmation
2. **Invoice creation trend** – Trend of `invoice_created_server` over time to track business growth
3. **Invoice payment volume** – Total count of `invoice_marked_paid` events segmented by `invoice_amount`
4. **Revenue tracking** – Sum of `invoice_amount` property on `invoice_paid_server` events over time
5. **Session activity** – Active user sessions tracked via PostHog's built-in session recording

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
