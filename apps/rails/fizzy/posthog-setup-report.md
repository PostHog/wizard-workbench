<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Ruby on Rails kanban-style project management application. The integration covers both server-side event tracking (via `posthog-ruby` + `posthog-rails`) and frontend session tracking (via the posthog-js browser snippet).

**What was changed:**

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems.
- **config/initializers/posthog.rb** — Created PostHog initializer with `PostHog.init` (using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` env vars) and `PostHog::Rails.configure` with `auto_capture_exceptions`, `report_rescued_exceptions`, `auto_instrument_active_job`, and `capture_user_context` all enabled.
- **app/models/user.rb** — Added `posthog_distinct_id` returning `identity.email_address` for automatic user association in error reports.
- **app/controllers/application_controller.rb** — Added `current_user` private helper (returns `Current.user`) so posthog-rails can detect the current user automatically.
- **app/views/layouts/shared/_head.html.erb** — Added posthog-js snippet with CSP nonce support and `posthog.identify` call for authenticated users. Uses `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` env vars.
- **.env** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` set.
- **10 controller files** — Event captures inserted (see table below).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User completes magic-link auth and starts a session | `app/controllers/sessions/magic_links_controller.rb` |
| `account_created` | User completes signup and creates an account | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User creates and publishes a card (JSON API) | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes (completes) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postpones a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | User triages a card into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels the account (churn) | `app/controllers/account/cancellations_controller.rb` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these insights to monitor the key business metrics instrumented above:

- **[Signup funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&funnel_viz_type=steps&events=%5B%7B%22id%22%3A%22account_created%22%7D%2C%7B%22id%22%3A%22board_created%22%7D%2C%7B%22id%22%3A%22card_created%22%7D%5D)** — Funnel: `account_created` → `board_created` → `card_created`. Tracks how many new users progress through the core activation flow.
- **[Daily sign-ins trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22user_signed_in%22%7D%5D)** — Trend of `user_signed_in` events over time. A proxy for daily active users.
- **[Card workflow activity](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22card_triaged%22%7D%2C%7B%22id%22%3A%22card_closed%22%7D%2C%7B%22id%22%3A%22card_postponed%22%7D%5D)** — Trend of `card_triaged`, `card_closed`, and `card_postponed`. Shows how actively users are moving work through their boards.
- **[Collaboration activity](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22comment_added%22%7D%5D)** — Trend of `comment_added` events. Indicates collaborative engagement.
- **[Account churn](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22account_cancelled%22%7D%5D)** — Trend of `account_cancelled` events. Critical churn signal to monitor.

You can create the dashboard at: **https://us.posthog.com/project/2/dashboard**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
