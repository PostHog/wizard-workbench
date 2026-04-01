<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. Here's a summary of the changes made:

- **`vite.config.js`** — Updated to use `defineConfig` with `loadEnv` and added a Vite reverse proxy so all PostHog requests route through `/ingest`, improving ad-blocker resilience.
- **`src/routes/__root.tsx`** — Added `PostHogProvider` from `posthog-js/react` wrapping the entire app with environment-variable-driven `apiKey` and `options`, including `capture_exceptions: true` for automatic error tracking and session replay.
- **`src/routes/login.tsx`** — Captures `user_logged_in` with `posthog.identify()` on login, and `user_logged_out` with `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`** — Captures `invoice_created` when the new invoice form is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Captures `invoice_updated` with invoice ID and title when the save form is submitted.
- **`src/routes/_auth.profile.tsx`** — Captures `upgrade_plan_clicked` when the Upgrade button is clicked on the Account Settings page.
- **`src/routes/index.tsx`** — Captures `get_started_clicked` when the "Go to Dashboard" CTA is clicked on the home page.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (added to `.gitignore`).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. Includes `posthog.identify()` to associate the session with the username. | `src/routes/login.tsx` |
| `user_logged_out` | User logs out. Calls `posthog.reset()` to clear the identity. | `src/routes/login.tsx` |
| `invoice_created` | User submits the create invoice form. Key conversion event in the invoicing funnel. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. Indicates active usage. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks Upgrade on the Account Settings page. Top-of-funnel upsell event. | `src/routes/_auth.profile.tsx` |
| `get_started_clicked` | User clicks "Go to Dashboard" on the home page. Entry point for the conversion funnel. | `src/routes/index.tsx` |

## Next steps

To view and analyze these events, visit your PostHog project:

- **Project overview**: https://us.posthog.com/project/238460
- **Events activity**: https://us.posthog.com/project/238460/activity/explore
- **Create "Analytics basics" dashboard**: https://us.posthog.com/project/238460/dashboard/new

Suggested insights to add to your dashboard:

1. **Login conversion funnel** — Funnel: `get_started_clicked` → `user_logged_in`
2. **Invoice creation trend** — Trend: `invoice_created` over time
3. **Upgrade click rate** — Trend: `upgrade_plan_clicked` over time
4. **Active users** — Unique users who triggered `user_logged_in` per week
5. **Invoice engagement** — Trend: `invoice_created` + `invoice_updated` stacked over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
