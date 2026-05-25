<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based routing) SaaS application. The following changes were made:

- **posthog-js** and **@posthog/react** installed as dependencies
- **`.env`** created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST`
- **`vite.config.js`** updated to a function form that loads env vars and adds a `/ingest` reverse proxy for PostHog, routing `/ingest/static` and `/ingest/array` to the assets CDN host and `/ingest` to the ingestion host — all via environment variables, no hardcoded URLs
- **`tsconfig.json`** updated to include `vite/client` types so `import.meta.env` is typed correctly
- **`src/main.tsx`** instrumented with `PostHogProvider` at the root, user identification on login, `posthog.reset()` on logout, and five business-critical events across key user flows

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in; also calls `posthog.identify()` | `src/main.tsx` |
| `user_logged_out` | User signs out; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on their account page | `src/main.tsx` |

## Next steps

We've recommended the following insights for an **"Analytics basics"** dashboard in your PostHog project. Create these in [PostHog Insights](/insights):

1. **Sign-ins over time** — Trends chart of `user_logged_in` events, broken down by day
2. **Invoice creation funnel** — Funnel from `user_logged_in` → `invoice_created` to measure activation rate
3. **Invoice updates over time** — Trends chart of `invoice_updated`, showing engagement with invoice management
4. **Upgrade CTA clicks** — Trends chart of `upgrade_plan_clicked` to monitor upgrade intent
5. **Churn signal — logouts** — Trends chart of `user_logged_out` to track session end patterns

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
