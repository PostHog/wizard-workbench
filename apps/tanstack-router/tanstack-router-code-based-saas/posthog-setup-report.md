<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. The following changes were made:

- **`@posthog/react`** and **`posthog-js`** packages installed via pnpm
- **`PostHogProvider`** added to `RootComponent` in `src/main.tsx`, wrapping the entire app with PostHog session replay, exception capture, and a Vite reverse proxy for ingestion (`/ingest` → PostHog host)
- **User identification** via `posthog.identify()` on login in `LoginComponent`
- **`posthog.reset()`** called on all logout paths to clear the anonymous identity
- **Event capture** added for 7 business-critical events across invoice management, user management, and auth flows
- **`vite.config.js`** updated to use `loadEnv` and configure the `/ingest` reverse proxy
- **`tsconfig.json`** updated to include `vite/client` types for `import.meta.env`
- **`.env`** created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User submits login form and is authenticated; calls `posthog.identify()` | `src/main.tsx` |
| `user_logged_out` | User clicks Sign Out from Profile or Login page; calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `invoice_viewed` | User opens an individual invoice detail page (top of payment funnel) | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks Upgrade on the Account/Profile page | `src/main.tsx` |
| `team_member_viewed` | User views a team member's profile details | `src/main.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Login funnel** — Funnel from `user_logged_in` → `invoice_viewed` → `invoice_created` to see how many users reach key conversion points
2. **Invoice creation trend** — Trend of `invoice_created` over time to monitor business activity
3. **Upgrade intent** — Trend of `upgrade_plan_clicked` to identify revenue opportunities and churn risk
4. **Invoice update rate** — Ratio of `invoice_updated` to `invoice_viewed` to measure engagement with invoice details
5. **User retention** — Retention cohort based on `user_logged_in` returning to create or view invoices

Go to your PostHog project to create these insights: [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights)

Create the dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
