<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application built with React and TanStack Router. The integration adds product analytics tracking for key user journeys including authentication, invoice management, and upgrade conversion.

## Integration summary

PostHog was integrated into `src/main.tsx` using the `posthog-js` library with the `PostHogProvider` component wrapping the app. The following changes were made:

- Added `PostHogProvider` to `RootComponent` to initialize PostHog tracking throughout the app
- Added `user_logged_in` event capture with user identification in `LoginComponent`
- Added `user_logged_out` event capture with identity reset in both login and profile logout handlers
- Added `upgrade_clicked` event capture in `ProfileComponent` when the Upgrade button is clicked
- Added `invoice_created` event capture in `InvoicesIndexComponent` when a new invoice is submitted
- Added `invoice_updated` event capture in `InvoiceComponent` when invoice changes are saved
- Added `invoice_notes_toggled` event capture in `InvoiceComponent` when notes are shown/hidden

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user submits the login form and successfully signs in | `src/main.tsx` |
| `user_logged_out` | Fired when a user clicks the sign out button from the profile page or login page | `src/main.tsx` |
| `invoice_created` | Fired when a user submits the create invoice form successfully | `src/main.tsx` |
| `invoice_updated` | Fired when a user saves changes to an existing invoice | `src/main.tsx` |
| `upgrade_clicked` | Fired when a user clicks the Upgrade button on the account/profile page | `src/main.tsx` |
| `invoice_notes_toggled` | Fired when a user shows or hides internal notes on an invoice | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/2/dashboard/1900006)
- [Sign-ins over time](https://us.posthog.com/project/2/insights/insight-9900001)
- [Upgrade button clicks](https://us.posthog.com/project/2/insights/insight-9900002)
- [Invoice creation funnel](https://us.posthog.com/project/2/insights/insight-9900003)
- [Invoice actions](https://us.posthog.com/project/2/insights/insight-9900004)
- [Logout rate](https://us.posthog.com/project/2/insights/insight-9900005)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
