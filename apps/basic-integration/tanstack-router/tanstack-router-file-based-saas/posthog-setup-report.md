<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application built with React and TanStack Router (file-based routing). The following changes were made:

- Installed `posthog-js` and `@posthog/react` packages via pnpm.
- Created `.env` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- Created `src/vite-env.d.ts` to provide Vite's `import.meta.env` type declarations.
- Updated `vite.config.js` to add a reverse proxy for PostHog ingestion (`/ingest/*` routes) — this improves ad-blocker resilience and keeps tracking data flowing.
- Updated `src/routes/__root.tsx` to wrap the app in `PostHogProvider`, initializing PostHog with the project token, `/ingest` proxy host, exception capture, and debug mode in development.
- Updated `src/routes/login.tsx` to call `posthog.identify()` and `posthog.capture('user_signed_in')` on login, and `posthog.capture('user_signed_out')` + `posthog.reset()` on logout.
- Updated `src/routes/dashboard.invoices.$invoiceId.tsx` to capture `invoice_updated` (with invoice ID and amount) on form submit, and `invoice_notes_toggled` (with action: show/hide) when toggling the notes section.
- Updated `src/routes/_auth.profile.tsx` to capture `upgrade_clicked` (with current plan) when the Upgrade button is clicked.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully submits the login form and authenticates. | `src/routes/login.tsx` |
| `user_signed_out` | User clicks the Sign Out button and logs out of the application. | `src/routes/login.tsx` |
| `invoice_updated` | User saves changes to an invoice's title or body. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User opens or closes the internal notes section on an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/account settings page. | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1825451)
- **Daily sign-ins**: [https://us.posthog.com/project/483112/insights/WAJBSFqD](https://us.posthog.com/project/483112/insights/WAJBSFqD)
- **Sign-in to upgrade funnel**: [https://us.posthog.com/project/483112/insights/Bl0bmlQZ](https://us.posthog.com/project/483112/insights/Bl0bmlQZ)
- **Invoice updates over time**: [https://us.posthog.com/project/483112/insights/xkkv4ySi](https://us.posthog.com/project/483112/insights/xkkv4ySi)
- **Upgrade clicks total**: [https://us.posthog.com/project/483112/insights/7Ay5YykL](https://us.posthog.com/project/483112/insights/7Ay5YykL)
- **Sign-outs over time**: [https://us.posthog.com/project/483112/insights/spO2Xp55](https://us.posthog.com/project/483112/insights/spO2Xp55)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on login; if a returning authenticated user refreshes the page without logging in again, they will be on an anonymous distinct ID until their next login.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
