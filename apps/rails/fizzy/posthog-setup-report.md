<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, the Rails-based kanban/issue-tracking application.

## Summary of changes

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems.
- **`config/initializers/posthog.rb`** *(new)* — Initializes `PostHog` with API key and host from environment variables; configures `posthog-rails` for automatic exception capture, rescued exception capture, ActiveJob instrumentation, and user context detection.
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns the identity email address, used by posthog-rails for auto user association) and `posthog_properties` helper.
- **`app/controllers/application_controller.rb`** — Added `current_user` private helper (returns `Current.user`) so posthog-rails can detect the authenticated user automatically.
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet for frontend pageview, session replay, and click tracking; auto-identifies the logged-in user on every page load.
- **`app/controllers/sessions/magic_links_controller.rb`** — Added `PostHog.identify` + `user_signed_in` capture after successful magic link authentication.
- **`app/controllers/signups/completions_controller.rb`** — Added `PostHog.identify` + `user_signed_up` capture when a new account is created.
- **`app/controllers/boards_controller.rb`** — Added `board_created` capture on board creation.
- **`app/controllers/cards_controller.rb`** — Added `card_created` capture (JSON path) and `card_deleted` capture.
- **`app/controllers/cards/closures_controller.rb`** — Added `card_closed` and `card_reopened` captures.
- **`app/controllers/cards/comments_controller.rb`** — Added `comment_created` capture.
- **`app/controllers/account/cancellations_controller.rb`** — Added `account_cancelled` capture before the account is destroyed.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | New user completed signup and created an account | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User created a new card on a board | `app/controllers/cards_controller.rb` |
| `card_deleted` | User deleted a card | `app/controllers/cards_controller.rb` |
| `card_closed` | User closed (completed) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancelled and deleted their account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) with these recommended insights:

1. **Signup funnel** — Funnel from `user_signed_up` → `board_created` → `card_created` to measure new user activation rate.
2. **New signups over time** — Trend chart of `user_signed_up` to track growth.
3. **Engagement: cards closed** — Trend of `card_closed` to measure work completion velocity.
4. **Comments per user** — Trend of `comment_created` broken down by user to identify your most active collaborators.
5. **Churn: account cancellations** — Trend of `account_cancelled` to monitor churn.

All backend events are correlated with frontend posthog-js events via the shared `distinct_id` (user's email address), enabling session replay on error reports and full user journey analysis.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
