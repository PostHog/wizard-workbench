<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, the Rails-based kanban project management app. Here's a summary of all changes made:

**Gems added** (`Gemfile`): `posthog-ruby` and `posthog-rails` for server-side analytics and automatic error/exception capture.

**Environment variables** (`.env`): `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configured. `CSP_SCRIPT_SRC` and `CSP_CONNECT_SRC` extended to allow PostHog domains through the existing Content Security Policy.

**PostHog initializer** (`config/initializers/posthog.rb`): Initializes `PostHog.init` with env-var-based config, enables `auto_capture_exceptions`, `report_rescued_exceptions`, `auto_instrument_active_job`, and `capture_user_context` via `PostHog::Rails.configure`.

**User model** (`app/models/user.rb`): Added `posthog_distinct_id` (returns the user's identity email address) and `posthog_properties` for person identification.

**Application controller** (`app/controllers/application_controller.rb`): Added `current_user` helper method delegating to `Current.user`, required by `posthog-rails` for automatic user context on exceptions.

**Frontend snippet** (`app/views/layouts/shared/_head.html.erb`): Added `posthog-js` snippet with CSP nonce support. Automatically calls `posthog.identify()` with the current user's distinct ID when authenticated.

**Backend event tracking**: Added `PostHog.capture` (and `PostHog.identify` where appropriate) to 11 controller files covering all key business events.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User completed signup and created a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link and started a new session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User terminated their session | `app/controllers/sessions_controller.rb` |
| `account_cancelled` | Account owner cancelled and deleted the account (churn event) | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_published` | User published a board publicly | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User created a new card on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | User closed (completed) a card | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | User triaged a card into a column | `app/controllers/cards/triages_controller.rb` |
| `card_commented` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | User toggled assignment of a card to a team member | `app/controllers/cards/assignments_controller.rb` |
| `joined_via_invite` | User joined an account using an invite join code | `app/controllers/join_codes_controller.rb` |

## Next steps

Build an **Analytics basics** dashboard in PostHog with these recommended insights:

1. **Signup → First card funnel** — Track conversion from `signed_up` → `card_created` to measure time-to-value:
   https://us.posthog.com/project/2/insights/new?insight=FUNNELS

2. **Daily active users** — Trend of unique users firing any of the core events (`card_created`, `card_closed`, `card_commented`):
   https://us.posthog.com/project/2/insights/new?insight=TRENDS

3. **Churn events** — Trend of `account_cancelled` over time to spot spikes in cancellations:
   https://us.posthog.com/project/2/insights/new?insight=TRENDS

4. **Board adoption** — Trend of `board_created` events to track workspace growth:
   https://us.posthog.com/project/2/insights/new?insight=TRENDS

5. **Card completion rate** — `card_closed` divided by `card_created` to measure workflow health:
   https://us.posthog.com/project/2/insights/new?insight=TRENDS

Visit your PostHog dashboards: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
