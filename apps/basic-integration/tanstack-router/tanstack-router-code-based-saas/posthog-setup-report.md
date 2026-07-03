<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloudFlow, a React + TanStack Router (code-based) SaaS application. The following changes were made:

- **`@posthog/react`** was installed as a dependency.
- **`.env`** was created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`vite.config.js`** was updated to use `defineConfig` with `loadEnv` and a PostHog reverse proxy (`/ingest` → PostHog ingestion host, `/ingest/static` and `/ingest/array` → assets host).
- **`tsconfig.json`** was updated to add `"types": ["vite/client"]` so `import.meta.env` resolves correctly.
- **`src/main.tsx`** was updated with:
  - `PostHogProvider` wrapping `RootComponent` (the root of the code-based route tree), initializing PostHog with the reverse proxy, exception capture, and debug mode in dev.
  - `posthog.identify()` called in `LoginComponent.onSubmit` to associate the username as the distinct ID on login.
  - `posthog.capture('user_logged_in')` on login form submit.
  - `posthog.capture('user_logged_out')` + `posthog.reset()` on sign-out from both the profile page and the login page.
  - `posthog.capture('invoice_created')` in the `onSuccess` callback of the create-invoice mutation.
  - `posthog.capture('invoice_updated')` in the `onSuccess` callback of the update-invoice mutation.
  - `posthog.capture('upgrade_plan_clicked')` on the Upgrade button in the profile page.
  - `posthog.capture('invoice_notes_toggled')` on the Add Notes / Hide Notes link in the invoice detail view.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User submits the login form and is authenticated into CloudFlow. | `src/main.tsx` |
| `user_logged_out` | User clicks sign out from the profile page or login page. | `src/main.tsx` |
| `invoice_created` | User submits the create invoice form to generate a new invoice. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice via the invoice detail form. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the account settings page. | `src/main.tsx` |
| `invoice_notes_toggled` | User toggles the internal notes section open or closed on an invoice. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793562)
- [Daily User Logins](https://us.posthog.com/project/483112/insights/f5DTSwv2)
- [Invoice Activity](https://us.posthog.com/project/483112/insights/6TbJc3iI)
- [Upgrade Plan Clicks](https://us.posthog.com/project/483112/insights/CUbTUteG)
- [User Logouts / Churn Signal](https://us.posthog.com/project/483112/insights/57xtxu0p)
- [Logins vs Logouts](https://us.posthog.com/project/483112/insights/qvqHwNoD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
