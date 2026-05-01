<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. The following changes were made:

- **`vite.config.js`** — Switched to `defineConfig` factory form to support `loadEnv`. Added a reverse-proxy server config that routes `/ingest`, `/ingest/static`, and `/ingest/array` to PostHog's ingestion and asset origins. This improves ad-blocker resilience and keeps all analytics traffic through your own domain.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` (from `@posthog/react`), initialized with environment-variable-based API key and host, reverse-proxy `api_host`, exception capture, and debug mode in dev. Added a `/// <reference types="vite/client" />` directive for `import.meta.env` TypeScript support.
- **`src/routes/login.tsx`** — On sign-in, calls `posthog.identify(username)` to link the session to the user, then captures `user_signed_in`. On sign-out, captures `user_signed_out` and calls `posthog.reset()` to clear the identity.
- **`src/routes/dashboard.invoices.index.tsx`** — Captures `invoice_created` (with `invoice_id` and `title`) in the mutation `onSuccess` callback after a new invoice is successfully created.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Captures `invoice_updated` (with `invoice_id` and `title`) in the mutation `onSuccess` callback after an invoice is saved.
- **`src/routes/_auth.profile.tsx`** — Captures `upgrade_plan_clicked` (with `current_plan: 'free'`) when the Upgrade button is clicked on the subscription section.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with a username | `src/routes/login.tsx` |
| `user_signed_out` | User signs out from the application | `src/routes/login.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User successfully updates an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/subscription page | `src/routes/_auth.profile.tsx` |

## Next steps

We attempted to create an "Analytics basics" dashboard automatically, but the available API key is missing the `dashboard:write` scope. You can create it manually in your PostHog project with these recommended insights:

1. **Sign-ins over time** — Trend of `user_signed_in` events, showing daily active users signing in.
2. **Sign-in → Invoice created funnel** — Funnel from `user_signed_in` → `invoice_created` to measure activation rate.
3. **Invoice created volume** — Total count of `invoice_created` events to track invoice throughput.
4. **Upgrade intent clicks** — Trend of `upgrade_plan_clicked` events to measure upgrade button engagement.
5. **Sign-out / churn rate** — Trend of `user_signed_out` events to monitor session drop-off.

Visit your PostHog project to build these: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
