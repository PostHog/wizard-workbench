<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application (React + TanStack Router, file-based routing). The following changes were made:

- **`vite.config.js`** – Updated to a function-form config that loads env vars and adds a `/ingest` reverse proxy to the PostHog host. This routes all PostHog traffic through your own domain, improving ad-blocker resilience and privacy.
- **`src/vite-env.d.ts`** *(new)* – Added Vite client type declarations so `import.meta.env` is correctly typed throughout the project.
- **`.env`** – Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (added to `.gitignore`).
- **`src/routes/__root.tsx`** – Wrapped the entire application in `<PostHogProvider>` with `capture_exceptions: true`, `debug` in dev mode, and the reverse proxy `api_host`. All child routes now have access to the PostHog client via `usePostHog()`.
- **`src/routes/login.tsx`** – Added `user_logged_in` capture with `posthog.identify()` on login, and `user_logged_out` capture with `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`** – Added `invoice_created` capture in the `onSuccess` callback of the create invoice mutation.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** – Added `invoice_updated` capture in the `onSuccess` callback of the update invoice mutation, and `invoice_notes_toggled` capture on the Add/Hide Notes link click.
- **`src/routes/_auth.profile.tsx`** – Added `upgrade_plan_clicked` capture on the Upgrade button.
- **`src/routes/dashboard.users.route.tsx`** – Added `team_member_sorted` in the `setSortBy` handler and `team_member_searched` on search input blur (fires when the user finishes typing and leaves the field).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User submitted the login form and authenticated successfully | `src/routes/login.tsx` |
| `user_logged_out` | User clicked Sign Out and ended their session | `src/routes/login.tsx` |
| `invoice_created` | User submitted the create invoice form successfully | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggled the internal notes panel on an invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on the profile page | `src/routes/_auth.profile.tsx` |
| `team_member_searched` | User searched/filtered the team members list | `src/routes/dashboard.users.route.tsx` |
| `team_member_sorted` | User changed the sort order of team members | `src/routes/dashboard.users.route.tsx` |

## Next steps

The integration is ready. Once events start flowing into PostHog, we recommend creating an **"Analytics basics"** dashboard with the following insights:

1. **Login trend** – `user_logged_in` event count over time (line chart). Tracks daily active sign-ins and growth.
2. **Invoice creation funnel** – Funnel: `user_logged_in` → `invoice_created`. Shows the conversion rate from login to creating an invoice.
3. **Invoice update activity** – `invoice_updated` event count over time. Tracks engagement with existing invoices.
4. **Upgrade intent** – `upgrade_plan_clicked` event count. A leading indicator of paid conversion intent.
5. **Churn signal** – `user_logged_out` event count over time. A lagging indicator of session engagement.

You can create these in [PostHog Insights](https://us.posthog.com/project/2/insights) and add them to a new "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
