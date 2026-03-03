<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Ruby on Rails application. Here's what was set up:

**Dependencies** — Added `posthog-ruby` and `posthog-rails` gems to `Gemfile`. The `posthog-rails` gem provides automatic exception capture, ActiveJob instrumentation, and Rails error reporter integration on top of the Ruby SDK.

**Initializer** — Created `config/initializers/posthog.rb` with `PostHog.init` (reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment) and `PostHog::Rails.configure` with auto-capture of unhandled exceptions, rescued exceptions, and ActiveJob failures. User context is captured automatically from `current_user`.

**Environment** — `POSTHOG_API_KEY` and `POSTHOG_HOST` written to `.env`.

**User model** — Added `posthog_distinct_id` (returns `identity.email_address || id`) and `posthog_properties` methods to `User` so posthog-rails can associate errors with the correct user profile.

**ApplicationController** — Added a private `current_user` helper returning `Current.user` so posthog-rails auto-instrumentation can find the authenticated user.

**Frontend snippet** — Added posthog-js initialization to `app/views/layouts/shared/_head.html.erb`, including an `identify` call for authenticated sessions to correlate frontend and backend events via shared `distinct_id`.

**Event tracking** — 14 server-side events instrumented across 12 controller files covering the full user lifecycle.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New identity created via signup flow (magic link sent) | `app/controllers/signups_controller.rb` |
| `signup_completed` | User completes signup with full name; account created | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User authenticates via magic link; new session started | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User explicitly terminates session | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Board deleted by an admin | `app/controllers/boards_controller.rb` |
| `card_created` | Card created via JSON API | `app/controllers/cards_controller.rb` |
| `card_closed` | Card closed (completed) | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Closed card reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card manually postponed to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | Card moved from triage into a column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | Comment added on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels/deletes account (churn) | `app/controllers/account/cancellations_controller.rb` |
| `team_member_joined` | User redeems a join code and joins an account | `app/controllers/join_codes_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Analytics basics dashboard** — https://us.posthog.com/project/2/dashboard/1295697
  - *Signup to First Card Funnel* (https://us.posthog.com/project/2/insights/BJPcjsLy) — Conversion funnel: `user_signed_up` → `board_created` → `card_created`
  - *Churn Indicator - Account Cancellations* (https://us.posthog.com/project/2/insights/xfExrxR3) — Weekly `account_cancelled` events
  - *Card Lifecycle* (https://us.posthog.com/project/2/insights/t18Hsaa2) — `card_created`, `card_closed`, and `card_reopened` trends
  - *Feature Engagement* (https://us.posthog.com/project/2/insights/Q3S36ek6) — `board_created`, `card_created`, and collaboration activity
  - *User Authentication Activity* (https://us.posthog.com/project/2/insights/Gfw51sma) — `user_signed_up`, sign-in, and sign-out trends

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
