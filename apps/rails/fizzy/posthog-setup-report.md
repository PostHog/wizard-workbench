<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Ruby on Rails project management application. Here is a summary of all changes made:

## Changes summary

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems (installed via `bundle add`).
- **`.env`** — Added `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables (`.gitignore` coverage ensured).
- **`config/initializers/posthog.rb`** *(new)* — PostHog initializer with `posthog-rails` auto-instrumentation: automatic exception capture, ActiveJob failure tracking, user context association, and Rails.error integration.
- **`app/models/user.rb`** — Added `posthog_distinct_id` (uses identity email address) and `posthog_properties` methods for automatic user association in error reports and identify calls.
- **`app/views/layouts/shared/_head.html.erb`** — Added `posthog-js` frontend snippet (with CSP nonce support) for pageview tracking, session replay, and client-side event capture. Automatically calls `posthog.identify()` when a user is logged in to correlate frontend and backend events.
- **15 controller files** — Backend event capture calls added (see table below).

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user completes signup via magic link flow | `app/controllers/sessions_controller.rb` |
| `signup_completed` | User finishes onboarding (full name provided, account created) | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User explicitly logs out | `app/controllers/sessions_controller.rb` |
| `team_member_joined` | User redeems a join code to join an account | `app/controllers/join_codes_controller.rb` |
| `board_created` | New board created | `app/controllers/boards_controller.rb` |
| `board_deleted` | Board deleted | `app/controllers/boards_controller.rb` |
| `board_published` | Board made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | Board's public access revoked | `app/controllers/boards/publications_controller.rb` |
| `card_created` | New card (task/issue) created | `app/controllers/cards_controller.rb` |
| `card_deleted` | Card permanently deleted | `app/controllers/cards_controller.rb` |
| `card_closed` | Card marked as closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Closed card reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | Card triaged into a column for the first time | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | Comment posted on a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels/deletes account (**churn event**) | `app/controllers/account/cancellations_controller.rb` |
| `data_export_started` | Admin initiates a data export | `app/controllers/account/exports_controller.rb` |

## Next steps

We've instrumented key events across the Fizzy application. Here are some suggested insights to build in your PostHog project:

### Suggested dashboard: "Analytics basics"

Visit your PostHog project to create a dashboard with these 5 insights:

1. **Signup → Activation funnel** — Funnel insight tracking `user_signed_up` → `signup_completed` → `card_created`. This measures how many new users progress from signing up to actively creating their first card.
   - [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up"},{"id":"signup_completed"},{"id":"card_created"}]})

2. **Daily active users (sign-ins)** — Trends insight on `user_signed_in` over time, showing daily/weekly engagement.
   - [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in"}]})

3. **Card activity breakdown** — Trends insight comparing `card_created`, `card_closed`, and `card_postponed` over time. Shows team productivity and how many cards are being resolved vs. deferred.
   - [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"card_created"},{"id":"card_closed"},{"id":"card_postponed"}]})

4. **Churn monitor** — Trends insight on `account_cancelled` over time. Keep this number low!
   - [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"account_cancelled"}]})

5. **Collaboration engagement** — Trends insight comparing `comment_added` and `team_member_joined` over time to track how teams are growing and collaborating.
   - [Create in PostHog →](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"comment_added"},{"id":"team_member_joined"}]})

[Go to PostHog Project →](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
