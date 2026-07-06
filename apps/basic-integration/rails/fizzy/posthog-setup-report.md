<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Rails project with PostHog across backend business events, Rails error capture, user identification, and a lightweight browser snippet for identified sessions. The integration added PostHog gems to the Gemfile, created a Rails initializer, exposed PostHog configuration through environment variables, added person identification helpers on the user model, initialized frontend identify behavior from layout metadata, and instrumented key account, onboarding, collaboration, export, import, and webhook flows.

| Event name | Description | File |
| --- | --- | --- |
| signup_started | Captures when a visitor submits the initial signup form to begin account creation. | app/controllers/signups_controller.rb |
| signup_completed | Captures when a user finishes signup completion and creates their first account. | app/controllers/signups/completions_controller.rb |
| magic_link_authenticated | Captures when a user successfully signs in with a magic link. | app/controllers/sessions/magic_links_controller.rb |
| join_code_redeemed | Captures when a user successfully joins an account with a join code. | app/controllers/join_codes_controller.rb |
| card_created | Captures when a user creates a new card in a board. | app/controllers/cards_controller.rb |
| comment_created | Captures when a user adds a comment to a card. | app/controllers/cards/comments_controller.rb |
| webhook_created | Captures when a board admin creates a webhook subscription. | app/controllers/webhooks_controller.rb |
| webhook_activated | Captures when a board admin activates a webhook. | app/controllers/webhooks/activations_controller.rb |
| account_export_requested | Captures when an account owner or admin requests an account export. | app/controllers/account/exports_controller.rb |
| account_import_started | Captures when a signed-in user starts importing an exported account into a new workspace. | app/controllers/account/imports_controller.rb |
| user_verified | Captures when a signed-in user completes account verification. | app/controllers/users/verifications_controller.rb |
| data_export_requested | Captures when a user requests a personal data export. | app/controllers/users/data_exports_controller.rb |
| account_cancelled | Captures when an owner deletes an account. | app/controllers/account/cancellations_controller.rb |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807678
- Insight: Signup starts — https://us.posthog.com/project/483112/insights/QBRc2Lya
- Insight: Signup completions — https://us.posthog.com/project/483112/insights/3Fka5j6C
- Insight: Magic link authentication — https://us.posthog.com/project/483112/insights/2Qc6hLQV
- Insight: Card creation — https://us.posthog.com/project/483112/insights/llUEKCUH
- Insight: Webhook lifecycle — https://us.posthog.com/project/483112/insights/ASoHWp36

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
