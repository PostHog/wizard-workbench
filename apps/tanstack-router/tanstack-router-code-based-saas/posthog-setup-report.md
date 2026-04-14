<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React TanStack Router (code-based) application.

**Summary of changes:**

- **`vite.config.js`** — Updated to a factory function with `loadEnv`, adding a `/ingest` reverse proxy that forwards PostHog requests through the dev server to avoid ad-blockers.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is fully typed.
- **`src/main.tsx`** — Wrapped `RootComponent` with `PostHogProvider` (initialised from environment variables with session replay and exception capture enabled). Added `usePostHog()` hooks and event captures across four components: `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, and `InvoiceComponent`.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`posthog-js`** and **`@posthog/react`** installed as dependencies.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in; also calls `posthog.identify()` with the username | `src/main.tsx` — `LoginComponent` |
| `user_logged_out` | User signs out; also calls `posthog.reset()` | `src/main.tsx` — `LoginComponent` and `ProfileComponent` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` — `InvoiceComponent` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the subscription page | `src/main.tsx` — `ProfileComponent` |

## Next steps

We were unable to create a PostHog dashboard automatically (the available API key does not have `dashboard:write` scope). You can create the **Analytics basics** dashboard manually in PostHog with the following recommended insights:

1. **Daily logins** — Trends chart for `user_logged_in` over time
2. **Login → Invoice creation funnel** — Funnel from `user_logged_in` → `invoice_created`
3. **Invoice activity** — Trends chart showing `invoice_created` and `invoice_updated` side by side
4. **Plan upgrade clicks** — Trends chart for `plan_upgrade_clicked`
5. **Churn signal** — Trends chart for `user_logged_out`

Visit your PostHog project to create these: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
