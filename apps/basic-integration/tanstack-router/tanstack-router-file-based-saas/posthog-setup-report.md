# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application (React + TanStack Router, file-based routing). Changes include:

- **SDK installed**: `posthog-js` and `@posthog/react` added as dependencies.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env`.
- **Reverse proxy**: Vite dev-server proxy added so all PostHog requests tunnel through `/ingest`, avoiding ad-blockers.
- **PostHogProvider**: Wraps the entire app in `src/routes/__root.tsx` with `capture_exceptions: true` for automatic error tracking.
- **Pageview tracking**: A `PostHogPageView` component fires `$pageview` on every route change using TanStack Router's `useRouterState`.
- **User identification**: `posthog.identify()` called with the username on sign-in; `posthog.reset()` called on sign-out.
- **9 business events** instrumented across 5 files (see table below).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and signs in | `src/routes/login.tsx` |
| `user_signed_out` | User clicks Sign Out | `src/routes/login.tsx` |
| `invoice_viewed` | User opens an invoice detail page | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User submits the invoice edit form | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User shows or hides invoice internal notes | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_searched` | User filters team member list | `src/routes/dashboard.users.route.tsx` |
| `team_member_sort_changed` | User changes team member sort order | `src/routes/dashboard.users.route.tsx` |
| `upgrade_plan_clicked` | User clicks Upgrade on the profile page | `src/routes/_auth.profile.tsx` |
| `dashboard_quick_action_clicked` | User clicks a quick action on the dashboard overview | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829362)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/GAcN1vUP) — bar chart of daily `user_signed_in` events
- [Invoice review-to-save funnel](https://us.posthog.com/project/483112/insights/z7oCduFY) — conversion from `invoice_viewed` → `invoice_updated`
- [Upgrade plan intent](https://us.posthog.com/project/483112/insights/gMwhAO77) — daily `upgrade_plan_clicked` trend
- [Invoice engagement overview](https://us.posthog.com/project/483112/insights/CrA6flCL) — `invoice_viewed` vs `invoice_updated` line chart
- [Sign-in to invoice funnel](https://us.posthog.com/project/483112/insights/fFCKHjce) — full journey: `user_signed_in` → `invoice_viewed` → `invoice_updated`

Dashboard subscriptions and alerts were not configured (the interactive prompt was unavailable). You can set up a weekly email digest and conversion-drop alerts directly from the [dashboard settings](https://us.posthog.com/project/483112/dashboard/1829362).

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login; users who reload while already logged in will remain on anonymous distinct IDs until they sign in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
