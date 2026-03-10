<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React TanStack Router (code-based) SaaS application. Here's a summary of all changes made:

**`src/main.tsx`** — `PostHogProvider` was added to the root `RootComponent`, wrapping the entire app so all child routes have access to the PostHog client. The provider uses environment variables for the API key and host, and proxies events through `/ingest` to avoid ad-blockers. Six event tracking calls and user identification were added across four components:

- `LoginComponent`: calls `posthog.identify()` on login with the username, captures `user_logged_in`, and captures `user_logged_out` + `posthog.reset()` on sign-out.
- `ProfileComponent`: captures `user_logged_out` + `posthog.reset()` on sign-out, and `upgrade_plan_clicked` when the Upgrade button is clicked.
- `InvoicesIndexComponent`: captures `invoice_created` (with invoice ID and title) on successful invoice creation.
- `InvoiceComponent`: captures `invoice_updated` (with invoice ID and title) on successful invoice save.
- `UsersLayoutComponent`: captures `team_member_viewed` (with user ID, name, and role) when a team member link is clicked.

**`vite.config.js`** — Updated to use `defineConfig` with a function accepting `mode`, loading env vars, and adding a proxy rule that routes `/ingest` → `VITE_PUBLIC_POSTHOG_HOST` so PostHog events are proxied through the dev server.

**`tsconfig.json`** — Added `"types": ["vite/client"]` so TypeScript recognises `import.meta.env` for Vite environment variables.

**`.env`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` set to the provided values. Added to `.gitignore` automatically.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in via the login form | `src/main.tsx` |
| `user_logged_out` | Fired when a user signs out from the profile page or login page | `src/main.tsx` |
| `invoice_created` | Fired when a new invoice is successfully submitted via the Create Invoice form | `src/main.tsx` |
| `invoice_updated` | Fired when an existing invoice is successfully saved via the invoice detail form | `src/main.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the profile/account page | `src/main.tsx` |
| `team_member_viewed` | Fired when a user views a specific team member's profile | `src/main.tsx` |

## Next steps

We've instrumented all key business events. To set up your analytics dashboard in PostHog, navigate to your [PostHog project](https://us.posthog.com/project/2) and create insights based on the events above. Here are recommended insights to build for an "Analytics basics" dashboard:

1. **User Login Trend** — Trend of `user_logged_in` over time (daily/weekly active users)
2. **Invoice Activity** — Trend comparing `invoice_created` vs `invoice_updated`
3. **Login → Invoice Creation Funnel** — Funnel: `user_logged_in` → `invoice_created` (conversion rate)
4. **Upgrade Click Rate** — Total count of `upgrade_plan_clicked` (revenue intent signal)
5. **Churn Signal** — Trend of `user_logged_out` (users leaving the session)

You can create all of these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
