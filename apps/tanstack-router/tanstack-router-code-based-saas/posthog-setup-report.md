<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React + TanStack Router (code-based) project. Here's a summary of all changes made:

- **`package.json`**: Added `posthog-js` and `@posthog/react` as dependencies.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/vite-env.d.ts`**: Created to provide Vite `import.meta.env` TypeScript types.
- **`vite.config.js`**: Added a reverse proxy for `/ingest` → PostHog host, routing analytics traffic through the dev server to avoid ad-blocker interference.
- **`src/main.tsx`**: Wrapped `RootComponent` with `PostHogProvider` for SDK initialization; added `usePostHog()` hook and event tracking to `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, and `InvoiceComponent`.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and authenticates; also calls `posthog.identify()` | `src/main.tsx` |
| `user_signed_out` | User clicks Sign Out (from profile page or login page); also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User submits the create invoice form with a title | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account/profile page | `src/main.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these insights:

- **Sign-in funnel** — Trend of `user_signed_in` over time to track active users
- **Upgrade conversion** — `upgrade_plan_clicked` events, ideally as a funnel from `user_signed_in` → `upgrade_plan_clicked`
- **Invoice activity** — Trend of `invoice_created` and `invoice_updated` to track core product usage
- **Churn signal** — `user_signed_out` events over time to identify potential churn patterns
- **User retention** — Stickiness of users by correlating `user_signed_in` across cohorts

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
