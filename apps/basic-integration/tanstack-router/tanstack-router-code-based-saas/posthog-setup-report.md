<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (code-based routing) SaaS application. The integration covers user identification, conversion funnel events, invoice lifecycle tracking, error capture, and upgrade intent measurement.

**Files modified:**
- `src/main.tsx` — Added `PostHogProvider` to wrap the root route component; added `posthog.identify()` on login; added `posthog.reset()` on logout; added event captures across six components.
- `src/useMutation.tsx` — Added optional `onError` callback to the mutation hook to enable error event tracking.
- `vite.config.js` — Added PostHog reverse-proxy routes (`/ingest`, `/ingest/static`, `/ingest/array`) so analytics traffic routes through the app's own domain.
- `src/vite-env.d.ts` — Created Vite client type reference so `import.meta.env` is typed correctly.
- `.env` — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully submits the login form. | `src/main.tsx` |
| `user_logged_out` | Fires when a user clicks the Sign Out button, including PostHog identity reset. | `src/main.tsx` |
| `invoice_created` | Fires when a new invoice is successfully created via the create invoice form. | `src/main.tsx` |
| `invoice_creation_failed` | Fires when creating a new invoice fails due to a server or validation error. | `src/main.tsx` |
| `invoice_updated` | Fires when an existing invoice is successfully saved after editing. | `src/main.tsx` |
| `invoice_update_failed` | Fires when saving changes to an existing invoice fails. | `src/main.tsx` |
| `invoice_notes_toggled` | Fires when a user opens or hides the internal notes section on an invoice. | `src/main.tsx` |
| `upgrade_plan_clicked` | Fires when a user clicks the Upgrade button on the Account Settings page. | `src/main.tsx` |
| `team_sort_changed` | Fires when a user changes the sort order of the team members list. | `src/main.tsx` |
| `team_filter_applied` | Fires when a user types in the team member search field to filter results. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1760786)
- **Conversion funnel: Login → Invoice → Upgrade**: [https://us.posthog.com/project/483112/insights/E5LEXORb](https://us.posthog.com/project/483112/insights/E5LEXORb)
- **Invoice creation trend**: [https://us.posthog.com/project/483112/insights/zR7bWPoj](https://us.posthog.com/project/483112/insights/zR7bWPoj)
- **Login vs Logout activity**: [https://us.posthog.com/project/483112/insights/VmkrsAly](https://us.posthog.com/project/483112/insights/VmkrsAly)
- **Invoice operation errors**: [https://us.posthog.com/project/483112/insights/vnvXpCAC](https://us.posthog.com/project/483112/insights/vnvXpCAC)
- **Upgrade button clicks (revenue intent)**: [https://us.posthog.com/project/483112/insights/umi4NwJC](https://us.posthog.com/project/483112/insights/umi4NwJC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login; ensure returning users (e.g. page reload with existing session) are also identified so returning sessions aren't left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
