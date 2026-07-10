<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the React TanStack Router app with a root-level `PostHogProvider`, Vite ingest proxying, environment-based configuration, client-side user identification for sign-in/sign-out, and targeted product analytics for acquisition, invoicing, team exploration, and upgrade intent. The integration was verified with a successful production build.

| Event name | Description | File |
| --- | --- | --- |
| `marketing_cta_clicked` | Captures clicks on the landing page calls to action that start product exploration. | `src/routes/index.tsx` |
| `user_logged_in` | Captures successful sign-in actions and identifies the authenticated user. | `src/utils/auth.tsx` |
| `user_logged_out` | Captures sign-out actions before the current user session is reset. | `src/utils/auth.tsx` |
| `invoice_created` | Captures successful invoice creation from the dashboard invoice form. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Captures successful invoice edits from the invoice details screen. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | Captures views of individual team member profiles from the users area. | `src/routes/dashboard.users.user.tsx` |
| `subscription_upgrade_clicked` | Captures upgrade button clicks from the account settings screen. | `src/routes/_auth.profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831102)
- [Sign-ins over time (wizard)](https://us.posthog.com/project/483112/insights/bTJVrRgY)
- [Invoice creation volume (wizard)](https://us.posthog.com/project/483112/insights/AhgxVxfG)
- [Invoice update trend (wizard)](https://us.posthog.com/project/483112/insights/pc5It7k6)
- [Landing to sign-in funnel (wizard)](https://us.posthog.com/project/483112/insights/thJllsNh)
- [Upgrade CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/mFJzBokW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
