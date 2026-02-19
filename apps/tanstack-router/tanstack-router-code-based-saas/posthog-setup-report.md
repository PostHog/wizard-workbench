<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **CloudFlow** SaaS application — a React + TanStack Router (code-based routing) app featuring invoice management, team member browsing, and user authentication.

## Summary of changes

- **`package.json` / `pnpm-lock.yaml`**: Added `posthog-js` and `@posthog/react` as dependencies.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables (`.gitignore` coverage ensured).
- **`vite.config.js`**: Converted to a function-style config using `loadEnv`, added a `/ingest` reverse proxy so PostHog requests route through the app's own domain rather than directly to PostHog servers.
- **`tsconfig.json`**: Added `"types": ["vite/client"]` to enable `import.meta.env` typings.
- **`src/main.tsx`**:
  - Imported `PostHogProvider` and `usePostHog` from `@posthog/react`.
  - Wrapped `RootComponent` JSX with `<PostHogProvider>` (initialised with env vars, `/ingest` proxy, exception capture, and debug mode in dev).
  - Added `posthog.identify()` + `user_signed_in` capture on login form submit in `LoginComponent`.
  - Added `user_signed_out` + `posthog.reset()` on both logout buttons (login page and profile page).
  - Added `invoice_created` capture in `InvoicesIndexComponent`'s `onSuccess` callback.
  - Added `invoice_updated` capture in `InvoiceComponent`'s `onSuccess` callback.
  - Added `invoice_viewed` capture via `useEffect` when `InvoiceComponent` mounts / changes invoice.
  - Added `team_member_viewed` capture via `useEffect` when `UserComponent` mounts / changes user.
  - Added `upgrade_clicked` capture on the Upgrade button in `ProfileComponent`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully signs in; also calls `posthog.identify()` | `src/main.tsx` |
| `user_signed_out` | Fired when a user signs out (both sign-out buttons); also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | Fired after a new invoice is successfully created | `src/main.tsx` |
| `invoice_updated` | Fired after changes to an existing invoice are saved | `src/main.tsx` |
| `invoice_viewed` | Fired when a user opens an invoice detail page | `src/main.tsx` |
| `team_member_viewed` | Fired when a user views a team member's profile | `src/main.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on the account/profile page | `src/main.tsx` |

## Next steps

We've configured the events above to feed into PostHog. You can now build insights and a dashboard in PostHog using these events. Here are suggested insights to create:

- **[Sign-ins over time](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_in%22%7D%5D)** — trend of `user_signed_in` events
- **[Invoice creation funnel](https://us.posthog.com/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22invoice_viewed%22%7D%2C%7B%22id%22%3A%22invoice_created%22%7D%5D)** — funnel from `invoice_viewed` → `invoice_created`
- **[Invoice activity](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22invoice_created%22%7D%2C%7B%22id%22%3A%22invoice_updated%22%7D%5D)** — trend of `invoice_created` and `invoice_updated`
- **[Upgrade clicks](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22upgrade_clicked%22%7D%5D)** — conversion metric for paid plan acquisition
- **[Team member views](https://us.posthog.com/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22team_member_viewed%22%7D%5D)** — engagement with the team directory

To create a dashboard, visit: **[https://us.posthog.com/dashboard/new](https://us.posthog.com/dashboard/new)**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
