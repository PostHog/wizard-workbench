<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. Here is a summary of all changes made:

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems
- **config/initializers/posthog.rb** — Created the PostHog initializer with `PostHog.init` (credentials from env vars) and `PostHog::Rails.configure` for auto-exception capture, ActiveJob instrumentation, and user context association
- **app/models/user.rb** — Added `posthog_distinct_id` method returning the user's identity email address, enabling automatic user association in error reports
- **app/views/layouts/shared/_head.html.erb** — Added posthog-js snippet for frontend pageview tracking, session replay, and client-side identify (calls `posthog.identify` for authenticated users)
- **app/controllers/sessions/magic_links_controller.rb** — `PostHog.identify` + `user_signed_in` event on successful magic link authentication
- **app/controllers/signups/completions_controller.rb** — `PostHog.identify` + `user_signed_up` event when a user completes account creation
- **app/controllers/boards_controller.rb** — `board_created` event after a new board is created
- **app/controllers/cards_controller.rb** — `card_created` event after a card is created via the JSON API
- **app/controllers/cards/closures_controller.rb** — `card_closed` and `card_reopened` events
- **app/controllers/cards/triages_controller.rb** — `card_triaged` event when a card is moved from triage into a column
- **app/controllers/cards/not_nows_controller.rb** — `card_postponed` event when a card is sent to "not now"
- **app/controllers/cards/comments_controller.rb** — `comment_created` event after a comment is posted
- **app/controllers/account/cancellations_controller.rb** — `account_cancelled` event (fires before account deletion — critical churn signal)
- **app/controllers/account/exports_controller.rb** — `account_export_started` event

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | User completes account signup (sets name, account created) | `app/controllers/signups/completions_controller.rb` |
| `account_cancelled` | Account owner cancels (deletes) their account — churn event | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User publishes a new card (JSON API path) | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes (resolves) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Card moved from triage into a workflow column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | User explicitly postpones a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | Admin/owner initiates a data export | `app/controllers/account/exports_controller.rb` |

## Next steps

To complete the setup, create the following in your [PostHog project](https://us.posthog.com/project/2):

**Suggested "Analytics basics" dashboard insights:**

1. **Sign-up funnel** — Funnel from `user_signed_in` → `board_created` → `card_created` (measures activation)
2. **Daily active users** — Unique users triggering any event per day
3. **Card closure rate** — `card_closed` events over time (core product value delivery)
4. **Churn signal** — `account_cancelled` events — track with breakdown by account age
5. **Engagement depth** — `comment_created` events per user per week (collaboration metric)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
