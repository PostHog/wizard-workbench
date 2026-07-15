# PostHog post-wizard report

PostHog server-side analytics has been added to the Rails application using `posthog-ruby` and `posthog-rails`. The integration initializes the SDK from environment variables, enables automatic exception and ActiveJob error capture, identifies authenticated users with stable database IDs, and captures key signup, login, and product actions. The layout exposes the configured PostHog host for future frontend integration without embedding credentials in source.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Tracks successful account creation after the signup flow completes. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Tracks successful magic-link login completion. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | Tracks when an authenticated user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | Tracks when an authenticated user creates a published card. | `app/controllers/cards_controller.rb` |
| `webhook_created` | Tracks when a board administrator creates a webhook. | `app/controllers/webhooks_controller.rb` |
| `account_export_created` | Tracks when an authenticated user requests an account export. | `app/controllers/account/exports_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard and insight links were not created because the PostHog MCP server was unavailable in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — instrumented controller call sites may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and deployment configuration for collaborators and production.
- [ ] Confirm the returning authenticated-visitor path identifies the user consistently, not only immediately after magic-link login.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
