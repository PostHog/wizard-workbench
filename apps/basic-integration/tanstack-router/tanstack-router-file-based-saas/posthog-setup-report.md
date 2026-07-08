# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (file-based) SaaS application. `posthog-js` and `@posthog/react` were installed, a reverse proxy was configured in `vite.config.js`, and `PostHogProvider` was added to the root route (`__root.tsx`). User identification (`posthog.identify`) fires on login with the username as the distinct ID, and `posthog.reset()` fires on logout. Ten business events are now tracked across six route files.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in to CloudFlow. | `src/routes/login.tsx` |
| `user_signed_out` | User logs out of CloudFlow. | `src/routes/login.tsx` |
| `invoice_viewed` | User opens an invoice detail page. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saves changes to an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User opens or closes the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | User clicks through to view a team member's detail page. | `src/routes/dashboard.users.user.tsx` |
| `team_member_search_performed` | User applies a search filter on the team members list. | `src/routes/dashboard.users.route.tsx` |
| `team_members_sorted` | User changes the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/account settings page. | `src/routes/_auth.profile.tsx` |
| `dashboard_cta_clicked` | User clicks a quick-action CTA on the dashboard overview. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818353)
- [Daily sign-ins](https://us.posthog.com/project/483112/insights/UdTfBiw0)
- [Login to invoice funnel](https://us.posthog.com/project/483112/insights/xBBVaEwy)
- [Upgrade button clicks](https://us.posthog.com/project/483112/insights/NE2l9SkB)
- [Invoice activity breakdown](https://us.posthog.com/project/483112/insights/vrNSJNL4)
- [Sign-in to upgrade funnel](https://us.posthog.com/project/483112/insights/fDRnlL66)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
