<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Router (file-based routing) SaaS application. Here is a summary of every change made:

- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` resolves correctly in TypeScript.
- **`vite.config.js`** — Converted to a factory function using `loadEnv` and added a reverse-proxy configuration that routes `/ingest/*` requests through Vite to the PostHog ingestion endpoint. This avoids ad-blocker interference without exposing the host URL in client code.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).
- **`src/routes/__root.tsx`** — Wrapped the entire app with `PostHogProvider` (from `@posthog/react`). PostHog is initialised once at the root with `capture_exceptions: true` for automatic error tracking, the reverse-proxy `api_host`, and debug mode enabled in development.
- **`src/routes/login.tsx`** — On login form submit: calls `posthog.identify()` to associate the session with the username, then captures `user_signed_in`. On the Sign Out button: captures `user_signed_out` and calls `posthog.reset()` to clear the local identity.
- **`src/routes/dashboard.invoices.index.tsx`** — In the `createInvoiceMutation` success callback: captures `invoice_created` with `invoice_id` and `invoice_title` properties.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — In the `updateInvoiceMutation` success callback: captures `invoice_updated` with `invoice_id` and `invoice_title` properties.
- **`src/routes/_auth.profile.tsx`** — On the Upgrade button click: captures `upgrade_plan_clicked` with `current_plan: 'free'`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and signs in | `src/routes/login.tsx` |
| `user_signed_out` | User clicks Sign Out | `src/routes/login.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account page | `src/routes/_auth.profile.tsx` |

## Next steps

Open the PostHog project to explore your events and build an **Analytics basics** dashboard. We recommend these five insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time. Tracks daily active authenticated users.
2. **Invoice creation trend** — Trends chart for `invoice_created` over time. Core conversion signal.
3. **Invoice update trend** — Trends chart for `invoice_updated` over time. Measures ongoing engagement with invoices.
4. **Login → Invoice creation funnel** — Funnel from `user_signed_in` → `invoice_created`. Shows how many users who sign in go on to create an invoice.
5. **Upgrade intent** — Trends chart for `upgrade_plan_clicked` over time. Revenue intent signal.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [View all events in PostHog](https://us.posthog.com/project/2/data-management/events)
- [Session replay](https://us.posthog.com/project/2/replay)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
