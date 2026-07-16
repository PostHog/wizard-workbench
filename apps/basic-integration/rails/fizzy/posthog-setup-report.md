# PostHog post-wizard report

The wizard integrated PostHog across the Rails application. It added the Ruby and Rails SDK dependencies, environment-driven initialization, automatic controller and ActiveJob exception instrumentation, browser analytics with session replay defaults, CSP allowances for the configured PostHog endpoints, and authenticated user identification using stable user IDs. Product events now capture meaningful lifecycle and collaboration actions without sending user-entered content or other PII as event properties.

> Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable in this environment. The integration itself is ready once dependencies are installed.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | An authenticated user signs in through a magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `signup_completed` | A newly authenticated user completes account signup. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | An authenticated user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | An authenticated user creates a card on a board. | `app/controllers/cards_controller.rb` |
| `card_updated` | An authenticated user updates a card. | `app/controllers/cards_controller.rb` |
| `comment_created` | An authenticated user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `step_created` | An authenticated user adds a step to a card. | `app/controllers/cards/steps_controller.rb` |
| `card_assignment_changed` | An authenticated user changes a card assignment. | `app/controllers/cards/assignments_controller.rb` |
| `account_export_started` | An administrator or owner starts an account export. | `app/controllers/account/exports_controller.rb` |
| `webhook_activated` | An administrator activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |

## Next steps

- Dashboard and insights: unavailable because the PostHog MCP connection could not be established.
- Shareable setup notebook: unavailable because the PostHog MCP connection could not be established.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.
- [ ] Run `bundle install` to update `Gemfile.lock`; Bundler was unavailable in the wizard environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
