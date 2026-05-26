<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CloudFlow SaaS application built with React and TanStack Router (code-based routing).

**Changes made:**

- **`package.json`** — Added `posthog-js` and `@posthog/react` dependencies via pnpm.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSET_HOST`. Added to `.gitignore`.
- **`vite.config.js`** — Added reverse proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array` so PostHog requests route through the dev server, avoiding ad-blocker interference.
- **`tsconfig.json`** — Added `vite/client` to `types` so `import.meta.env` is properly typed.
- **`src/main.tsx`** — The main integration file. Changes include:
  - Wrapped `RootComponent` with `PostHogProvider` (initializes PostHog with session replay, error tracking, and the reverse proxy host).
  - `LoginComponent`: calls `posthog.identify()` and captures `user_logged_in` on form submit; captures `user_logged_out` + `posthog.reset()` on sign-out.
  - `ProfileComponent`: captures `user_logged_out` + `posthog.reset()` on sign-out; captures `upgrade_plan_clicked` on the Upgrade button.
  - `DashboardIndexComponent`: captures `dashboard_viewed` on mount (top of engagement funnel).
  - `InvoicesIndexComponent`: captures `invoice_created` with invoice id and title on successful mutation.
  - `InvoiceComponent`: captures `invoice_updated` with invoice id and title on successful mutation.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with a username | `src/main.tsx` |
| `user_logged_out` | User logs out from the account page or login page | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account/profile page | `src/main.tsx` |
| `dashboard_viewed` | User lands on the dashboard overview (top of engagement funnel) | `src/main.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Sign-ins over time** — Trends chart for `user_logged_in`, broken down by day.
2. **Invoice activity** — Trends chart with two series: `invoice_created` and `invoice_updated`.
3. **Upgrade conversion funnel** — Funnel: `dashboard_viewed` → `upgrade_plan_clicked`.
4. **Churn signal** — Trends chart for `user_logged_out` to monitor drop-off.
5. **Retention** — Retention insight using `user_logged_in` as the start event and `dashboard_viewed` as the return event.

Visit [PostHog Dashboards](/dashboard) to build these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
