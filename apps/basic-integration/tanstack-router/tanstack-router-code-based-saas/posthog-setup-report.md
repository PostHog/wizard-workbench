<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to this TanStack Router code-based React app with a root-level `PostHogProvider`, Vite ingest proxying, browser environment variable wiring, returning-user identify support via local storage, error capture through a PostHog-backed error boundary, and product analytics captures across homepage CTAs, login, invoice creation and updates, invoice notes toggling, team exploration, upgrades, and logout flows.

| Event name | Description | File |
| --- | --- | --- |
| cta_clicked | Captures when a visitor clicks a primary homepage call to action. | src/main.tsx |
| login_submitted | Captures when a user submits the sign-in form. | src/main.tsx |
| invoice_created | Captures when a new invoice is created successfully. | src/main.tsx |
| invoice_create_failed | Captures when invoice creation fails after form submission. | src/main.tsx |
| invoice_updated | Captures when invoice changes are saved successfully. | src/main.tsx |
| invoice_update_failed | Captures when saving invoice changes fails. | src/main.tsx |
| invoice_notes_toggled | Captures when internal invoice notes are shown or hidden. | src/main.tsx |
| team_member_selected | Captures when a team member profile is opened from the list. | src/main.tsx |
| team_filter_updated | Captures when the team directory search filter changes. | src/main.tsx |
| team_sort_changed | Captures when the team directory sorting option changes. | src/main.tsx |
| plan_upgrade_clicked | Captures when an authenticated user clicks the upgrade action. | src/main.tsx |
| logout_clicked | Captures when a signed-in user starts a logout action. | src/main.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825443
- Insight: Login submissions (wizard) — https://us.posthog.com/project/483112/insights/zuVQNC26
- Insight: Homepage CTA clicks by destination (wizard) — https://us.posthog.com/project/483112/insights/iVMH1z2c
- Insight: Login to invoice creation funnel (wizard) — https://us.posthog.com/project/483112/insights/BKXYMS8F
- Insight: Invoice outcome mix (wizard) — https://us.posthog.com/project/483112/insights/ENLxVh5R
- Insight: Team exploration actions (wizard) — https://us.posthog.com/project/483112/insights/jcdBLwuU

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
