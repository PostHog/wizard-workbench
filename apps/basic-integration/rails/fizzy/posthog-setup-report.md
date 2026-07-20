# PostHog post-wizard report

The wizard added the PostHog Ruby and Rails SDK dependencies, environment-based initialization, automatic Rails exception and ActiveJob instrumentation, stable user identifiers, person identification at signup and login, and server-side analytics for core collaboration and account-management actions. The local environment uses `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; no PostHog credentials are embedded in source.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A user completes account setup and creates their account. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user creates a new board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a card on a board. | `app/controllers/cards_controller.rb` |
| `comment_created` | A user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_closed` | A user closes a card after work is completed. | `app/controllers/cards/closures_controller.rb` |
| `account_export_started` | An account administrator starts a data export. | `app/controllers/account/exports_controller.rb` |
| `account_import_started` | A user starts importing account data. | `app/controllers/account/imports_controller.rb` |
| `webhook_created` | An administrator creates a board webhook. | `app/controllers/webhooks_controller.rb` |
| `webhook_activated` | An administrator activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |
| `user_logged_out` | An authenticated user ends their session. | `app/controllers/sessions_controller.rb` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP endpoint was unavailable during this run. Once access is restored, create **Analytics basics (wizard)** with a signup-to-board-to-card funnel and trends for card closure, comments, exports/imports, and webhook activation.

## Verify before merging

- [ ] Install the added gems with Bundler and commit the updated lockfile; `bundle` was unavailable in the wizard environment.
- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
