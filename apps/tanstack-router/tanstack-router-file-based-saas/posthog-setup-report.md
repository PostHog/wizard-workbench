<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application built with React and TanStack Router (file-based routing).

## Changes made

- **`package.json`** — Added `posthog-js` and `@posthog/react` dependencies.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` to resolve `import.meta.env` TypeScript types.
- **`vite.config.js`** — Configured a reverse proxy so PostHog ingestion calls route through `/ingest` instead of directly to posthog.com, reducing ad-blocker interference.
- **`src/routes/__root.tsx`** — Wrapped the root layout in `PostHogProvider` with session replay, exception capture, and debug mode enabled in development.
- **`src/routes/login.tsx`** — Added `posthog.identify()` on login (using username as distinct ID), `user_logged_in` capture on form submit, `user_logged_out` capture + `posthog.reset()` on sign-out.
- **`src/routes/dashboard.invoices.index.tsx`** — Added `invoice_created` capture when the create-invoice form is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** — Added `invoice_viewed` capture when an invoice detail page mounts, and `invoice_updated` capture when the save-changes form is submitted.
- **`src/routes/_auth.profile.tsx`** — Added `upgrade_clicked` capture when the Upgrade button is clicked.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to the app | `src/routes/login.tsx` |
| `user_logged_out` | User signs out of the app | `src/routes/login.tsx` |
| `invoice_created` | User submits the form to create a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page (top of update funnel) | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/subscription page | `src/routes/_auth.profile.tsx` |

## Next steps

To visualise your new events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login trend** — Line chart of `user_logged_in` over time. Shows user growth and engagement.
2. **Invoice creation funnel** — Funnel from `invoice_viewed` → `invoice_updated`. Shows how many users who view an invoice also save changes.
3. **Invoice creation volume** — Trend chart of `invoice_created` over time. Core business activity metric.
4. **Upgrade intent** — `upgrade_clicked` count over time. Early signal of paid conversion intent.
5. **Churn signal** — Ratio of `user_logged_out` to `user_logged_in` over time. High ratio may indicate retention issues.

Visit your PostHog project at [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to build these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
