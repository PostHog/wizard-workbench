<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The integration covers both server-side event tracking (via `posthog-ruby` + `posthog-rails`) and client-side tracking (via the `posthog-js` snippet). Users are identified on sign-in and signup completion, so frontend and backend events are correlated through a shared `distinct_id` (the user's email address). Automatic exception capture and ActiveJob instrumentation are also enabled via `posthog-rails`.

## Changes made

| File | Change |
|------|--------|
| `Gemfile` | Added `posthog-ruby` and `posthog-rails` gems |
| `config/initializers/posthog.rb` | Created PostHog initializer with auto-exception capture, ActiveJob instrumentation, and user context |
| `app/models/user.rb` | Added `posthog_distinct_id` method (returns identity email address) |
| `app/controllers/application_controller.rb` | Added private `current_user` helper for posthog-rails user context |
| `app/views/layouts/shared/_head.html.erb` | Added posthog-js frontend snippet with `posthog.identify` for authenticated users |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | User initiated sign-up by submitting their email address | `app/controllers/signups_controller.rb` |
| `signup_completed` | User completed account setup with full name | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly signed out | `app/controllers/sessions_controller.rb` |
| `account_cancelled` | Account owner permanently deleted the account | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Admin deleted a board | `app/controllers/boards_controller.rb` |
| `card_created` | User created a new card via API | `app/controllers/cards_controller.rb` |
| `card_deleted` | User permanently deleted a card | `app/controllers/cards_controller.rb` |
| `card_closed` | User marked a card as closed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a closed card | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | User moved a card from triage into a column | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | User manually postponed a card to not-now | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `joined_via_invite` | User joined an account via join code | `app/controllers/join_codes_controller.rb` |

## Next steps

To complete setup, run `bundle install` to install the `posthog-ruby` and `posthog-rails` gems.

We recommend building an **Analytics basics** dashboard in PostHog with these five insights:

1. **Signup conversion funnel** — Funnel from `signed_up` → `signup_completed` → `signed_in`. Shows where users drop off in the onboarding flow.
2. **Daily active users** — Trend of unique users triggering `signed_in` over time. Core engagement metric.
3. **Card activity** — Stacked trend of `card_created`, `card_triaged`, and `card_closed`. Shows feature adoption and workflow throughput.
4. **Churn signals** — Trend of `account_cancelled` events over time. Early warning for retention problems.
5. **Collaboration** — Trend of `comment_created` and `joined_via_invite` events. Measures team engagement and growth.

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
