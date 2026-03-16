<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Ruby on Rails application. The integration includes server-side event tracking via `posthog-ruby` and `posthog-rails`, automatic exception capture, ActiveJob instrumentation, user identification on sign-in and sign-up, and a frontend posthog-js snippet for pageview and session replay tracking.

## Summary of changes

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems.
- **config/initializers/posthog.rb** (new) — PostHog initialization with `PostHog.init` and `PostHog::Rails` auto-instrumentation (exception capture, ActiveJob, user context).
- **app/models/user.rb** — Added `posthog_distinct_id` (returns `identity.email_address`) and `posthog_properties` methods used for user identification and error context.
- **app/views/layouts/shared/_head.html.erb** — Added posthog-js snippet with CSP nonce support and automatic `posthog.identify()` call for authenticated users.
- **app/controllers/sessions/magic_links_controller.rb** — `PostHog.identify` + `user_signed_in` event on successful magic link authentication.
- **app/controllers/signups/completions_controller.rb** — `PostHog.identify` + `user_signed_up` event on signup completion.
- **app/controllers/boards_controller.rb** — `board_created` and `board_deleted` events.
- **app/controllers/cards_controller.rb** — `card_created` event (both HTML draft and JSON published paths).
- **app/controllers/cards/closures_controller.rb** — `card_closed` and `card_reopened` events.
- **app/controllers/cards/not_nows_controller.rb** — `card_postponed` event.
- **app/controllers/cards/triages_controller.rb** — `card_triaged` event.
- **app/controllers/cards/comments_controller.rb** — `comment_created` event.
- **app/controllers/account/exports_controller.rb** — `account_export_started` event.

## Events

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | A new user completed their account signup with name | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A new board was created by a user | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board was deleted by a user | `app/controllers/boards_controller.rb` |
| `card_created` | A new card was created on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | A card was marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A closed card was reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A card was moved to 'not now' / postponed | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A card was triaged into a board column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | A comment was posted on a card | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | An account data export was initiated | `app/controllers/account/exports_controller.rb` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with these suggested insights:

1. **Daily signups** — Trend of `user_signed_up` events over time to track growth
2. **Signup → first card funnel** — Funnel from `user_signed_up` → `card_created` to measure activation
3. **Card completion rate** — `card_closed` events as a proportion of `card_created` — a key retention signal
4. **Engagement: comments per user** — `comment_created` event count per user to identify power users
5. **Churn signal: cards postponed** — Trend of `card_postponed` events — rising postponements may indicate friction or overwhelm

Visit your PostHog project to build these: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
