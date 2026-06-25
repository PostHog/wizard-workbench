<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Router (file-based) application. The following changes were made:

- **PostHog provider** (`src/routes/__root.tsx`): Added `PostHogProvider` from `@posthog/react` wrapping the entire app with automatic session recording, exception capture, and debug mode enabled in development.
- **Reverse proxy** (`vite.config.js`): Configured Vite proxy routes for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the app's own domain, improving ad-blocker resilience.
- **Environment variables** (`.env`): Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` — referenced via `import.meta.env` in code.
- **TypeScript support** (`src/vite-env.d.ts`): Added Vite client type reference so `import.meta.env` is correctly typed.
- **Login/logout & user identification** (`src/routes/login.tsx`): Calls `posthog.identify()` and captures `user_logged_in` on form submit; captures `user_logged_out` and calls `posthog.reset()` on sign-out.
- **Dashboard entry** (`src/routes/dashboard.index.tsx`): Captures `dashboard_viewed` on mount (funnel entry point).
- **Invoice creation** (`src/routes/dashboard.invoices.index.tsx`): Captures `invoice_created` on successful form submission.
- **Invoice detail** (`src/routes/dashboard.invoices.$invoiceId.tsx`): Captures `invoice_viewed` when an invoice is opened, `invoice_updated` on save success, and `invoice_notes_toggled` when the notes section is toggled.
- **Team member profile** (`src/routes/dashboard.users.user.tsx`): Captures `team_member_viewed` when a team member's detail page is opened.
- **Team sorting** (`src/routes/dashboard.users.route.tsx`): Captures `team_members_sorted` when the sort order is changed.
- **Upgrade intent** (`src/routes/_auth.profile.tsx`): Captures `upgrade_clicked` when the Upgrade button is clicked on the account page.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User submits the sign-in form to log into CloudFlow. | `src/routes/login.tsx` |
| `user_logged_out` | User clicks the Sign Out button to end their session. | `src/routes/login.tsx` |
| `dashboard_viewed` | User lands on the main dashboard overview page. | `src/routes/dashboard.index.tsx` |
| `invoice_created` | User successfully creates a new invoice from the invoices index page. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_viewed` | User opens the detail page for a specific invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | User opens the detail profile for a team member. | `src/routes/dashboard.users.user.tsx` |
| `team_members_sorted` | User changes the sort order of the team members list. | `src/routes/dashboard.users.route.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the account settings page. | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1760812)
- [Login to Invoice Creation Funnel](https://us.posthog.com/project/483112/insights/5duXBzD0)
- [Invoice Activity](https://us.posthog.com/project/483112/insights/mtLxOOxP)
- [User Logouts (Churn Signal)](https://us.posthog.com/project/483112/insights/X0GwOEGM)
- [Upgrade Button Clicks](https://us.posthog.com/project/483112/insights/lpIXjZxw)
- [Team Management Engagement](https://us.posthog.com/project/483112/insights/XUyxxy86)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
