<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) SaaS application. The following changes were made:

- **`vite.config.js`**: Converted to a factory function and added a Vite reverse-proxy configuration that routes `/ingest/*` calls to the PostHog ingestion API and `/ingest/static` + `/ingest/array` to the PostHog assets CDN. This avoids ad-blocker interference in development.
- **`tsconfig.json`**: Added `"types": ["vite/client"]` so `import.meta.env` resolves correctly in TypeScript.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/routes/__root.tsx`**: Wrapped the entire app in `<PostHogProvider>` using `@posthog/react`. The provider reads keys from environment variables and routes ingestion through the reverse proxy (`/ingest`). Exception capture (`capture_exceptions: true`) is enabled for automatic error tracking.
- **`src/routes/login.tsx`**: Added `posthog.identify(username)` and `posthog.capture('user_signed_in')` on login, and `posthog.capture('user_signed_out')` + `posthog.reset()` on logout.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Added `invoice_viewed` on mount, `invoice_saved` / `invoice_save_failed` on form submit, and `invoice_notes_toggled` when the notes section is opened/closed.
- **`src/routes/_auth.profile.tsx`**: Added `upgrade_plan_clicked` when the Upgrade button is pressed.
- **`src/routes/dashboard.users.user.tsx`**: Added `user_profile_viewed` on mount with viewed user ID and role.
- **`src/routes/dashboard.users.route.tsx`**: Added `users_sorted` when the sort control changes.
- **`src/routes/dashboard.index.tsx`**: Added `dashboard_viewed` on mount with invoice summary metrics.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to the application. | `src/routes/login.tsx` |
| `user_signed_out` | User signed out of the application. | `src/routes/login.tsx` |
| `invoice_viewed` | User opened a specific invoice detail page. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_saved` | User submitted the invoice edit form to save changes. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_save_failed` | Invoice save mutation returned an error. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggled the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on the profile subscription section. | `src/routes/_auth.profile.tsx` |
| `user_profile_viewed` | Authenticated user viewed a team member's profile page. | `src/routes/dashboard.users.user.tsx` |
| `users_sorted` | User changed the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `dashboard_viewed` | User landed on the main dashboard overview page. | `src/routes/dashboard.index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824662)
- **Insight**: [Sign-ins over time](https://us.posthog.com/project/483112/insights/KizV64KY)
- **Insight**: [Sign-in to Invoice funnel](https://us.posthog.com/project/483112/insights/LWvDRLD9)
- **Insight**: [Upgrade plan click rate](https://us.posthog.com/project/483112/insights/wEI1Rb0c)
- **Insight**: [Invoice save success vs failure](https://us.posthog.com/project/483112/insights/LmrRIZKN)
- **Insight**: [Active users by action](https://us.posthog.com/project/483112/insights/RkRy1hns)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
