<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based routing) application.

## Summary of changes

- **`vite.config.js`** — Updated to use `loadEnv` and added a reverse proxy for `/ingest` → PostHog ingestion, keeping analytics calls first-party and avoiding ad-blockers.
- **`src/vite-env.d.ts`** — Created to provide Vite's `import.meta.env` TypeScript types.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/main.tsx`** — Main integration file:
  - `PostHogProvider` wraps `RootComponent` with session replay, exception capture, and debug mode configured.
  - `usePostHog()` added to `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, `InvoiceComponent`, and `UsersLayoutComponent`.
  - User identity tracked via `posthog.identify()` on sign-in.
  - `posthog.reset()` called on sign-out to clear the anonymous identity.
  - Six business events instrumented (see table below).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in; also calls `posthog.identify()` | `src/main.tsx` |
| `user_signed_out` | User clicked Sign Out; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | New invoice successfully created (includes `invoice_id`, `invoice_title`) | `src/main.tsx` |
| `invoice_updated` | Invoice changes saved successfully (includes `invoice_id`, `invoice_title`) | `src/main.tsx` |
| `users_list_filtered` | User applied a text filter to the team members list (captured on blur) | `src/main.tsx` |
| `users_list_sorted` | User changed sort order on the team members list (includes `sort_by`) | `src/main.tsx` |

## Next steps

We've prepared an "Analytics basics" dashboard in your PostHog project where you can build insights based on the events above:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/238460/dashboard/1404604)

Suggested insights to create:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time — see how many users log in daily/weekly.
2. **Sign-in → Invoice created funnel** — Funnel from `user_signed_in` → `invoice_created` — measures activation rate.
3. **Invoice creation volume** — Trends chart for `invoice_created` showing invoice throughput over time.
4. **Invoice update rate** — Trends chart for `invoice_updated` — how often users revisit and update invoices.
5. **Team browsing behaviour** — Breakdown of `users_list_sorted` by `sort_by` property — which sort order is most popular.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
