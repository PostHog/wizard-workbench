<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **Installed packages**: `posthog-js` and `@posthog/react` via pnpm
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env`
- **Vite proxy**: `/ingest` proxy route added to `vite.config.js` so PostHog requests are routed through the dev server (avoids ad-blocker interference)
- **PostHogProvider**: Wrapped the root route component in `src/main.tsx` with `PostHogProvider` using environment variables, with `capture_exceptions: true` for automatic error tracking
- **User identification**: `posthog.identify()` called on login with username and properties
- **Event tracking**: Six business-critical events added across key user flows
- **TypeScript**: Added `src/vite-env.d.ts` with `vite/client` types reference to support `import.meta.env`

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in with a username | `src/main.tsx` — `LoginComponent.onSubmit` |
| `user_signed_out` | User signs out (from login page or profile page) | `src/main.tsx` — `LoginComponent` & `ProfileComponent` |
| `invoice_created` | User submits the create invoice form successfully | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` — `InvoiceComponent` |
| `upgrade_clicked` | User clicks the Upgrade button on the account page | `src/main.tsx` — `ProfileComponent` |
| `team_member_viewed` | User clicks to view a team member profile | `src/main.tsx` — `UsersLayoutComponent` |

## Next steps

Visit your PostHog project to build insights from these events. Recommended insights for an "Analytics basics" dashboard:

1. **Sign-in funnel** — Conversion from `user_signed_in` → `invoice_created` (how many users who sign in go on to create invoices)
2. **Invoice activity trend** — Daily/weekly count of `invoice_created` and `invoice_updated` events
3. **Churn signal** — Count of `user_signed_out` events over time, broken down by session length
4. **Upgrade intent** — Unique users who triggered `upgrade_clicked`
5. **Team engagement** — Count of `team_member_viewed` events per user

- **PostHog project**: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
