<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy project management application. The following changes were made:

- **Gems added**: `posthog-ruby` and `posthog-rails` added to `Gemfile`
- **Initializer created**: `config/initializers/posthog.rb` sets up PostHog with auto-exception capture, Rails.error integration, and ActiveJob instrumentation
- **Environment variables**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added to `.env`
- **User model**: Added `posthog_distinct_id` (identity email address) and `posthog_properties` to `User`
- **ApplicationController**: Added `current_user` helper (returns `Current.user`) for posthog-rails auto-detection
- **Frontend snippet**: posthog-js added to the shared head layout with CSP nonce support; calls `posthog.identify()` when a user is authenticated
- **11 backend events** instrumented across controllers (see table below)

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | Fired when a new user completes account registration | `app/controllers/signups/completions_controller.rb` |
| `board_created` | Fired when a user creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a board is deleted | `app/controllers/boards_controller.rb` |
| `card_created` | Fired when a drafted card is published to a board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fired when a card is closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `comment_created` | Fired when a user posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Fired when a user is assigned to a card | `app/controllers/cards/assignments_controller.rb` |
| `board_published` | Fired when a board is made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `account_cancelled` | Fired when an account owner deletes/cancels the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

The PostHog API key used during setup is missing the scopes required to programmatically create dashboards and insights (`dashboard:write`, `insight:write`, `query:read`). To create a dashboard named **"Analytics basics (wizard)"**, please visit your PostHog project and add the following insights manually:

1. **User signups over time** — Trends chart for `user_signed_up`
2. **User login activity** — Trends chart for `user_logged_in`
3. **Signup → board → card funnel** — Funnel: `user_signed_up` → `board_created` → `card_created`
4. **Cards closed per day** — Trends chart for `card_closed` to measure team productivity
5. **Account churn** — Trends chart for `account_cancelled` to track cancellation risk

[Open PostHog Dashboard](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
