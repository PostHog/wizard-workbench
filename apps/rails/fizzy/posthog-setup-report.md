<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Ruby on Rails application. Here's a summary of all changes made:

## Summary of changes

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems for backend analytics and automatic exception/job instrumentation.
- **`config/initializers/posthog.rb`** — Created PostHog initializer with `PostHog.init` (API key + host from env vars) and `PostHog::Rails.configure` enabling auto exception capture, rescued exception reporting, ActiveJob instrumentation, and user context association via `current_user`.
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns the identity's email address as the stable global ID) and `posthog_properties` helper methods.
- **`app/controllers/application_controller.rb`** — Added `current_user` helper method returning `Current.user` so `posthog-rails` can associate errors with authenticated users automatically.
- **`app/views/layouts/shared/_head.html.erb`** — Added the posthog-js frontend snippet to both layouts (application + public share the same head partial). When a user is logged in, `posthog.identify()` is called to correlate frontend and backend events.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired when a new user completes signup and an account is created | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Fired when a user successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | Fired when a user ends their session | `app/controllers/sessions_controller.rb` |
| `board_created` | Fired when a user creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a user deletes a board | `app/controllers/boards_controller.rb` |
| `card_published` | Fired when a card draft is published and becomes visible on the board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fired when a card is marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Fired when a card is triaged into a column from the triage queue | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | Fired when a card is manually postponed (sent to not now) | `app/controllers/cards/not_nows_controller.rb` |
| `card_assigned` | Fired when a user is assigned to or unassigned from a card | `app/controllers/cards/assignments_controller.rb` |
| `comment_created` | Fired when a user posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Fired when an account owner cancels and deletes their account | `app/controllers/account/cancellations_controller.rb` |

## Automatic instrumentation (via posthog-rails)

In addition to the manual events above, `posthog-rails` automatically captures:
- **Unhandled controller exceptions** with user context
- **Rescued exceptions** (e.g. `ActiveRecord::RecordNotFound`)
- **ActiveJob failures** (background job errors with job class, queue, and args)

## Next steps

You can build insights in PostHog based on the events above. Recommended insights:

1. **Signup → Board → Card funnel** — Track conversion from `user_signed_up` → `board_created` → `card_published` to understand new user onboarding.
2. **Daily active users** — Trend chart of unique users triggering `user_logged_in`.
3. **Card completion rate** — Ratio of `card_closed` to `card_published` over time.
4. **Churn monitoring** — Trend of `account_cancelled` events with breakdown by account age.
5. **Collaboration engagement** — Trend of `comment_created` and `card_assigned` events.

Visit your [PostHog project](https://us.posthog.com/project/238460) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
