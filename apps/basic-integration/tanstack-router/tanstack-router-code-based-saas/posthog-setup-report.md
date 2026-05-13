<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for **CloudFlow**, a React SaaS application using TanStack Router with code-based routing.

## Summary of changes

| File | Change |
|------|--------|
| `src/main.tsx` | Added `posthog-js` and `@posthog/react` imports; initialized PostHog at module level with reverse-proxy config and `capture_pageview: false`; wrapped `RootComponent` with `PostHogProvider`; subscribed to router `onResolved` for SPA pageview tracking; added `usePostHog()` + event capture in `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, `InvoiceComponent`, and `UsersLayoutComponent` |
| `vite.config.js` | Added Vite reverse-proxy rules for `/ingest/static`, `/ingest/array`, and `/ingest` → PostHog ingestion endpoints (improves ad-blocker resistance and reduces latency) |
| `.env` | Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` |
| `tsconfig.json` | Added `"types": ["vite/client"]` to resolve `import.meta.env` TypeScript types |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user submits the login form; also calls `posthog.identify()` with username | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks sign out from profile page or login page; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | Fired on successful invoice creation via the create invoice form | `src/main.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice | `src/main.tsx` |
| `plan_upgrade_clicked` | Fired when a user clicks the Upgrade button on the account settings page | `src/main.tsx` |
| `team_member_viewed` | Fired when a user clicks on a team member to view their profile | `src/main.tsx` |
| `$pageview` | Captured automatically on every route change via router subscription | `src/main.tsx` |

## Next steps

We've prepared the following insights to add to an **"Analytics basics"** dashboard in PostHog. Visit each link to create and save them:

1. **Daily Logins (Trend)** — Track authentication volume over time
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

2. **Login → Invoice Funnel** — Measure conversion from login to invoice creation
   → https://us.posthog.com/project/2/insights/new?insight=FUNNELS

3. **Invoice Activity (Trend)** — Volume of invoices created and updated per day
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

4. **Plan Upgrade Clicks (Trend)** — Track upgrade intent signals over time
   → https://us.posthog.com/project/2/insights/new?insight=TRENDS

5. **User Login Retention** — See how often users return to log in after first sign-in
   → https://us.posthog.com/project/2/insights/new?insight=RETENTION

Create a dashboard to hold these:
→ https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
