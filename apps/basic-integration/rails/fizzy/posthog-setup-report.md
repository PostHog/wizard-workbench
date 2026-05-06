<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a collaborative kanban project management application. Here's a summary of every change made:

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables
- **`config/initializers/posthog.rb`** — Created PostHog initializer with auto exception capture, ActiveJob instrumentation, and user context detection
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns identity email) and `posthog_properties` methods
- **`app/controllers/application_controller.rb`** — Added `current_user` helper delegating to `Current.user` for posthog-rails integration
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js frontend snippet with CSP nonce support and automatic user identification
- **`app/controllers/sessions/magic_links_controller.rb`** — Added `PostHog.identify` and `signed_in` event capture on successful magic link authentication
- **`app/controllers/signups/completions_controller.rb`** — Added `PostHog.identify` and `signed_up` event capture on account creation
- **`app/controllers/boards_controller.rb`** — Added `board_created` and `board_deleted` event capture
- **`app/controllers/boards/publications_controller.rb`** — Added `board_published` and `board_unpublished` event capture
- **`app/controllers/cards_controller.rb`** — Added `card_created` and `card_deleted` event capture
- **`app/controllers/cards/closures_controller.rb`** — Added `card_closed` and `card_reopened` event capture
- **`app/controllers/cards/not_nows_controller.rb`** — Added `card_postponed` event capture
- **`app/controllers/cards/triages_controller.rb`** — Added `card_triaged` event capture
- **`app/controllers/cards/comments_controller.rb`** — Added `comment_created` event capture
- **`app/controllers/account/cancellations_controller.rb`** — Added `account_cancelled` event capture (critical churn signal)

| Event | Description | File |
|---|---|---|
| `signed_up` | User completed signup and created a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | User created a new kanban board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deleted a board | `app/controllers/boards_controller.rb` |
| `board_published` | User published a board publicly | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | User removed public access from a board | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User created a new card | `app/controllers/cards_controller.rb` |
| `card_deleted` | User permanently deleted a card | `app/controllers/cards_controller.rb` |
| `card_closed` | User closed/completed a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postponed a card to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | User triaged a card into a column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancelled the account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Signup funnel** — Conversion funnel: `signed_up` → `board_created` → `card_created`
   [Create this insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

2. **New signups over time** — Trend of `signed_up` events
   [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

3. **Account cancellations (churn)** — Trend of `account_cancelled` events
   [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Card completion rate** — `card_closed` vs `card_created` over time
   [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **Daily active users** — Unique users triggering any event per day
   [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

[Go to PostHog dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
