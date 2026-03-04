<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application (React + TanStack Router, code-based routing).

## Summary of changes

- **`vite.config.js`** — Updated to a function config that loads env vars and adds a `/ingest` reverse proxy to the PostHog host, preventing ad-blocker interference.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is recognized by TypeScript.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).
- **`src/main.tsx`** — The main integration file:
  - Imported `PostHogProvider` and `usePostHog` from `@posthog/react`.
  - Wrapped the entire app in `PostHogProvider` inside `RootComponent` (the code-based root route), enabling `capture_exceptions: true` for automatic error tracking.
  - Added `posthog.identify()` + `posthog.capture('user_signed_in')` in `LoginComponent.onSubmit`.
  - Added `posthog.capture('user_signed_out')` + `posthog.reset()` in both logout buttons (Profile page and Login page).
  - Added `posthog.capture('invoice_created')` in `InvoicesIndexComponent` mutation `onSuccess`.
  - Added `posthog.capture('invoice_updated')` in `InvoiceComponent` mutation `onSuccess`.
  - Added `posthog.capture('upgrade_plan_clicked')` on the Upgrade button in `ProfileComponent`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with their username | `src/main.tsx` |
| `user_signed_out` | User signs out from the profile page or login page | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/account settings page | `src/main.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in your PostHog project with these recommended insights:

1. **Sign-in trend** — Trends chart on `user_signed_in` over time (daily/weekly). Helps track user growth and engagement.
2. **Churn signal: Sign-outs** — Trends chart on `user_signed_out` to monitor churn signals.
3. **Invoice activity** — Trends chart comparing `invoice_created` and `invoice_updated` side by side.
4. **Upgrade conversion funnel** — Funnel: `user_signed_in` → `upgrade_plan_clicked`. Shows what % of sessions result in upgrade intent.
5. **Upgrade click count** — Total count of `upgrade_plan_clicked` events over time, broken down by user.

To create this dashboard, visit your [PostHog project](https://us.posthog.com/project/2/dashboards) and use the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
