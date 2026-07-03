<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this CloudFlow SaaS application (React + TanStack Router, file-based routing). PostHog is initialized via `PostHogProvider` in the root route (`__root.tsx`), with a Vite reverse proxy configured so analytics traffic routes through `/ingest` rather than hitting PostHog directly. Environment variables are stored in `.env` and referenced via `import.meta.env`. Eight key business events are instrumented across five route files, covering user authentication, invoice lifecycle actions, team management interactions, and the critical SaaS upgrade conversion signal. Users are identified in PostHog on login using `posthog.identify()` with their username as the distinct ID, and `posthog.reset()` is called on logout to clear the identity.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully submitted the login form. | `src/routes/login.tsx` |
| `user_signed_out` | User clicked the Sign Out button while logged in. | `src/routes/login.tsx` |
| `invoice_created` | User submitted the create invoice form successfully. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saved changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_viewed` | User opened an individual invoice detail page. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggled the internal notes panel on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicked the Upgrade button on the account/profile page. | `src/routes/_auth.profile.tsx` |
| `team_member_sorted` | User changed the sort order for the team members list. | `src/routes/dashboard.users.route.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793572)
- [User Sign-ins](https://us.posthog.com/project/483112/insights/EyYYmtbf) — Daily sign-in and sign-out trend
- [Upgrade Button Clicks](https://us.posthog.com/project/483112/insights/RK4KAdXK) — Total upgrade intent signals (last 30 days)
- [Invoice Activity](https://us.posthog.com/project/483112/insights/m7AukUiX) — Invoice views, creates, and updates over time
- [Sign-in to Invoice Creation Funnel](https://us.posthog.com/project/483112/insights/1rEWpmvy) — Conversion funnel from sign-in → invoice view → invoice created
- [Unique Active Users](https://us.posthog.com/project/483112/insights/yp0igXUR) — Daily unique users who signed in (area chart)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on the login form submit, so returning users who are already logged in will browse on anonymous distinct IDs until they log out and back in. Consider calling `identify` in the root route whenever `auth.status === 'loggedIn'` and `auth.username` is set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
