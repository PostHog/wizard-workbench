<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Ruby on Rails kanban-style project management application.

## What was set up

- **posthog-ruby** and **posthog-rails** gems added to `Gemfile`
- **PostHog initializer** created at `config/initializers/posthog.rb` with automatic exception capture, ActiveJob instrumentation, and user context association
- **posthog-js frontend snippet** added to `app/views/layouts/application.html.erb` for pageviews, session replay, and client-side tracking; automatically calls `posthog.identify()` for authenticated users
- **`posthog_distinct_id` method** added to the `User` model (returns `identity.email_address` as a stable global identifier)
- **`current_user` helper** added to `ApplicationController` for posthog-rails user context detection
- **14 server-side events** instrumented across 9 controller files covering signups, authentication, boards, cards, comments, and account lifecycle
- **Environment variables** set in `.env`: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `signup_completed` | User completes account signup with full name and account is created | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User authenticates via magic link and a new session starts | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User explicitly ends their session | `app/controllers/sessions_controller.rb` |
| `board_created` | A new project board is created | `app/controllers/boards_controller.rb` |
| `board_deleted` | A project board is deleted | `app/controllers/boards_controller.rb` |
| `board_published` | A board is made publicly accessible via shareable link | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card (task/issue) is created on a board | `app/controllers/cards_controller.rb` |
| `card_deleted` | A card is permanently deleted | `app/controllers/cards_controller.rb` |
| `card_closed` | A card is marked as closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | A card is triaged from the inbox into a board column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | A comment is posted on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner cancels and deletes the account | `app/controllers/account/cancellations_controller.rb` |
| `account_joined` | A user joins an account via a join code invite link | `app/controllers/join_codes_controller.rb` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor key product metrics. Here are suggested insights to create:

- **[New Insight: Signups over time](https://us.posthog.com/project/2/insights/new)** — Trend of `signup_completed` events (conversion funnel top)
- **[New Insight: Sign-ins over time](https://us.posthog.com/project/2/insights/new)** — Trend of `user_signed_in` events (daily active users proxy)
- **[New Insight: Signup → First board funnel](https://us.posthog.com/project/2/insights/new)** — Funnel from `signup_completed` → `board_created` → `card_created` (activation funnel)
- **[New Insight: Account cancellation rate](https://us.posthog.com/project/2/insights/new)** — Trend of `account_cancelled` (churn signal)
- **[New Insight: Card closure rate](https://us.posthog.com/project/2/insights/new)** — Trend of `card_closed` vs `card_created` (task completion health)

To create your dashboard, visit: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
