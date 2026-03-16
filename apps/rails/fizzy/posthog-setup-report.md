<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Rails application. The integration includes:

- **Backend analytics** via `posthog-ruby` + `posthog-rails` gems for server-side event capture, automatic exception tracking, and ActiveJob instrumentation
- **Frontend analytics** via the posthog-js snippet in the application layout, with automatic user identification for authenticated sessions
- **User identification** on sign-in and sign-up, linking frontend and backend events via a shared `distinct_id` (the user's email address)
- **Error tracking** automatically enabled for all unhandled controller exceptions and rescued exceptions via `posthog-rails` configuration
- **Environment variables** stored in `.env` — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

### Files changed

| File | Change |
|------|--------|
| `Gemfile` | Added `posthog-ruby` and `posthog-rails` gems |
| `config/initializers/posthog.rb` | Created PostHog initializer with auto-exception capture, ActiveJob instrumentation, and user context |
| `app/models/user.rb` | Added `posthog_distinct_id` and `posthog_properties` methods |
| `app/controllers/application_controller.rb` | Added `current_user` helper for posthog-rails auto-instrumentation |
| `app/views/layouts/shared/_head.html.erb` | Added posthog-js frontend snippet with automatic user identification |
| `app/controllers/sessions/magic_links_controller.rb` | Added `signed_in` event with PostHog.identify |
| `app/controllers/signups/completions_controller.rb` | Added `signed_up` event with PostHog.identify |
| `app/controllers/sessions_controller.rb` | Added `signed_out` event |
| `app/controllers/boards_controller.rb` | Added `board_created` and `board_deleted` events |
| `app/controllers/cards_controller.rb` | Added `card_created` and `card_deleted` events |
| `app/controllers/cards/closures_controller.rb` | Added `card_closed` and `card_reopened` events |
| `app/controllers/cards/not_nows_controller.rb` | Added `card_postponed` event |
| `app/controllers/cards/comments_controller.rb` | Added `comment_created` event |
| `app/controllers/account/cancellations_controller.rb` | Added `account_cancelled` event |
| `app/controllers/account/exports_controller.rb` | Added `account_export_started` event |

### Events tracked

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | Triggered when a new user completes signup and their account is created | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | Triggered when a user successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | Triggered when a user terminates their session | `app/controllers/sessions_controller.rb` |
| `board_created` | Triggered when a user creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Triggered when an admin deletes a board | `app/controllers/boards_controller.rb` |
| `card_created` | Triggered when a user creates a new card on a board | `app/controllers/cards_controller.rb` |
| `card_deleted` | Triggered when a user deletes a card | `app/controllers/cards_controller.rb` |
| `card_closed` | Triggered when a user marks a card as closed/done | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Triggered when a user reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Triggered when a user postpones a card to not-now | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | Triggered when a user posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Triggered when an account owner cancels/deletes their account — a critical churn event | `app/controllers/account/cancellations_controller.rb` |
| `account_export_started` | Triggered when an admin initiates a data export — may indicate intent to leave | `app/controllers/account/exports_controller.rb` |

## Next steps

To set up an "Analytics basics" dashboard in PostHog, we recommend creating insights for:

1. **Sign-up funnel** — Funnel from `signed_up` → `board_created` → `card_created` to measure onboarding conversion
2. **Daily active users** — Unique users firing any event per day
3. **Card completion rate** — `card_closed` events over time vs `card_created`
4. **Churn signals** — `account_cancelled` and `account_export_started` events over time
5. **Engagement depth** — `comment_created` events per user per week

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create a new dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
