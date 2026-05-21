<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your TanStack Router (code-based) React application.

## Summary of changes

- **`src/main.tsx`** — Added `PostHogProvider` wrapping `RootComponent` with reverse-proxy ingestion, exception capture, and debug mode. Added `usePostHog()` calls and event captures across five components.
- **`vite.config.js`** — Added Vite reverse-proxy rules for `/ingest/static`, `/ingest/array`, and `/ingest` to route PostHog traffic through the local dev server, avoiding ad-blocker interference.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/vite-env.d.ts`** — Added Vite client type reference so `import.meta.env` types resolve correctly.

## Event tracking

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in via the login form. Also calls `posthog.identify()` with the username. | `src/main.tsx` — `LoginComponent` |
| `user_logged_out` | Fired when a user clicks Sign Out. Also calls `posthog.reset()` to clear the identity. | `src/main.tsx` — `LoginComponent` + `ProfileComponent` |
| `invoice_created` | Fired when a new invoice is successfully created, with `invoice_id` and `invoice_title` properties. | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | Fired when an existing invoice is successfully saved, with `invoice_id` and `invoice_title` properties. | `src/main.tsx` — `InvoiceComponent` |
| `user_profile_viewed` | Fired when a user profile detail page is viewed (top of user engagement funnel), with `user_id` and `user_name`. | `src/main.tsx` — `UserComponent` |

## Next steps

We've prepared an "Analytics basics" dashboard for you. Because this environment uses a read-only API key, use these links to create and save each insight in PostHog, then add them to a new dashboard named **Analytics basics**:

- [New Trends insight — User Logins Over Time](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — Add event `user_logged_in`, breakout by day, unique users
- [New Trends insight — Invoice Creation Trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — Add event `invoice_created`, total count over time
- [New Trends insight — Invoice Updates Trend](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — Add event `invoice_updated`, total count over time
- [New Funnel — Login to Invoice Creation](https://us.posthog.com/project/2/insights/new?insight=FUNNELS) — Steps: `user_logged_in` → `invoice_created`; shows what % of logins result in invoice creation
- [New Trends insight — User Churn (Logouts)](https://us.posthog.com/project/2/insights/new?insight=TRENDS) — Add event `user_logged_out`, track churn signal over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
