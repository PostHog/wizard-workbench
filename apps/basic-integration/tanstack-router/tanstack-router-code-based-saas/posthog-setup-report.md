# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application. The following changes were made:

- **`src/main.tsx`** — Added `PostHogProvider` wrapping `RootComponent` (the root TanStack Router route). PostHog is configured with a Vite reverse proxy (`/ingest`) and exception capture enabled. Added `usePostHog()` hook calls and `posthog.capture()` / `posthog.identify()` / `posthog.reset()` calls across six route components.
- **`vite.config.js`** — Added proxy config routing `/ingest`, `/ingest/static`, and `/ingest/array` to the PostHog ingestion and assets hosts.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so TypeScript recognises `import.meta.env`.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully submits the login form. | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks the Sign Out button. | `src/main.tsx` |
| `invoice_created` | Fired when a new invoice is successfully submitted via the create invoice form. | `src/main.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice. | `src/main.tsx` |
| `invoice_viewed` | Fired when a user opens a specific invoice detail page. | `src/main.tsx` |
| `upgrade_plan_clicked` | Fired when the Upgrade button on the account/profile page is clicked. | `src/main.tsx` |
| `team_member_viewed` | Fired when a user opens a team member's profile. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1787529)
- Insight 1 — User Logins Over Time: https://us.i.posthog.com/project/483112/insights/Pbay4avw
- Insight 2 — Login to Invoice Creation Funnel: https://us.i.posthog.com/project/483112/insights/Q6QTcAeU
- Insight 3 — Invoices Created Over Time: https://us.i.posthog.com/project/483112/insights/myf50VAY
- Insight 4 — Upgrade Plan Clicks Over Time: https://us.i.posthog.com/project/483112/insights/c1c2Qxpr
- Insight 5 — User Login Retention: https://us.i.posthog.com/project/483112/insights/pGa7sQdS

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
