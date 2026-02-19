<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (file-based routing) SaaS application. The following changes were made:

- **`posthog-js` installed** (v1.351.3) via pnpm
- **Environment variables** set in `.env` (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`) and covered by `.gitignore`
- **Vite reverse proxy** configured in `vite.config.js` — all PostHog requests route through `/ingest` to avoid ad blockers
- **`PostHogProvider`** added to `src/routes/__root.tsx` wrapping the entire app with `capture_exceptions: true` for automatic error tracking and `defaults: '2026-01-30'` for the latest PostHog defaults
- **User identification** added to `src/routes/login.tsx` — `posthog.identify()` called on sign-in using the username as distinct ID, and `posthog.reset()` called on sign-out to clear the session
- **8 business events** instrumented across 4 route files

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully submits the login form | `src/routes/login.tsx` |
| `user_signed_out` | User clicks Sign Out while authenticated | `src/routes/login.tsx` |
| `invoice_created` | New invoice form submitted successfully | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Invoice edit form saved successfully | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | Internal notes panel opened or closed on an invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `plan_upgrade_clicked` | Upgrade button clicked on the Account/Profile page | `src/routes/_auth.profile.tsx` |
| `dashboard_viewed` | User lands on the main dashboard overview | `src/routes/dashboard.index.tsx` |
| `quick_action_clicked` | User clicks a Quick Action link on the dashboard | `src/routes/dashboard.index.tsx` |

## Next steps

Once events are flowing into PostHog, we recommend building these insights on your [PostHog dashboard](https://us.posthog.com):

1. **Sign-in & Sign-out Trend** — Trends for `user_signed_in` and `user_signed_out` over time to monitor daily active authentication
2. **Invoice Activity** — Trends for `invoice_created` and `invoice_updated` to track core business activity
3. **Login → Dashboard → Invoice Funnel** — Funnel with steps `user_signed_in` → `dashboard_viewed` → `invoice_created` to measure activation rate
4. **Plan Upgrade Clicks** — Trend of `plan_upgrade_clicked` to track upgrade funnel entry
5. **Dashboard Engagement** — Trends for `dashboard_viewed` and `quick_action_clicked` to understand feature discovery

You can create these by navigating to **Insights → New insight** in your [PostHog project](https://us.posthog.com).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
