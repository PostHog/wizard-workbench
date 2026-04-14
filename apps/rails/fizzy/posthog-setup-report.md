<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Ruby on Rails kanban-style project management application.

## What was done

- Added `posthog-ruby` and `posthog-rails` gems to the `Gemfile`
- Created `config/initializers/posthog.rb` with auto-exception capture, ActiveJob instrumentation, and user context via `current_posthog_user`
- Added `posthog_distinct_id` to the `Identity` model (returns `email_address` as the global unique identifier)
- Added `current_posthog_user` helper to `ApplicationController` for posthog-rails auto-capture
- Added the posthog-js snippet to `app/views/layouts/shared/_head.html.erb` for frontend tracking with automatic `posthog.identify()` for authenticated sessions
- Inserted 15 server-side `PostHog.capture` calls across key controllers
- Added `PostHog.identify` at sign-in and signup completion to link user identity
- Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `signup_completed` | User completed account signup with full name | `app/controllers/signups/completions_controller.rb` |
| `user_signed_out` | User explicitly ended their session | `app/controllers/sessions_controller.rb` |
| `team_member_joined` | User joined an account via invite join code | `app/controllers/join_codes_controller.rb` |
| `board_created` | A new board was created | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board was deleted | `app/controllers/boards_controller.rb` |
| `board_published` | A board was made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A board's public publication was removed | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card was created on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | A card was marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card was reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A card was moved to 'not now' | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A card was triaged into a column | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | A comment was added to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner cancelled the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To set up the recommended "Analytics basics" dashboard in PostHog, navigate to your project and create these five insights:

1. **Signup Conversion Funnel** — Funnel insight: `user_signed_in` → `signup_completed`. Shows what percentage of users who request a magic link complete account setup.

2. **Daily Active Users** — Trends insight: unique users performing `user_signed_in` per day. Tracks login activity over time.

3. **Card Completion Rate** — Trends insight: compare `card_closed` vs `card_created` events over time. Shows how effectively teams close out work.

4. **Team Growth** — Trends insight: `team_member_joined` cumulative count over time. Tracks how accounts are growing their teams.

5. **Churn Events** — Trends insight: `account_cancelled` count over time. Monitor cancellations as a leading churn indicator.

Navigate to your PostHog project to build these insights: https://us.i.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
