<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **`vite.config.js`** — Converted to the environment-aware `defineConfig` form and added a Vite dev-server reverse proxy routing `/ingest/*` requests through to PostHog (avoids ad-blocker interference and keeps data collection reliable).
- **`src/vite-env.d.ts`** — Created this file to add `/// <reference types="vite/client" />` so TypeScript recognises `import.meta.env.*` variables.
- **`src/main.tsx`** — Wrapped `RootComponent` with `PostHogProvider` (using env vars for the API key and host). Added `posthog.identify()` and `posthog.capture('user_logged_in')` on login. Added `posthog.capture('user_logged_out')` and `posthog.reset()` on both logout buttons (LoginComponent and ProfileComponent). Added `posthog.capture('upgrade_clicked')` on the Upgrade button. Added `posthog.capture('invoice_created')` in the `onSuccess` callback. Added `posthog.capture('invoice_updated')` in the update mutation's `onSuccess` callback. Added `posthog.capture('invoice_viewed')` and `posthog.capture('invoice_notes_toggled')` in InvoiceComponent. Added `posthog.capture('team_member_viewed')` in UserComponent. Added `posthog.capture('team_member_searched')` in the search input handler and `posthog.capture('team_member_sort_changed')` in the sort handler.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submitted the login form and authenticated. | `src/main.tsx` |
| `user_logged_out` | User clicked Sign Out from the profile page or login page. | `src/main.tsx` |
| `invoice_created` | User submitted the create invoice form and the invoice was saved successfully. | `src/main.tsx` |
| `invoice_updated` | User saved changes to an existing invoice via the edit form. | `src/main.tsx` |
| `invoice_viewed` | User navigated to an individual invoice detail page (top of conversion funnel). | `src/main.tsx` |
| `team_member_viewed` | User navigated to a team member's profile detail page. | `src/main.tsx` |
| `upgrade_clicked` | User clicked the Upgrade button on the account profile page. | `src/main.tsx` |
| `invoice_notes_toggled` | User clicked to show or hide internal notes on an invoice. | `src/main.tsx` |
| `team_member_searched` | User typed into the team member search filter. | `src/main.tsx` |
| `team_member_sort_changed` | User changed the sort order for the team members list. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824652)
- **Insight**: [Login to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/ZOPkJv2E)
- **Insight**: [Daily logins and logouts (wizard)](https://us.posthog.com/project/483112/insights/Na3Gmn7f)
- **Insight**: [Invoice activity over time (wizard)](https://us.posthog.com/project/483112/insights/yesIetQn)
- **Insight**: [Upgrade button clicks (wizard)](https://us.posthog.com/project/483112/insights/6y3YlZEY)
- **Insight**: [Team feature engagement (wizard)](https://us.posthog.com/project/483112/insights/zglB0zXl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login. If users reload with an active session, add an `identify` call in that path so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
