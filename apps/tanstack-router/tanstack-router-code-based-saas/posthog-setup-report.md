<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application (React + TanStack Router, code-based routing). The following changes were made:

1. **Installed packages**: `posthog-js` and `@posthog/react` were added to the project using pnpm.
2. **Environment variables**: `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` were written to `.env`.
3. **Vite proxy**: `vite.config.js` was updated to add a reverse proxy at `/ingest` routing PostHog traffic through the dev server (avoids ad-blocker issues).
4. **PostHog provider**: `PostHogProvider` from `@posthog/react` now wraps the entire app in `RootComponent` (in `src/main.tsx`), enabling session replay, exception capture, and analytics for all routes.
5. **User identification**: `posthog.identify()` is called with the username when a user signs in via the login form.
6. **Event tracking**: Five key business events are now captured across the app.
7. **Session cleanup**: `posthog.reset()` is called on sign-out to clear the identified user.
8. **TypeScript**: Added `"types": ["vite/client"]` to `tsconfig.json` to resolve `import.meta.env` type errors.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully completed the login form and signed in | `src/main.tsx` |
| `user_signed_out` | User clicked the Sign Out button from the profile page or login page | `src/main.tsx` |
| `invoice_created` | User submitted the create invoice form successfully | `src/main.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on their profile/account settings page | `src/main.tsx` |

## Next steps

We've set up the events above — now build some insights and a dashboard to keep an eye on user behavior:

**Suggested "Analytics basics" dashboard insights:**

1. **Sign-in trend** — Trends insight on `user_signed_in` over time (shows user activity volume)
2. **Invoice creation funnel** — Funnel: `user_signed_in` → `invoice_created` (measures conversion from login to creating a first invoice)
3. **Invoice activity** — Trends insight with both `invoice_created` and `invoice_updated` (measures invoice engagement)
4. **Churn signal** — Trends insight on `user_signed_out` (monitors sign-out patterns)
5. **Upgrade intent** — Trends insight on `upgrade_plan_clicked` (tracks monetization funnel top)

Create your dashboard at: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
