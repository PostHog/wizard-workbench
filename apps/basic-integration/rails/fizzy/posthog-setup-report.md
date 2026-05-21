<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Ruby on Rails kanban-style project management app. Here is a summary of all changes made.

## What was added

- **`posthog-ruby` + `posthog-rails` gems** added to `Gemfile` and installed
- **`config/initializers/posthog.rb`** — PostHog initializer with automatic exception capture, ActiveJob instrumentation, and user context detection
- **`app/models/user.rb`** — `posthog_distinct_id` (returns identity email) and `posthog_properties` methods for user association in error reports
- **`app/controllers/application_controller.rb`** — `current_user` helper wiring `Current.user` into posthog-rails user context detection
- **`app/views/layouts/shared/_head.html.erb`** — posthog-js frontend snippet with automatic `identify()` call for authenticated users
- **`.env`** — `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables set
- **15 controllers** — `PostHog.capture` calls added at key business events (see table below)
- **Auth controllers** — `PostHog.identify` calls on login and signup completion to correlate frontend/backend events

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User initiated signup by submitting their email address | `app/controllers/signups_controller.rb` |
| `signup_completed` | User completed onboarding by providing their full name and an account was created | `app/controllers/signups/completions_controller.rb` |
| `logged_in` | User successfully authenticated via a magic link and a new session was started | `app/controllers/sessions/magic_links_controller.rb` |
| `logged_out` | User explicitly signed out and their session was terminated | `app/controllers/sessions_controller.rb` |
| `joined_via_invite` | User joined an account by redeeming a join code / invite link | `app/controllers/join_codes_controller.rb` |
| `board_created` | A new board was created within an account | `app/controllers/boards_controller.rb` |
| `board_published` | A board was published publicly (made accessible via a shareable link) | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card (task/issue) was created on a board | `app/controllers/cards_controller.rb`, `app/controllers/cards/publishes_controller.rb` |
| `card_triaged` | A card was triaged into a column for the first time | `app/controllers/cards/triages_controller.rb` |
| `card_closed` | A card was marked as closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A previously closed card was reopened | `app/controllers/cards/closures_controller.rb` |
| `card_comment_added` | A comment was posted on a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | A user was assigned to (or unassigned from) a card | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A card was marked as golden/high-priority | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | An account owner cancelled and deleted their account — a critical churn event | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've set up a foundation for tracking user behaviour in Fizzy. Create a new **"Analytics basics"** dashboard in PostHog and add these five insights to monitor critical business metrics:

1. **Signup conversion funnel** — Funnel: `signed_up` → `signup_completed` → `logged_in`
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Card creation trend** — Trends: `card_created` over time (daily/weekly)
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **User engagement mix** — Trends: `card_comment_added`, `card_assigned`, `card_gilded`, `card_closed` stacked
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Card workflow funnel** — Funnel: `card_created` → `card_triaged` → `card_closed` (measures how many cards complete the full workflow)
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

5. **Account churn** — Trends: `account_cancelled` over time (critical business health metric)
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[New dashboard →](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
