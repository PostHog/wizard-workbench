# PostHog post-wizard report

The wizard has completed a full PostHog integration for the CloudFlow SaaS app. Changes include: installing `posthog-js` and `@posthog/react`, wrapping the root route in `PostHogProvider` (with a Vite reverse-proxy at `/ingest`), calling `posthog.identify()` on sign-in and `posthog.reset()` on sign-out, and adding `posthog.capture()` calls for all key business events across the invoice and auth flows. Error tracking via `posthog.captureException()` was added to invoice mutation failure paths. Environment variables (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) are stored in `.env` and referenced via `import.meta.env`. TypeScript was updated to include `vite/client` types.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form to sign in to CloudFlow. | `src/main.tsx` |
| `user_signed_out` | User clicks the sign out button on the profile or login page. | `src/main.tsx` |
| `invoice_created` | A new invoice is successfully created via the invoice creation form. | `src/main.tsx` |
| `invoice_creation_failed` | An attempt to create a new invoice resulted in an error. | `src/main.tsx` |
| `invoice_updated` | An existing invoice is successfully updated via the invoice edit form. | `src/main.tsx` |
| `invoice_update_failed` | An attempt to update an existing invoice resulted in an error. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the Account Settings page. | `src/main.tsx` |
| `invoice_notes_toggled` | User shows or hides the internal notes section on an invoice. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813115)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/DaxJFOyz)
- [Invoice activity (wizard)](https://us.posthog.com/project/483112/insights/phkOHfgD)
- [Sign-in to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/DmByN3Kn)
- [Invoice errors (wizard)](https://us.posthog.com/project/483112/insights/X1Vdh6qG)
- [Upgrade plan clicks (wizard)](https://us.posthog.com/project/483112/insights/j7K9snGa)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identify is only called on fresh login; if users reload while already authenticated, their session will use an anonymous distinct ID until they sign in again. Consider calling `posthog.identify(username, { username })` on app load when `auth.status === 'loggedIn'`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
