<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. The following changes were made:

- **Package installation**: `posthog-js` and `@posthog/react` added as dependencies via pnpm.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env`.
- **Vite proxy**: `vite.config.js` updated to proxy `/ingest` requests to the PostHog host, avoiding ad-blockers.
- **PostHogProvider**: `RootComponent` in `src/main.tsx` now wraps the entire app with `PostHogProvider`, enabling `usePostHog()` in all child route components.
- **User identification**: On login, `posthog.identify(username)` is called so sessions are tied to a named user. On logout, `posthog.reset()` clears the identity.
- **Event tracking**: Four key business events are captured across the app.
- **Error tracking**: `capture_exceptions: true` is set in the PostHog options so unhandled exceptions are automatically reported.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user submits the login form | `src/main.tsx` – `LoginComponent.onSubmit` |
| `user_signed_out` | Fired when a logged-in user clicks Sign Out | `src/main.tsx` – `LoginComponent` sign-out button |
| `invoice_created` | Fired when a new invoice is successfully created | `src/main.tsx` – `InvoicesIndexComponent.useMutation.onSuccess` |
| `invoice_updated` | Fired when an existing invoice is successfully updated | `src/main.tsx` – `InvoiceComponent.useMutation.onSuccess` |

## Next steps

Use PostHog's Insights to monitor user behaviour using the events above. Suggested insights to create in your PostHog project:

- **Sign-ins over time** – Trends chart on `user_signed_in`
- **Invoices created over time** – Trends chart on `invoice_created`
- **Login → Invoice creation funnel** – Funnel: `user_signed_in` → `invoice_created`
- **Invoice update rate** – Trends: `invoice_updated` / `invoice_created`
- **Churn signal** – Trends chart on `user_signed_out`

You can build these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
