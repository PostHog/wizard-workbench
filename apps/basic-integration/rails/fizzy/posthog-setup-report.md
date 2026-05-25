<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. Here's a summary of what was added:

**Gems installed**: `posthog-ruby` and `posthog-rails` added to `Gemfile`.

**Initializer created** (`config/initializers/posthog.rb`): Configures PostHog with automatic exception capture, ActiveJob instrumentation, and user context detection via the `current_user` helper.

**User model updated** (`app/models/user.rb`): Added `posthog_distinct_id` (returns identity email) and `posthog_properties` methods so `posthog-rails` auto-associates exceptions with the correct user.

**ApplicationController updated** (`app/controllers/application_controller.rb`): Added `current_user` helper that delegates to `Current.user`, enabling posthog-rails auto-instrumentation.

**Frontend snippet added** (`app/views/layouts/shared/_head.html.erb`): The posthog-js snippet is injected into the page `<head>`. When a user is authenticated, `posthog.identify()` is called automatically so frontend and backend events share the same `distinct_id`.

**Environment variables** set in `.env`: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

13 business-critical events are now tracked across 9 controller files:

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User submits email to begin signup (magic link sent) | `app/controllers/signups_controller.rb` |
| `account_created` | User completes signup by setting name; account is created | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User explicitly ends their session | `app/controllers/sessions_controller.rb` |
| `board_created` | A new board is created | `app/controllers/boards_controller.rb` |
| `board_published` | A board is published publicly | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card is created via the API | `app/controllers/cards_controller.rb` |
| `card_closed` | A card is closed / resolved | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | A card is triaged from inbox into a column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | A card is moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | A comment is added to a card | `app/controllers/cards/comments_controller.rb` |
| `user_joined_account` | A user joins an account via invite link | `app/controllers/join_codes_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

To get visibility into user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Signup → Account created funnel** — Funnel from `user_signed_up` → `account_created` to measure conversion rate of your signup flow.
2. **Daily active users (sign-ins)** — Trends of `user_signed_in` over time to track engagement.
3. **Cards created vs closed** — Compare `card_created` and `card_closed` trends to understand throughput.
4. **Churn tracking** — Trend of `account_cancelled` events to monitor churn.
5. **Collaboration depth** — Trend of `comment_added` events as a proxy for team engagement.

Visit [your PostHog project](https://us.posthog.com/project/2/dashboards) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
