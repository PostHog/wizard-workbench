<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a React + TanStack Router (code-based) SaaS application. The following changes were made:

- **`vite.config.js`** — Converted to a factory function and added a reverse-proxy configuration that routes `/ingest/*` to the PostHog ingest host and `/ingest/static`, `/ingest/array` to the PostHog asset CDN, both sourced from environment variables.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` references type-check correctly.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSET_HOST`.
- **`src/main.tsx`** — Added `PostHogProvider` wrapping the root route component with session replay, exception capture, and debug mode wired to the dev environment. Added `posthog.identify()` on login and `posthog.reset()` on logout. Added 12 `posthog.capture()` call sites across all key user flows.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form and authenticates. | `src/main.tsx` |
| `user_signed_out` | User logs out from the profile page or the login page. | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice. | `src/main.tsx` |
| `invoice_creation_failed` | An error occurred while attempting to create a new invoice. | `src/main.tsx` |
| `invoice_updated` | User successfully saves changes to an existing invoice. | `src/main.tsx` |
| `invoice_update_failed` | An error occurred while attempting to save invoice changes. | `src/main.tsx` |
| `invoice_viewed` | User opens a specific invoice detail page (top of invoice conversion funnel). | `src/main.tsx` |
| `invoice_notes_toggled` | User opens or closes the internal notes section on an invoice. | `src/main.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the profile/account page. | `src/main.tsx` |
| `team_member_viewed` | User opens a team member's profile details. | `src/main.tsx` |
| `team_members_filtered` | User applies a text filter to search through team members. | `src/main.tsx` |
| `team_members_sorted` | User changes the sort order of the team members list. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/2/dashboard/4284026)
- [Invoice creation funnel (wizard)](https://us.i.posthog.com/project/2/insights/lyzhnj) — `invoice_viewed → invoice_created` conversion funnel
- [Invoice creation vs failure trend (wizard)](https://us.i.posthog.com/project/2/insights/q41dj3) — `invoice_created` vs `invoice_creation_failed` over time
- [User authentication trend (wizard)](https://us.i.posthog.com/project/2/insights/6ondyx) — `user_signed_in` and `user_signed_out` over 30 days
- [Plan upgrade clicks (wizard)](https://us.i.posthog.com/project/2/insights/o307jh) — `plan_upgrade_clicked` trend (revenue signal)
- [Invoice update success vs failure (wizard)](https://us.i.posthog.com/project/2/insights/1p2qq1) — `invoice_updated` vs `invoice_update_failed` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSET_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on login form submit, so users who return with an active session (if persistence is added) may be on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
