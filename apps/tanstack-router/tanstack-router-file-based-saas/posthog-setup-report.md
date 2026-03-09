<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this React TanStack Router (file-based routing) application. The following changes were made:

- **Installed `posthog-js`** as a project dependency
- **Added `PostHogProvider`** to `src/routes/__root.tsx` — wraps the entire app so all routes have access to the PostHog client. Configured with a reverse proxy (`/ingest`) for improved reliability and ad-blocker bypass.
- **Added reverse proxy** to `vite.config.js` — proxies `/ingest` requests to `https://us.i.posthog.com`, forwarding PostHog events through the app server.
- **Added `src/vite-env.d.ts`** — provides TypeScript types for `import.meta.env` Vite environment variables.
- **Set up `.env`** — `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` are set via environment variables (never hardcoded).
- **Instrumented 5 key business events** across 4 files (see table below).
- **Added user identification** on sign-in using `posthog.identify()` with the username as the distinct ID.
- **Added `posthog.reset()`** on sign-out to disconnect the session from the identified user.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user submits the login form and signs in | `src/routes/login.tsx` |
| `user_signed_out` | Fired when a user clicks the Sign Out button | `src/routes/login.tsx` |
| `invoice_created` | Fired when a user successfully creates a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on their profile page | `src/routes/_auth.profile.tsx` |

## Next steps

To explore your data, visit your PostHog project:

- [PostHog Project](https://us.posthog.com/project/2)
- [Create an "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new) with these suggested insights:
  - **Daily Sign-ins** — Trend of `user_signed_in` over time
  - **Sign-out Rate** — Trend of `user_signed_out` over time
  - **Invoice Creation Funnel** — Funnel: `user_signed_in` → `invoice_created`
  - **Invoice Update Activity** — Trend of `invoice_updated` over time
  - **Upgrade Conversion** — Users who clicked `upgrade_clicked` after signing in

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
