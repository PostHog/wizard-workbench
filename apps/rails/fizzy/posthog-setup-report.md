<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. Server-side event tracking has been added across all critical user flows using the `posthog-rails` gem (which wraps `posthog-ruby`). The frontend `posthog-js` snippet is injected in the shared `<head>` partial — covering both the main and public layouts — and automatically calls `posthog.identify()` on every page load for authenticated users, linking frontend and backend events to the same person profile.

Auto-instrumentation is enabled for:
- **Unhandled controller exceptions** — captured automatically with user context
- **Rescued exceptions** (e.g. `ActiveRecord::RecordNotFound`) — also captured
- **ActiveJob failures** — background job errors reported with job class and queue info

User identity is anchored to `Identity#email_address`, the global cross-account identifier in Fizzy's multi-tenant architecture.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `account_signed_up` | New user completes signup with name and account creation | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deletes a board | `app/controllers/boards_controller.rb` |
| `card_created` | Card created via JSON API | `app/controllers/cards_controller.rb` |
| `card_closed` | User closes (resolves) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card moved to not-now (postponed) | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels their account | `app/controllers/account/cancellations_controller.rb` |

## Files modified

- **`Gemfile`** — added `posthog-ruby` and `posthog-rails` gems
- **`config/initializers/posthog.rb`** — new initializer with auto-instrumentation config
- **`.env`** — added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, `CSP_CONNECT_SRC`
- **`app/models/identity.rb`** — added `posthog_distinct_id` (returns `email_address`)
- **`app/models/user.rb`** — added `posthog_distinct_id` and `posthog_properties`
- **`app/controllers/application_controller.rb`** — added `current_user` alias for posthog-rails
- **`app/views/layouts/shared/_head.html.erb`** — posthog-js snippet + auto-identify call

## Next steps

We've set up the events for you to build insights and a dashboard in PostHog. Here are the recommended insights to create for your "Analytics basics" dashboard:

1. **Signup funnel** — Steps: `user_logged_in` → `account_signed_up`. Measures how many users who log in complete full account setup.
   Create: https://us.posthog.com/project/2/insights/new?insight=FUNNELS

2. **New signups over time** — Trend of `account_signed_up` events. Track growth.
   Create: https://us.posthog.com/project/2/insights/new?insight=TRENDS

3. **Card activity** — Trend showing `card_created`, `card_closed`, and `card_postponed` over time. Measures team productivity.
   Create: https://us.posthog.com/project/2/insights/new?insight=TRENDS

4. **Churn events** — Trend of `account_cancelled`. Track and investigate spikes.
   Create: https://us.posthog.com/project/2/insights/new?insight=TRENDS

5. **Engagement funnel** — Steps: `board_created` → `card_created` → `comment_created`. Measures depth of product adoption.
   Create: https://us.posthog.com/project/2/insights/new?insight=FUNNELS

Dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
