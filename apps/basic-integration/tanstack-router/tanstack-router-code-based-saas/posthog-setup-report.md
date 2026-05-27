<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application. Here's a summary of what was added:

- **`@posthog/react`** was installed as a dependency.
- A **Vite reverse proxy** was configured in `vite.config.js` to route PostHog ingestion traffic through `/ingest`, keeping events from being blocked by ad-blockers.
- A **`.env`** file was created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- A **`src/vite-env.d.ts`** type reference file was added so `import.meta.env` resolves correctly in TypeScript.
- **`PostHogProvider`** was added to `RootComponent` in `src/main.tsx`, wrapping the entire app with `capture_exceptions: true` to enable automatic error tracking.
- **User identification** via `posthog.identify()` is called on login submission, and `posthog.reset()` is called on both logout handlers.
- **Six custom events** were instrumented across key user flows.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user submits the login form | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks Sign Out from any screen | `src/main.tsx` |
| `invoice_created` | Fired when the create invoice form is submitted | `src/main.tsx` |
| `invoice_updated` | Fired when invoice detail changes are saved | `src/main.tsx` |
| `invoice_notes_toggled` | Fired when a user shows or hides notes on an invoice | `src/main.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on their profile | `src/main.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login trend** — Trends chart for `user_logged_in` over time
2. **Invoice creation trend** — Trends chart for `invoice_created` over time
3. **Upgrade conversion funnel** — Funnel from `user_logged_in` → `upgrade_clicked`
4. **Invoice engagement funnel** — Funnel from `invoice_created` → `invoice_updated`
5. **User churn signal** — Trends chart for `user_logged_out` over time

You can create these at: [PostHog Dashboards](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
