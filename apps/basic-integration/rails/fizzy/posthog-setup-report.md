<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, the collaborative project management app. The integration covers backend event tracking via `posthog-rails`, frontend pageview and session replay tracking via `posthog-js`, user identification across both layers, and automatic exception capture.

## Changes made

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems
- **config/initializers/posthog.rb** (new) — Initializes PostHog with env vars; enables auto exception capture, rescued exception reporting, ActiveJob instrumentation, and user context capture
- **app/models/user.rb** — Added `posthog_distinct_id` (returns identity email) and `posthog_properties` methods for automatic user association in error reports
- **app/controllers/application_controller.rb** — Added `current_user` helper delegating to `Current.user` so posthog-rails can auto-detect the user in controllers
- **app/views/layouts/shared/_head.html.erb** — Added posthog-js snippet with CSP nonce; calls `posthog.identify()` for authenticated users so frontend and backend events share the same distinct_id
- **10 controllers** — Added `PostHog.capture` calls (see table below); login and signup controllers also call `PostHog.identify`
- **.env** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user completes account creation | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deletes a board | `app/controllers/boards_controller.rb` |
| `card_created` | Card created directly via API | `app/controllers/cards_controller.rb` |
| `card_closed` | Card is closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Card moved from triage into a column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | Card moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels their account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

The PostHog MCP did not have sufficient API scopes to create the dashboard automatically. To create an **"Analytics basics"** dashboard manually, navigate to [Dashboards](/dashboard) and add these insights:

1. **Signup funnel** — Funnel from `user_signed_up` → `board_created` → `card_created` to measure onboarding conversion
2. **Daily active users** — Trends chart of `user_logged_in` over time
3. **Card completion rate** — Trends of `card_closed` vs `card_created` over the same period
4. **Postponement rate** — Trends of `card_postponed` to monitor task deferral patterns
5. **Churn** — Trends of `account_cancelled` to track cancellations over time

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
