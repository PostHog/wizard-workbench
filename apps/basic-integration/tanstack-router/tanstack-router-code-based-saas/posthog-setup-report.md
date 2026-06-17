# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based) SaaS application. The following changes were made:

- **`src/main.tsx`** — Added `PostHogProvider` wrapping the full `RootComponent`, initializing PostHog via Vite environment variables with a `/ingest` reverse-proxy path. Added `usePostHog()` calls and `posthog.capture()` for all tracked events. Added `posthog.identify()` on sign-in and `posthog.reset()` on sign-out to correctly link anonymous and authenticated sessions.
- **`vite.config.js`** — Added reverse-proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog requests through the local dev server, avoiding ad-blocker interference.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is correctly typed.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and successfully signs in | `src/main.tsx` |
| `user_signed_out` | User clicks Sign Out (profile page or login page) | `src/main.tsx` |
| `invoice_created` | User submits the Create Invoice form | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the Account page | `src/main.tsx` |

## Next steps

The PostHog MCP dashboard-write tools were not available with the current API key scopes, so the dashboard was not created automatically. You can create the **"Analytics basics (wizard)"** dashboard manually:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [New insight](https://us.posthog.com/project/2/insights/new)

Suggested insights for the dashboard:

1. **Sign-ins over time** — Trends: `user_signed_in` count by day
2. **Invoice creation funnel** — Funnel: `user_signed_in` → `invoice_created`
3. **Upgrade intent** — Trends: `upgrade_plan_clicked` count by day
4. **Churn signal** — Trends: `user_signed_out` count by day
5. **Invoice update activity** — Trends: `invoice_updated` count by day

## Verify before merging

- [ ] Run a full production build (`pnpm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `LoginComponent` only identifies on fresh form submission. Users who return while already logged in (via `auth` state restored from session) will remain on anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
