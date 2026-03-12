<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. Here's a summary of what was added:

- **`posthog-ruby` and `posthog-rails` gems** added to `Gemfile` for backend tracking with automatic exception capture and ActiveJob instrumentation.
- **`config/initializers/posthog.rb`** created to initialize PostHog and configure `posthog-rails` auto-instrumentation: unhandled exception capture, rescued exception reporting, ActiveJob failure tracking, and automatic user context association via `current_user` / `posthog_distinct_id`.
- **`app/models/user.rb`** extended with `posthog_distinct_id` (returns the user's email address) and `posthog_properties` methods for consistent user identification across backend events.
- **`app/controllers/application_controller.rb`** extended with a `current_user` helper (delegating to `Current.user`) so `posthog-rails` can automatically associate errors with the authenticated user.
- **User identification** added on login (`sessions/magic_links_controller.rb`) and signup completion (`signups/completions_controller.rb`) using `PostHog.identify`.
- **13 business events** instrumented across controllers (see table below).
- **posthog-js snippet** added to `app/views/layouts/shared/_head.html.erb` for frontend pageview tracking, session replay, and automatic client-side identify on page load for authenticated users.
- **Environment variables** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` written to `.env`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | User ended their session | `app/controllers/sessions_controller.rb` |
| `user_signed_up` | User completed account signup and created a new workspace | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User created a new card on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | User closed/resolved a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | User triaged a card into a column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | User postponed a card to not-now | `app/controllers/cards/not_nows_controller.rb` |
| `card_gilded` | User marked a card as golden (high priority) | `app/controllers/cards/goldnesses_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | Admin/owner started a data export | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | Owner cancelled/deleted the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To explore your analytics data, create a dashboard in PostHog with insights such as:

- **Signup funnel**: Funnel from `user_logged_in` → `user_signed_up` to track conversion
- **Daily active users**: Trend of unique users triggering `user_logged_in`
- **Card creation activity**: Trend of `card_created` events to measure product engagement
- **Churn monitoring**: Trend of `account_cancelled` events to catch early warning signs
- **Engagement depth**: Trend of `comment_created` + `card_closed` to gauge active collaboration

Visit your [PostHog project](https://us.posthog.com/project/2) to build these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
