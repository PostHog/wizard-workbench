<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this TanStack Router project with PostHog. It installed `posthog-js` and `@posthog/react`, initialized PostHog with environment-based configuration in the root route, added a Vite ingest proxy, enabled browser exception capture, added user identification on login with reset on logout, instrumented key product events across landing, invoice, team-management, authentication, and upgrade-intent flows, and added a Vite type declaration file so the integration passes build and type checks.

| Event name | Description | File |
| --- | --- | --- |
| `cta_clicked` | Captures clicks on primary landing page calls to action that start key navigation flows. | `src/main.tsx` |
| `invoice_creation_submitted` | Captures successful invoice creation attempts from the dashboard invoice form. | `src/main.tsx` |
| `invoice_updated` | Captures successful invoice edits saved from an invoice detail view. | `src/main.tsx` |
| `invoice_notes_toggled` | Captures when internal invoice notes are shown or hidden during invoice review. | `src/main.tsx` |
| `team_filter_applied` | Captures when a team member search filter is applied in the team management view. | `src/main.tsx` |
| `team_sort_changed` | Captures when the team list sorting mode is changed. | `src/main.tsx` |
| `team_member_opened` | Captures when a team member profile is opened from the team list. | `src/main.tsx` |
| `user_logged_in` | Captures successful sign-in attempts and identifies the active user. | `src/main.tsx` |
| `user_logged_out` | Captures logout actions before resetting the client identity. | `src/main.tsx` |
| `subscription_upgrade_clicked` | Captures clicks on the account subscription upgrade button. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807726
- Insight: Landing CTA clicks — https://us.posthog.com/project/483112/insights/Vhgi19u2
- Insight: Invoice workflow funnel — https://us.posthog.com/project/483112/insights/s2szHsCe
- Insight: Team management activity — https://us.posthog.com/project/483112/insights/jtkm3h0b
- Insight: Auth lifecycle — https://us.posthog.com/project/483112/insights/fBNZovWl
- Insight: Upgrade intent clicks — https://us.posthog.com/project/483112/insights/0qmqesHF

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
