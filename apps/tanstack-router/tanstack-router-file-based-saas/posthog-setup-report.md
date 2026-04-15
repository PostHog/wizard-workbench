<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this CloudFlow TanStack Router (file-based) application. Here is a summary of all changes made:

- **`src/routes/__root.tsx`** — Wrapped the root component with `PostHogProvider` from `@posthog/react`, initializing PostHog with the project token and host from environment variables. Configured a reverse proxy path (`/ingest`) and enabled exception capture.
- **`vite.config.js`** — Added a Vite dev-server proxy to route `/ingest` traffic to the PostHog host. This avoids ad-blocker interference and improves data reliability.
- **`src/routes/login.tsx`** — Added `posthog.identify()` on sign-in to link the PostHog anonymous ID to the username. Added `posthog.capture('user_signed_in')` on form submit and `posthog.capture('user_signed_out')` + `posthog.reset()` on sign-out.
- **`src/routes/dashboard.index.tsx`** — Added `posthog.capture('dashboard_viewed')` when the dashboard mounts, capturing the invoice count as a property. This represents the top of the post-login conversion funnel.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `posthog.capture('invoice_created')` in the mutation's `onSuccess` callback, including the invoice ID and title as properties.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `posthog.capture('invoice_updated')` in the mutation's `onSuccess` callback, including the invoice ID and title.
- **`src/routes/_auth.profile.tsx`** — Added `posthog.capture('upgrade_clicked')` on the Upgrade button's `onClick` handler with `current_plan: 'free'` as a property.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` set to the correct values.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user successfully submits the sign-in form | `src/routes/login.tsx` |
| `user_signed_out` | Fired when a user clicks the Sign Out button | `src/routes/login.tsx` |
| `dashboard_viewed` | Fired when a user lands on the dashboard — top of conversion funnel after login | `src/routes/dashboard.index.tsx` |
| `invoice_created` | Fired when a user successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on their profile page | `src/routes/_auth.profile.tsx` |

## Next steps

Explore your data in PostHog and build insights around these events:

- **Sign-in trend** — [Trend: user_signed_in over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_in","type":"events"}])
- **Login → Dashboard → Upgrade funnel** — [Funnel: user_signed_in → dashboard_viewed → upgrade_clicked](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"user_signed_in"},{"id":"dashboard_viewed"},{"id":"upgrade_clicked"}])
- **Invoice creation trend** — [Trend: invoice_created over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"invoice_created","type":"events"}])
- **Churn signal — sign-outs** — [Trend: user_signed_out over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_out","type":"events"}])
- **Upgrade intent** — [Trend: upgrade_clicked over time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"upgrade_clicked","type":"events"}])
- **All dashboards** — [PostHog Dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
