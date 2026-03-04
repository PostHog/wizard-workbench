<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. The integration includes server-side event tracking, user identification, automatic exception capture via `posthog-rails`, and frontend tracking via posthog-js.

**Changes made:**

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — Created PostHog initializer with auto-capture exceptions, ActiveJob instrumentation, and user context configuration
- **`app/models/user.rb`** — Added `posthog_distinct_id` (using identity email) and `posthog_properties` methods for automatic user association in error reports
- **`app/controllers/application_controller.rb`** — Added `current_user` helper (returns `Current.user`) for posthog-rails user context detection
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet for frontend pageview tracking and user identification on every authenticated request
- **`.env`** — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `signup_started` | User submitted their email to begin the signup process | `app/controllers/signups_controller.rb` |
| `signup_completed` | User completed signup by providing their name and creating an account | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User successfully authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User terminated their session | `app/controllers/sessions_controller.rb` |
| `account_cancelled` | Account owner cancelled and deleted the account (churn event) | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deleted a board | `app/controllers/boards_controller.rb` |
| `card_created` | User created a new card (task/issue) | `app/controllers/cards_controller.rb` |
| `card_closed` | User marked a card as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User marked a card as not now (postponed) | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `join_code_redeemed` | User joined an account using an invite join code | `app/controllers/join_codes_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1295697) — Core business metrics dashboard with churn indicators, card lifecycle, feature engagement, and authentication activity

**Recommended insights to create with the above events:**

1. **Signup Conversion Funnel** — `signup_started` → `signup_completed` → `user_signed_in` → `board_created` → `card_created` (measures full activation)
2. **Churn Rate** — Trend of `account_cancelled` events (critical business health metric)
3. **Feature Engagement** — Trend of `board_created`, `card_created`, `comment_added`, `card_closed`, `card_postponed` (measures product stickiness)
4. **User Authentication Activity** — Trend of `signup_started`, `signup_completed`, `user_signed_in`, `user_signed_out` (monitors user lifecycle)
5. **Team Growth via Invites** — Trend of `join_code_redeemed` (tracks viral team expansion)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
