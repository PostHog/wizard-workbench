<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your **CloudFlow** React + TanStack Router (code-based) application. Here's a summary of all changes made:

## Changes made

### 1. Package installation
- Installed `posthog-js` and `@posthog/react` via pnpm

### 2. Environment variables (`.env`)
- Added `VITE_PUBLIC_POSTHOG_KEY` — your PostHog project API key
- Added `VITE_PUBLIC_POSTHOG_HOST` — PostHog ingest host (`https://us.i.posthog.com`)
- The `.env` file is covered by `.gitignore` to prevent accidental key exposure

### 3. `vite.config.js` — Reverse proxy for PostHog ingestion
- Added a Vite dev-server proxy routing `/ingest` → PostHog host
- This avoids ad-blocker interference by routing PostHog events through your own domain

### 4. `tsconfig.json` — TypeScript fix
- Added `"types": ["vite/client"]` to resolve `import.meta.env` TypeScript errors

### 5. `src/main.tsx` — PostHog provider + event tracking
- Wrapped `RootComponent` with `<PostHogProvider>` using the env-var API key and reverse proxy host
- Enabled `capture_exceptions: true` for automatic error tracking
- Added `posthog.identify()` on login with the user's username
- Added `posthog.reset()` on logout to clear the user identity

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to CloudFlow — fires `posthog.identify()` with username | `src/main.tsx` |
| `user_logged_out` | User signs out of CloudFlow — fires `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User creates a new invoice — includes `invoice_id`, `invoice_title` | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice — includes `invoice_id`, `invoice_title` | `src/main.tsx` |
| `invoice_viewed` | User views a specific invoice detail page — includes `invoice_id`, `invoice_title` | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on their account page — includes `current_plan`, `username` | `src/main.tsx` |
| `team_member_viewed` | User views a specific team member's profile — includes `team_member_id`, `team_member_name`, `team_member_email` | `src/main.tsx` |
| `dashboard_viewed` | User views the dashboard overview — includes `total_invoices`, `total_revenue`, `paid_count`, `pending_count` | `src/main.tsx` |

## Next steps

To create an "Analytics basics" dashboard with insights in PostHog, you'll need a Personal API Key with `dashboard:write` and `insight:write` scopes. You can create one at:

**https://us.posthog.com/settings/user-api-keys**

Once you have a key with the required scopes, we recommend creating these 5 insights:

1. **User Logins Over Time** — Trends chart for `user_logged_in` to monitor daily active users
2. **Invoice Conversion Funnel** — Funnel: `dashboard_viewed` → `invoice_viewed` → `invoice_created` to track invoice creation rate
3. **Upgrade Button Clicks** — Trends chart for `upgrade_plan_clicked` to track conversion intent
4. **Invoice Activity** — Multi-series trends for `invoice_created` + `invoice_updated` to monitor invoice volume
5. **User Logout Events** — Trends chart for `user_logged_out` to monitor churn signals

You can explore your events at: **https://us.posthog.com/project/238460/events**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
