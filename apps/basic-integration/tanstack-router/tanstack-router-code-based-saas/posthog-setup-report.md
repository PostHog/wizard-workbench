# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (code-based) SaaS application. Changes include: installing `posthog-js` and `@posthog/react`, wrapping the root route component with `PostHogProvider` (with a Vite reverse proxy so events route through `/ingest`), adding `posthog.identify()` on login and `posthog.reset()` on logout, and instrumenting eight user-action events across the key business flows — authentication, invoice lifecycle, subscription upgrade intent, and team management.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated via the login form. | `src/main.tsx` |
| `user_signed_out` | User clicked the sign out button to end their session. | `src/main.tsx` |
| `invoice_created` | User successfully submitted a new invoice. | `src/main.tsx` |
| `invoice_updated` | User saved changes to an existing invoice. | `src/main.tsx` |
| `upgrade_clicked` | User clicked the Upgrade plan button from account settings. | `src/main.tsx` |
| `team_members_sorted` | User changed the sort order of the team members list. | `src/main.tsx` |
| `invoice_notes_toggled` | User toggled the visibility of internal notes on an invoice. | `src/main.tsx` |
| `invoice_quick_link_clicked` | User clicked the View Invoice quick link from the home page. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901930)
- [Sign-in to Invoice Creation funnel (wizard)](https://us.posthog.com/project/483112/insights/EnTFqQPH)
- [Invoices created over time (wizard)](https://us.posthog.com/project/483112/insights/7pCbGGeQ)
- [Sign-in and sign-out activity (wizard)](https://us.posthog.com/project/483112/insights/4h4ZY7HE)
- [Upgrade button clicks (wizard)](https://us.posthog.com/project/483112/insights/o22rfeAr)
- [Invoice updates and notes activity (wizard)](https://us.posthog.com/project/483112/insights/yL15SYV1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current auth does not persist across page refreshes, so add persistence (e.g. `localStorage`) and re-identify on app load if needed to avoid returning sessions landing on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
