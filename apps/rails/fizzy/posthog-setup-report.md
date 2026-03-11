# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. The following changes were made:

- **Gems installed**: Added `posthog-ruby` and `posthog-rails` to `Gemfile` and updated `Gemfile.lock`.
- **Initializer created**: `config/initializers/posthog.rb` configures PostHog with automatic exception capture, ActiveJob instrumentation, and user context from `current_user`.
- **User model**: Added `posthog_distinct_id` (returns the identity email address) and `posthog_properties` helper methods to `app/models/user.rb`.
- **Application controller**: Added `current_user` helper returning `Current.user` so posthog-rails can auto-associate errors and jobs with the logged-in user.
- **Backend events**: 15 `PostHog.capture` calls added across 11 controllers covering the full user lifecycle, board and card activity, team management, and account-level events.
- **Frontend snippet**: posthog-js loader added to `app/views/layouts/shared/_head.html.erb` with CSP nonce support and server-side `posthog.identify` for authenticated users.
- **Environment variables**: `POSTHOG_KEY` and `POSTHOG_HOST` added to `.env`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user identity is created and completes signup. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | An existing user authenticates via magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | A user terminates their session. | `app/controllers/sessions_controller.rb` |
| `board_created` | A new kanban board is created. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board is destroyed. | `app/controllers/boards_controller.rb` |
| `card_closed` | A card is closed/resolved. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card is reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_published` | A card is published to a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_triaged` | A card is moved from triage into a column. | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | A card is manually marked as 'not now'. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | A comment is posted on a card. | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | An account data export is initiated. | `app/controllers/account/exports_controller.rb` |
| `account_import_started` | An account data import is initiated. | `app/controllers/account/imports_controller.rb` |
| `account_cancelled` | An account owner cancels/deletes the account. | `app/controllers/account/cancellations_controller.rb` |
| `user_deactivated` | A user is deactivated from an account. | `app/controllers/users_controller.rb` |

## Next steps

We've prepared the following insights and dashboard to keep an eye on user behavior, based on the events instrumented above. Create an **"Analytics basics"** dashboard in PostHog and add these insights:

1. **Signup-to-login conversion funnel** — Funnel from `user_signed_up` → `user_logged_in`. Shows how many new signups return to log in.
2. **Account churn** — Trend of `account_cancelled` over time. Your most critical retention metric.
3. **Card lifecycle activity** — Stacked trend of `card_closed`, `card_reopened`, `card_triaged`, and `card_postponed`. Shows team throughput and backlog health.
4. **Board adoption** — Trend of `board_created` alongside unique users. Measures feature adoption after signup.
5. **User deactivations vs signups** — Dual-axis trend comparing `user_signed_up` and `user_deactivated`. Tracks net team growth.

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
