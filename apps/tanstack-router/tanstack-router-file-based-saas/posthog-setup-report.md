<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application (TanStack Router, file-based routing). Here is a summary of all changes made:

- **Installed packages**: `posthog-js` (v1.352.1) and `@posthog/react` (v1.8.0) were added as dependencies.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` were added to `.env` for secure, build-time-accessible configuration.
- **TypeScript types**: Added `"types": ["vite/client"]` to `tsconfig.json` to enable `import.meta.env` type-checking.
- **PostHog Provider** (`src/routes/__root.tsx`): The entire app is now wrapped in `<PostHogProvider>` with the API key, reverse proxy host (`/ingest`), exception capture, and debug mode enabled in development.
- **Vite reverse proxy** (`vite.config.js`): Added a `/ingest` proxy route pointing to the PostHog host. This routes all PostHog network requests through the dev server, bypassing ad-blockers.
- **Event tracking**: 10 events were instrumented across 6 route files, covering user authentication, invoice lifecycle, conversion, and churn signals (see table below).
- **User identification**: `posthog.identify()` is called on sign-in with the username as the distinct ID. `posthog.reset()` is called on sign-out to clear identity.
- **Exception tracking**: `posthog.captureException()` is called in invoice create/update error handlers for automatic error monitoring.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to CloudFlow. Identifies the user in PostHog. | `src/routes/login.tsx` |
| `user_signed_out` | User signs out of CloudFlow. Resets PostHog identity. | `src/routes/login.tsx` |
| `invoice_created` | User successfully creates a new invoice. Key conversion event in the invoicing workflow. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. Tracks invoice title and body modifications. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_creation_failed` | Invoice creation fails. Tracks churn/friction points in the invoicing flow. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_update_failed` | Invoice update fails. Tracks errors during invoice editing. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/account page. Important conversion funnel event. | `src/routes/_auth.profile.tsx` |
| `dashboard_viewed` | User views the main dashboard page. Top-of-funnel engagement event. | `src/routes/dashboard.index.tsx` |
| `user_profile_viewed` | Admin views a team member's profile. Tracks user management engagement. | `src/routes/dashboard.users.user.tsx` |
| `invoice_notes_toggled` | User shows or hides the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

## Next steps

We've instrumented your app with 10 key business events. You can now build insights and dashboards in PostHog to monitor user behavior. Here are 5 recommended insights to create in your [PostHog project](https://us.posthog.com/project/2):

1. **Sign-in to Upgrade Conversion Funnel** — Funnel: `user_signed_in` → `dashboard_viewed` → `upgrade_plan_clicked`. Shows how many users convert from sign-in to upgrade intent.
2. **Invoice Creation Success Rate** — Trend: `invoice_created` vs `invoice_creation_failed`. Monitors the health of your core invoicing workflow.
3. **Daily Active Users** — Trend: unique users firing `user_signed_in` per day. Tracks daily engagement and growth.
4. **Invoice Activity Over Time** — Trends: `invoice_created` + `invoice_updated` stacked. Shows invoicing engagement over time.
5. **Churn Signals** — Trends: `user_signed_out` + `invoice_creation_failed`. Surfaces friction and disengagement signals together.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
