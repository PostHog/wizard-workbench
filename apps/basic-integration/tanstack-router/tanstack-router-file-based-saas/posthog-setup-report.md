# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **CloudFlow** SaaS application. Here is a summary of what was changed:

- **Installed** `@posthog/react` and `posthog-js` packages.
- **Configured environment variables** in `.env` (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`).
- **Added a reverse proxy** in `vite.config.js` so PostHog requests are routed through `/ingest`, bypassing ad blockers.
- **Wrapped the root layout** in `src/routes/__root.tsx` with `PostHogProvider` (with `capture_exceptions: true` for automatic error tracking).
- **Added user identification** in `src/routes/login.tsx` — `posthog.identify()` is called on sign-in and `posthog.reset()` on sign-out.
- **Instrumented 8 events** across 5 route files covering the core product funnel, engagement actions, and revenue events.
- **Created `src/vite-env.d.ts`** to provide Vite type definitions for `import.meta.env`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submitted the login form and authenticated | `src/routes/login.tsx` |
| `user_signed_out` | User clicked the Sign Out button | `src/routes/login.tsx` |
| `dashboard_viewed` | User navigated to the dashboard overview (top of conversion funnel) | `src/routes/dashboard.index.tsx` |
| `invoice_viewed` | User opened an invoice detail page (funnel entry) | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saved changes to an invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggled the internal notes section on an invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | User clicked a team member to view their details | `src/routes/dashboard.users.route.tsx` |
| `upgrade_plan_clicked` | User clicked Upgrade on the subscription panel | `src/routes/_auth.profile.tsx` |

## Next steps

The PostHog MCP did not have the necessary scopes to create a dashboard automatically. You can create one manually using the links below:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

**Suggested insights for the dashboard:**

1. **Sign-ins over time** — Trends chart for `user_signed_in`, daily, last 30 days.
2. **Upgrade intent** — Trends chart for `upgrade_plan_clicked`, to monitor revenue funnel clicks.
3. **Invoice funnel** — Funnel insight with steps: `dashboard_viewed` → `invoice_viewed` → `invoice_updated`.
4. **User churn signal** — Trends chart for `user_signed_out`, to spot drop-off.
5. **Team engagement** — Trends chart for `team_member_viewed` and `invoice_notes_toggled` on a single chart.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on the login form submit. If users can be restored from a stored session (e.g. `localStorage`), call `posthog.identify` there too so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
