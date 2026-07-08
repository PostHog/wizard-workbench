# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this TanStack Router (code-based) React application (CloudFlow). Changes include:

- **Installed** `posthog-js` and `@posthog/react` packages.
- **Configured** a Vite reverse proxy for PostHog ingestion (`/ingest` → `us.i.posthog.com`).
- **Initialized** PostHog via `PostHogProvider` in `RootComponent` using environment variables. Session recording, autocapture, and exception capture are enabled by default.
- **Added** a `PostHogRouteTracker` component that fires `invoice_viewed` and `team_member_viewed` events on route navigation using TanStack Router's state.
- **Captured** business-critical events across invoice, auth, and upgrade flows.
- **Identified** users on login via `posthog.identify()` and reset on logout via `posthog.reset()`.
- **Added** `vite/client` types to `tsconfig.json` to support `import.meta.env` usage.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to CloudFlow. | `src/main.tsx` |
| `user_logged_out` | User signs out from CloudFlow. | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice. | `src/main.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice. | `src/main.tsx` |
| `invoice_viewed` | User opens an invoice detail page, marking the start of the invoice review funnel. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `team_member_viewed` | User opens a team member's profile page. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818330)
- [User sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/nGwKAeMa)
- [Invoice activity (wizard)](https://us.posthog.com/project/483112/insights/hlZeeyMg)
- [Invoice review conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/beBdjk60)
- [Upgrade plan clicks (wizard)](https://us.posthog.com/project/483112/insights/D1x2jIEP)
- [Login to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/G9GCbakS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
