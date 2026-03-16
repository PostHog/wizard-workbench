<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Router (file-based) application. Here is a summary of all changes made:

- **`package.json`**: Added `posthog-js` as a dependency.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/vite-env.d.ts`**: Created with `/// <reference types="vite/client" />` to enable `import.meta.env` TypeScript support.
- **`vite.config.js`**: Added a reverse proxy for `/ingest` → PostHog host to prevent ad blockers from blocking analytics.
- **`src/routes/__root.tsx`**: Wrapped the root component with `PostHogProvider` (from `posthog-js/react`), initializing PostHog with the project token, reverse proxy host, exception capture, and debug mode in development.
- **`src/routes/login.tsx`**: Added `user_signed_in` event capture and `posthog.identify()` on login; added `user_signed_out` event capture and `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.index.tsx`**: Added `invoice_created` event capture when a new invoice form is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `invoice_updated` event capture when an existing invoice is saved.
- **`src/routes/_auth.profile.tsx`**: Added `upgrade_clicked` event capture when the Upgrade button is clicked.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signed in with their username | `src/routes/login.tsx` |
| `user_signed_out` | User signed out of their account | `src/routes/login.tsx` |
| `invoice_created` | User submitted the form to create a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicked the Upgrade button on the profile/account page | `src/routes/_auth.profile.tsx` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) with the following suggested insights:

1. **Sign-in funnel** — Conversion funnel from `user_signed_in` → `invoice_created` to measure activation
2. **Invoice creation trend** — `invoice_created` event count over time
3. **Invoice update rate** — `invoice_updated` event count over time
4. **Upgrade intent** — `upgrade_clicked` event count over time (key churn/conversion signal)
5. **User retention** — Unique users who signed in per week

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
