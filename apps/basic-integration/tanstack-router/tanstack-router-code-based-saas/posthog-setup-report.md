<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this CloudFlow TanStack Router (code-based routing) application. Here is a summary of all changes made:

**Files modified:**
- `vite.config.js` — Converted to a function-based config that loads env vars, and added a reverse-proxy for PostHog ingestion (`/ingest`, `/ingest/static`, `/ingest/array`) so analytics calls go through the same origin.
- `src/main.tsx` — Added `PostHogProvider` wrapping the entire app inside `RootComponent`, along with `posthog.identify()` on login and seven `posthog.capture()` calls across the app.
- `tsconfig.json` — Added `"types": ["vite/client"]` so `import.meta.env` resolves correctly in TypeScript.
- `.env` — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` values.

**Packages added:** `posthog-js`, `@posthog/react`

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submits the login form and signs in to CloudFlow. Includes `posthog.identify()` to associate future events with the user. | `src/main.tsx` |
| `user_logged_out` | User signs out (from profile page or login page). Calls `posthog.reset()` to clear the identified user. | `src/main.tsx` |
| `invoice_created` | User successfully submits the create invoice form and a new invoice is saved. Properties: `invoice_id`, `invoice_title`. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. Properties: `invoice_id`, `invoice_title`. | `src/main.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page — top of the invoice edit conversion funnel. Properties: `invoice_id`, `invoice_title`. | `src/main.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the account/profile page. Properties: `current_plan`. | `src/main.tsx` |
| `team_member_viewed` | User selects and views a specific team member profile. Properties: `member_id`, `member_name`. | `src/main.tsx` |

## Next steps

The PostHog API key used for this session did not have the `insight:write`, `dashboard:write`, or `query:read` scopes required to auto-create a dashboard. To set up an **"Analytics basics"** dashboard in PostHog manually, create a dashboard at [/dashboard](https://us.posthog.com/project/2/dashboard) and add the following insights:

1. **Login trend** — Trends: `user_logged_in` over time. Shows daily active sign-ins.
2. **Logout/churn signal** — Trends: `user_logged_out` over time. Spikes may indicate session issues or churn.
3. **Invoice creation funnel** — Funnel: `invoice_viewed` → `invoice_updated` → `invoice_created`. Shows drop-off in the invoice workflow.
4. **Upgrade intent** — Trends: `plan_upgrade_clicked` over time. Key conversion signal for free-to-paid.
5. **Team engagement** — Trends: `team_member_viewed` over time. Indicates collaborative usage.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
