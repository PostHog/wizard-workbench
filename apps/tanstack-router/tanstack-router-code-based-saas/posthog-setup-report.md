<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React + TanStack Router (code-based routing) project, **CloudFlow**. The following changes were made:

- **`src/main.tsx`**: Added `PostHogProvider` wrapping the root component with reverse-proxy `api_host`, exception capture, and debug mode. Added `usePostHog` calls in `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, and `InvoiceComponent` to capture user and business events.
- **`vite.config.js`**: Added Vite dev-server proxy for `/ingest`, `/ingest/static`, and `/ingest/array` routes, routing PostHog traffic through the local dev server to avoid ad-blockers.
- **`tsconfig.json`**: Added `"types": ["vite/client"]` to support `import.meta.env` type inference.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`package.json`**: `@posthog/react` installed as a dependency.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and signs in; also calls `posthog.identify()` | `src/main.tsx` |
| `user_signed_out` | User clicks Sign Out (profile page or login page); also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User submits the new invoice form successfully | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice successfully | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page | `src/main.tsx` |

## Next steps

We've set up the events above. You can now build insights in PostHog to track business performance:

- [PostHog Project](https://us.posthog.com/project/2) — view your project
- **Suggested insights to build in your "Analytics basics" dashboard:**
  - **Sign-in funnel**: `user_signed_in` → `invoice_created` (conversion from login to first invoice)
  - **Churn signal**: `user_signed_out` trend over time
  - **Invoice activity**: `invoice_created` + `invoice_updated` event volume trend
  - **Upgrade intent**: `upgrade_plan_clicked` unique users over time
  - **User retention**: DAU/WAU based on `user_signed_in`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
