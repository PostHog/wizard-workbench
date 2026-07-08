<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Router (code-based) application. `posthog-js` and `@posthog/react` were installed, a `PostHogProvider` was added to the root route component wrapping the entire app, and a Vite reverse proxy was configured so all PostHog requests route through `/ingest`. User identification (`posthog.identify`) fires on login, and `posthog.reset()` fires on logout from both the profile page and the login page. Seven business-critical events are now tracked across the app, and a `src/vite-env.d.ts` file was added to provide TypeScript with Vite's `import.meta.env` types. Environment variables for the PostHog token and host are stored in `.env`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully signs in to CloudFlow | `src/main.tsx` |
| `user_logged_out` | User signs out of CloudFlow | `src/main.tsx` |
| `invoice_created` | User submits the form to create a new invoice | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account/profile page | `src/main.tsx` |
| `dashboard_viewed` | User views the dashboard overview — top of the conversion funnel | `src/main.tsx` |
| `invoice_notes_toggled` | User shows or hides the internal notes section on an invoice | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818327)
- [User logins over time](https://us.posthog.com/project/483112/insights/BPS3VsA8)
- [Login to invoice creation funnel](https://us.posthog.com/project/483112/insights/PjMdZzMt)
- [Upgrade plan clicks](https://us.posthog.com/project/483112/insights/DZ2tNTCX)
- [Invoice activity (created vs updated)](https://us.posthog.com/project/483112/insights/4fpxUWrg)
- [User churn — logouts vs logins](https://us.posthog.com/project/483112/insights/k35kIrri)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `posthog.identify` is only called on fresh login. If users can reload the page while logged in, add an `identify` call in the root component or route loader when `auth.status === 'loggedIn'`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
