<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. The integration covers the full user lifecycle — from signup and login through core product actions (creating boards and cards, triaging, commenting) to critical churn events (account cancellation). Both server-side tracking via `posthog-rails` and client-side tracking via `posthog-js` have been set up, with user identification ensuring all events are correlated to known users.

**Changes made:**

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — Created PostHog initializer with `PostHog.init` (env-var configuration) and `PostHog::Rails.configure` (auto exception capture, ActiveJob instrumentation, user context)
- **`app/models/user.rb`** — Added `posthog_distinct_id` (identity email) and `posthog_properties` helpers for consistent user identification
- **`app/controllers/application_controller.rb`** — Added `posthog_current_user` helper so `posthog-rails` can attach user context to auto-captured exceptions
- **`app/views/layouts/shared/_head.html.erb`** — Added `posthog-js` snippet for client-side pageview tracking and session replay; auto-identifies logged-in users

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User completed signup and created an account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User ended their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deleted a board | `app/controllers/boards_controller.rb` |
| `board_published` | User made a board publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | User removed public access from a board | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User published a card from draft | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User completed/closed a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a closed card | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | User triaged a card into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `team_member_joined` | User joined an account via join code | `app/controllers/join_codes_controller.rb` |
| `account_cancelled` | Account owner cancelled their account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To build an "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboard) and create a new dashboard with these recommended insights:

1. **Signup funnel** — Funnel from `signed_up` → `board_created` → `card_created` to measure onboarding conversion
2. **Daily active users** — Trend of `signed_in` unique users over time
3. **Core engagement** — Trend of `card_created`, `card_closed`, and `comment_created` side-by-side
4. **Churn rate** — Trend of `account_cancelled` over time
5. **Board collaboration** — Trend of `board_published` and `team_member_joined` to track sharing behavior

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
