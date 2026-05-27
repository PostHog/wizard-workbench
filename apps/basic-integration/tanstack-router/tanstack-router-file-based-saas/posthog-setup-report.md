<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. Here is a summary of all changes made:

- **`vite.config.js`** — Updated to use `defineConfig` with env loading and added a reverse proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) to avoid ad-blocker interference.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is properly typed.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/routes/__root.tsx`** — Wrapped the entire app in `PostHogProvider` and added a `PostHogPageView` component that fires `$pageview` events on route changes using TanStack Router's state.
- **`src/routes/login.tsx`** — Added `posthog.identify()` and `user_signed_in` capture on login form submit; `user_signed_out` capture and `posthog.reset()` on sign out.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `invoice_created` capture in the mutation `onSuccess` callback.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `invoice_viewed` capture on mount (via `useEffect`) and `invoice_updated` capture in the mutation `onSuccess` callback.
- **`src/routes/_auth.profile.tsx`** — Added `upgrade_plan_clicked` capture on the Upgrade button's `onClick` handler.
- **`src/routes/dashboard.users.user.tsx`** — Added `team_member_viewed` capture on mount (via `useEffect`).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully submits the login form and signs in | `src/routes/login.tsx` |
| `user_signed_out` | Authenticated user clicks Sign Out and is logged out | `src/routes/login.tsx` |
| `invoice_created` | User submits the create invoice form and a new invoice is created | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on their account page | `src/routes/_auth.profile.tsx` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/dashboard.users.user.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time, to monitor daily active users and login volume.
2. **Invoice creation funnel** — Funnel from `user_signed_in` → `invoice_viewed` → `invoice_created`, to measure conversion through the core invoicing flow.
3. **Invoice update rate** — Trends chart for `invoice_updated` to track how often users edit invoices after creation.
4. **Upgrade click trend** — Trends chart for `upgrade_plan_clicked` to monitor upgrade intent and identify conversion opportunities.
5. **Team engagement** — Trends chart for `team_member_viewed` to track how frequently users explore team features.

To create the dashboard, visit your [PostHog project](https://us.posthog.com) and navigate to **Dashboards → New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
