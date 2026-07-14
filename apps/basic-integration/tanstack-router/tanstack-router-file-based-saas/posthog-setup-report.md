# PostHog post-wizard report

The wizard has completed a deep integration of this TanStack Router React app with PostHog product analytics, session replay support, and client-side error capture. The integration adds `@posthog/react` and `posthog-js`, initializes PostHog with environment variables through a root-level `PostHogProvider`, configures the Vite `/ingest` proxy for local collection, and instruments key funnel and retention events across landing, login, invoice creation, invoice editing, team browsing, and upgrade intent flows. Verification completed successfully with `pnpm build`.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Tracks when a visitor clicks a primary call-to-action from the landing page. | `src/routes/index.tsx` |
| `login_submitted` | Tracks when a user submits the login form. | `src/routes/login.tsx` |
| `user_logged_in` | Tracks when a user successfully signs in and is identified. | `src/routes/login.tsx` |
| `user_logged_out` | Tracks when a signed-in user logs out. | `src/routes/login.tsx` |
| `invoice_create_submitted` | Tracks when a user submits a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_created` | Tracks when a new invoice is created successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_create_failed` | Tracks when invoice creation fails. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_update_submitted` | Tracks when a user saves changes to an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | Tracks when invoice changes are saved successfully. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_update_failed` | Tracks when saving invoice changes fails. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | Tracks when internal invoice notes are shown or hidden. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_filter_updated` | Tracks when a user updates the team member search filter. | `src/routes/dashboard.users.route.tsx` |
| `team_sort_changed` | Tracks when a user changes team sorting. | `src/routes/dashboard.users.route.tsx` |
| `team_member_selected` | Tracks when a user opens a team member profile. | `src/routes/dashboard.users.route.tsx` |
| `upgrade_cta_clicked` | Tracks when a user clicks the upgrade button from account settings. | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for ongoing monitoring:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846891)
- [Invoice creation volume (wizard)](https://us.posthog.com/project/483112/insights/bE63z3cu)
- [Invoice creation failure rate (wizard)](https://us.posthog.com/project/483112/insights/CNLd8Cyk)
- [Invoice edit outcomes (wizard)](https://us.posthog.com/project/483112/insights/2zF6rT8c)
- [Login to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/iPxQWDp0)
- [CTA engagement mix (wizard)](https://us.posthog.com/project/483112/insights/ojPjth7y)

A PostHog notebook copy could not be created because the available MCP credentials are missing `notebook:write` scope.

[DASHBOARD_URL] https://us.posthog.com/project/483112/dashboard/1846891

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap scripts so collaborators know what to set: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or bundler-based upload) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in `.claude/skills/integration-react-tanstack-router-file-based` for future agent-assisted PostHog work in this repository.
