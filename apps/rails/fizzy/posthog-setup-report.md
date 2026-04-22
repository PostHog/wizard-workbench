<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Ruby on Rails project management and issue tracking application.

## Summary of changes

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — Created PostHog initializer with `PostHog.init` and `PostHog::Rails` auto-instrumentation config (auto exception capture, ActiveJob instrumentation, user context detection)
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables
- **`app/models/user.rb`** — Added `posthog_distinct_id` method returning `identity&.email_address` for consistent user identification
- **`app/controllers/application_controller.rb`** — Added `current_user` private helper (returns `Current.user`) so posthog-rails auto-capture can detect the authenticated user
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet for frontend tracking (pageviews, session replay, client-side events) with automatic user identification when `Current.user` is present
- **13 controllers** instrumented with server-side `PostHog.capture` calls (see table below)

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a user completes account signup | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Fired when a user authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `account_cancelled` | Fired when an account owner cancels their account | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | Fired when a user creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a user deletes a board | `app/controllers/boards_controller.rb` |
| `board_published` | Fired when a board is made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `card_created` | Fired when a new card is created on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | Fired when a card is marked as closed | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Fired when a card is moved from triage into a column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | Fired when a card is postponed to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | Fired when a user posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `user_joined_via_invite` | Fired when a user joins an account via join code | `app/controllers/join_codes_controller.rb` |
| `account_import_started` | Fired when a user starts a data import | `app/controllers/account/imports_controller.rb` |

## Next steps

To start seeing data in PostHog, run `bundle install` to install the `posthog-ruby` and `posthog-rails` gems, then start your server.

Suggested insights to build in your PostHog dashboard:

1. **Signup → First board → First card funnel** — `user_signed_up` → `board_created` → `card_created` — measures new user activation rate
2. **Daily active users** — Trend of `user_logged_in` over time — shows engagement health
3. **Card completion rate** — `card_closed` vs `card_created` ratio — measures team throughput
4. **Churn events** — `account_cancelled` trend — key retention signal
5. **Collaboration depth** — `comment_created` per user — shows engagement quality

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
