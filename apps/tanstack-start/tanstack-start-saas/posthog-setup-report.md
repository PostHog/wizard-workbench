<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. Here is a summary of all changes made:

## What was set up

- **`posthog-js`** and **`posthog-node`** installed via pnpm
- **`@posthog/react`** installed for the React PostHog provider and hooks
- **`PostHogProvider`** added to `src/routes/__root.tsx` (shell component) to initialize PostHog client-side with session replay, exception capture, and debug mode in development
- **Vite reverse proxy** configured in `vite.config.ts` to route `/ingest` to PostHog, avoiding ad-blocker interference
- **Server-side PostHog singleton** created at `src/utils/posthog-server.ts` using `posthog-node` for reliable server-side event capture
- **Environment variables** written to `.env`: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`
- **Client-side event tracking** added to invoice creation and payment flows
- **Server-side event tracking** added to the invoice API routes

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | Fired client-side when a user successfully creates a new invoice | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | Fired client-side when a user marks an invoice as paid from the detail page | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | Fired client-side when a user marks an invoice as paid from the full details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_paid_server` | Fired server-side when the pay invoice API endpoint processes a payment | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_server` | Fired server-side when the create invoice API endpoint creates an invoice | `src/routes/api/invoices.ts` |

## Next steps

To view your analytics, log in to your PostHog project and navigate to the Insights section. Suggested insights to create:

- **Invoice creation trend** – trend chart for `invoice_created` over time
- **Payment conversion funnel** – funnel from `invoice_created` → `invoice_marked_paid`
- **Invoice payment rate** – ratio of `invoice_marked_paid` to `invoice_created`
- **Server-side payment confirmation** – trend chart for `invoice_paid_server`

To create a dashboard automatically in the future, configure a `POSTHOG_PERSONAL_API_KEY` in your environment and re-run the wizard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
