<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **CloudFlow** React TanStack Router (file-based routing) application. Here is a summary of all changes made:

## Changes summary

### New dependencies
- `posthog-js` — PostHog JavaScript SDK
- `@posthog/react` — React bindings (hooks and `PostHogProvider`)

### Environment variables (`.env`)
- `VITE_PUBLIC_POSTHOG_KEY` — Project API key
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog ingestion host

### Files modified

| File | Change |
|------|--------|
| `vite.config.js` | Added `/ingest` reverse proxy to route PostHog requests through the dev server, avoiding ad-blockers |
| `src/routes/__root.tsx` | Wrapped the root component with `PostHogProvider` (with `capture_exceptions`, `defaults`, and `debug` options) |
| `src/routes/login.tsx` | Added `user_logged_in` (with `posthog.identify()`) and `user_logged_out` (with `posthog.reset()`) |
| `src/routes/dashboard.invoices.index.tsx` | Added `invoice_created` (on success) and `invoice_create_failed` (on failure) |
| `src/routes/dashboard.invoices.$invoiceId.tsx` | Added `invoice_updated` (on success), `invoice_update_failed` (on failure), and `invoice_notes_toggled` |
| `src/routes/dashboard.users.route.tsx` | Added `team_members_sorted` when the sort order changes |
| `src/routes/_auth.profile.tsx` | Added `upgrade_plan_clicked` on the Upgrade button |
| `src/routes/dashboard.index.tsx` | Added `dashboard_quick_action_clicked` for Create Invoice and Manage Team links |
| `src/vite-env.d.ts` | Created Vite client type declaration for `import.meta.env` TypeScript support |

## Tracked events

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submits the login form. Calls `posthog.identify()` with username. | `src/routes/login.tsx` |
| `user_logged_out` | User clicks Sign Out. Calls `posthog.reset()` to clear identity. | `src/routes/login.tsx` |
| `invoice_created` | Invoice created successfully via the Create Invoice form. Includes `invoice_id` and `title`. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_create_failed` | Invoice creation failed (e.g. title contains 'error'). Includes `title`. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Invoice changes saved successfully. Includes `invoice_id` and `title`. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_update_failed` | Invoice update failed. Includes `invoice_id` and `title`. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | Notes section shown or hidden on an invoice. Includes `invoice_id` and `action` ('show'/'hide'). | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_members_sorted` | User changes the sort order on the team members list. Includes `sort_by`. | `src/routes/dashboard.users.route.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the Account Settings page. Includes `current_plan`. | `src/routes/_auth.profile.tsx` |
| `dashboard_quick_action_clicked` | User clicks a quick action link on the dashboard. Includes `action` ('create_invoice' or 'manage_team'). | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboard/1213872)** — Overview of all key CloudFlow metrics
- 🔐 **[User Authentication Activity](https://us.posthog.com/project/238460/insights/nWCf7GoW)** — Daily login and logout trends
- 📄 **[Invoice Management Activity](https://us.posthog.com/project/238460/insights/F2ujkSdx)** — Invoice creation and update trends
- 💰 **[Upgrade Intent Tracking](https://us.posthog.com/project/238460/insights/58sbPQi2)** — Upgrade button click conversion signal
- 👥 **[Team Collaboration Activity](https://us.posthog.com/project/238460/insights/VfhFLnyc)** — Team member engagement and sorting

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
