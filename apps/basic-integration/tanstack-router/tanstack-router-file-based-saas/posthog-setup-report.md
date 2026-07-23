<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **`vite.config.js`**: Converted to a factory function and added a reverse-proxy for `/ingest` routes, routing PostHog API calls through the Vite dev server to avoid ad-blocker interference.
- **`src/vite-env.d.ts`**: Created to declare Vite's `import.meta.env` types for TypeScript.
- **`src/routes/__root.tsx`**: Wrapped the entire app with `PostHogProvider` from `@posthog/react`, wiring in the project token and host from environment variables with a dev-only warning when the token is missing.
- **`src/hooks/useMutation.tsx`**: Added `onError` callback support to the mutation hook so error events can be captured without `useEffect`.
- **`src/routes/login.tsx`**: Added `posthog.identify()` on login, `posthog.capture('user_signed_in')` on form submit, and `posthog.capture('user_signed_out')` + `posthog.reset()` on logout.
- **`src/routes/dashboard.index.tsx`**: Captures `dashboard_viewed` when the main dashboard mounts (top of business funnel).
- **`src/routes/dashboard.invoices.index.tsx`**: Captures `invoice_created` on success and `invoice_create_failed` on error.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`**: Captures `invoice_viewed` on mount, `invoice_updated` on success, and `invoice_update_failed` on error.
- **`src/routes/_auth.profile.tsx`**: Captures `upgrade_plan_clicked` when the Upgrade button is clicked.
- **`src/routes/dashboard.users.route.tsx`**: Captures `team_member_sorted` when the sort order dropdown changes.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User submits the login form and successfully signs in | src/routes/login.tsx |
| `user_signed_out` | User clicks the Sign Out button while logged in | src/routes/login.tsx |
| `invoice_created` | User successfully creates a new invoice | src/routes/dashboard.invoices.index.tsx |
| `invoice_create_failed` | Invoice creation fails due to a validation or server error | src/routes/dashboard.invoices.index.tsx |
| `invoice_updated` | User successfully saves changes to an existing invoice | src/routes/dashboard.invoices.$invoiceId.tsx |
| `invoice_update_failed` | Invoice update fails due to a validation or server error | src/routes/dashboard.invoices.$invoiceId.tsx |
| `invoice_viewed` | User opens an invoice detail page, marking the start of the edit funnel | src/routes/dashboard.invoices.$invoiceId.tsx |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account profile page | src/routes/_auth.profile.tsx |
| `dashboard_viewed` | User views the main dashboard overview, the top of the business performance funnel | src/routes/dashboard.index.tsx |
| `team_member_sorted` | User changes the sort order of the team members list | src/routes/dashboard.users.route.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1897613)
- [Invoice creation funnel (wizard)](https://us.i.posthog.com/project/483112/insights/6pqMgc1f)
- [Upgrade plan clicks (wizard)](https://us.i.posthog.com/project/483112/insights/OBPKRV5X)
- [Invoice errors (wizard)](https://us.i.posthog.com/project/483112/insights/WR8MSlv2)
- [Daily sign-ins (wizard)](https://us.i.posthog.com/project/483112/insights/DcFrboIX)
- [Invoices created per day (wizard)](https://us.i.posthog.com/project/483112/insights/W3ICkJ4z)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
