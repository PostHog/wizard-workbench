# PostHog post-wizard report

The wizard has completed a deep integration of this Rails project with PostHog across backend business events, frontend identification, automatic error capture, and a starter analytics dashboard. The integration added the `posthog-ruby` and `posthog-rails` gems to the Gemfile, created a Rails initializer for PostHog, wired browser-side PostHog initialization into the shared layout head, extended CSP to allow PostHog assets and ingestion, added a `current_user` helper for Rails error association, and instrumented key product flows including magic-link auth, signup, board creation, card publishing and closure, comments, profile updates, exports, webhook creation, account import, and account cancellation.

| Event name | Description | File |
| --- | --- | --- |
| magic_link_requested | Captures when a visitor requests a magic link for sign-in or account creation. | `app/controllers/sessions_controller.rb` |
| signup_started | Captures when a visitor starts account creation from the signup form. | `app/controllers/signups_controller.rb` |
| signup_completed | Captures when a user completes account setup and lands in a new account. | `app/controllers/signups/completions_controller.rb` |
| board_created | Captures when a user creates a new board. | `app/controllers/boards_controller.rb` |
| card_published | Captures when a draft card is published to a board. | `app/controllers/cards/publishes_controller.rb` |
| card_closed | Captures when a card is closed. | `app/controllers/cards/closures_controller.rb` |
| comment_created | Captures when a user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| user_profile_updated | Captures when a user updates profile details. | `app/controllers/users_controller.rb` |
| data_export_requested | Captures when a user requests a personal data export. | `app/controllers/users/data_exports_controller.rb` |
| webhook_created | Captures when a board webhook is created. | `app/controllers/webhooks_controller.rb` |
| account_import_started | Captures when a user starts importing data into a new account. | `app/controllers/account/imports_controller.rb` |
| account_cancelled | Captures when an account owner deletes an account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831070)
- [Magic links requested (wizard)](https://us.posthog.com/project/483112/insights/qebEeZG9)
- [Signups completed (wizard)](https://us.posthog.com/project/483112/insights/ofNlfX1H)
- [Cards published vs closed (wizard)](https://us.posthog.com/project/483112/insights/ehUIveIZ)
- [Signup completion funnel (wizard)](https://us.posthog.com/project/483112/insights/3PGEZbzh)
- [Operational actions (wizard)](https://us.posthog.com/project/483112/insights/9qyTYnAa)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
