<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy project management application. The integration covers the full `posthog-rails` gem setup with automatic exception capture, ActiveJob instrumentation, and user context — plus 15 custom business events spanning the user lifecycle, board management, and card workflow. The posthog-js frontend snippet is included in the shared head layout to capture pageviews and session replay alongside backend events, with automatic client-side user identification.

## Changes summary

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — Created PostHog initializer with Rails auto-instrumentation (auto exception capture, ActiveJob instrumentation, user context via `Current.identity`)
- **`app/models/identity.rb`** — Added `posthog_distinct_id` (email address) and `posthog_properties` methods for automatic user association in error reports
- **`app/controllers/application_controller.rb`** — Added `current_posthog_user` helper returning `Current.identity` (used by posthog-rails for error context)
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet with automatic client-side user identification
- **15 controllers** — Added `PostHog.capture` and `PostHog.identify` calls (see table below)

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user completes signup and their account is created | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Fires when a user successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | Fires when a user destroys their session | `app/controllers/sessions_controller.rb` |
| `board_created` | Fires when a user creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fires when a user deletes a board | `app/controllers/boards_controller.rb` |
| `board_published` | Fires when a board is made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `card_created` | Fires when a draft card is published and becomes a real card | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fires when a card is closed (resolved/done) | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fires when a closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Fires when a card is moved from triage into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | Fires when a card is marked as not now (postponed) | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | Fires when a user posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Fires when a card is assigned to a user | `app/controllers/cards/assignments_controller.rb` |
| `account_exported` | Fires when an admin triggers an account data export | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | Fires when an owner cancels and deletes their account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've set up event tracking across all key user flows. Create an **Analytics basics** dashboard in PostHog with these recommended insights:

- **[User signup funnel](/insights#funnel)** — Steps: `user_logged_in` → `user_signed_up` → `board_created` → `card_created`
- **[Daily active users](/insights#trends)** — Trend of `user_logged_in` unique users over time
- **[Card completion rate](/insights#trends)** — Ratio of `card_closed` to `card_created` events
- **[Churn signal](/insights#trends)** — Trend of `account_cancelled` events
- **[Collaboration depth](/insights#trends)** — `comment_created` and `card_assigned` events by user

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
