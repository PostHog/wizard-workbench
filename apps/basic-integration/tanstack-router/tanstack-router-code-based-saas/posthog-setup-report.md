<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed and initialized in the TanStack Router root with a Vite ingest proxy, browser env vars were added through `.env`, returning signed-in sessions now call `identify`, logout resets the PostHog session, and key product actions in the login, invoice, navigation, team, and upgrade flows now emit product analytics events with non-PII properties. Mutation handling was extended so invoice success and failure paths both emit analytics and capture exceptions, and a wizard dashboard with five saved insights was created in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Captures successful sign-in submissions from the login form. | `src/main.tsx` |
| `logout_clicked` | Captures when an authenticated user signs out from the application. | `src/main.tsx` |
| `dashboard_cta_clicked` | Captures homepage calls-to-action that send visitors deeper into the product. | `src/main.tsx` |
| `invoice_created` | Captures successful invoice creation from the dashboard form. | `src/main.tsx` |
| `invoice_create_failed` | Captures invoice creation failures triggered by the create form. | `src/main.tsx` |
| `invoice_updated` | Captures successful invoice edits saved from the invoice detail screen. | `src/main.tsx` |
| `invoice_update_failed` | Captures invoice update failures from the invoice detail screen. | `src/main.tsx` |
| `invoice_notes_toggled` | Captures when internal invoice notes are shown or hidden. | `src/main.tsx` |
| `team_member_selected` | Captures selection of a team member from the dashboard list. | `src/main.tsx` |
| `subscription_upgrade_clicked` | Captures interest in upgrading from the account subscription card. | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831103)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/bnNz3TxR)
- [Invoice outcomes (wizard)](https://us.posthog.com/project/483112/insights/qShzM0ul)
- [Navigation CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/sBR4rw8d)
- [Team member selections (wizard)](https://us.posthog.com/project/483112/insights/4LhCSBuR)
- [Login to invoice creation funnel (wizard)](https://us.posthog.com/project/483112/insights/cfxHgomy)
- [Upgrade interest (wizard)](https://us.posthog.com/project/483112/insights/OFxvgv91)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
