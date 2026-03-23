<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Ruby on Rails application. This includes server-side event tracking via `posthog-ruby` and `posthog-rails`, client-side pageview and session tracking via `posthog-js`, automatic exception capture, user identification, and CSP configuration for the PostHog asset domain.

## Summary of changes

- **`Gemfile`** — Added `posthog-ruby` and `posthog-rails` gems.
- **`config/initializers/posthog.rb`** (new) — Initializes PostHog with env-var-based config; enables auto-exception capture, ActiveJob instrumentation, and user context association via `posthog-rails`.
- **`app/controllers/application_controller.rb`** — Added private `current_user` helper (delegates to `Current.user`) so `posthog-rails` can auto-associate errors with the authenticated user.
- **`app/models/user.rb`** — Added `posthog_distinct_id` (returns `identity.email_address`) and `posthog_properties` helpers.
- **`app/views/layouts/shared/_head.html.erb`** — Added posthog-js snippet (with CSP nonce, conditional on env var, with user `identify` call on page load).
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, and `CSP_CONNECT_SRC`.
- **7 controllers** — Added targeted `PostHog.capture` calls for 10 business events (see table below).

## Events tracked

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | New user completes account signup | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `card_created` | User creates a new card (draft or published) | `app/controllers/cards_controller.rb` |
| `card_closed` | Card is marked as closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | Card is moved from triage into a column | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | User adds a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `account_export_started` | Admin/owner initiates an account data export | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | Account owner cancels their account (churn event) | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've set up the foundations. Visit your PostHog project to build insights and a dashboard based on these events:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard) — Create a new "Analytics basics" dashboard
- [New Insight — Signup funnel](https://us.posthog.com/project/238460/insights/new) — Recommended: funnel `user_signed_up` → `board_created` → `card_created`
- [New Insight — Daily sign-ins](https://us.posthog.com/project/238460/insights/new) — Trend of `user_signed_in` over time
- [New Insight — Card activity](https://us.posthog.com/project/238460/insights/new) — `card_created`, `card_closed`, `card_triaged` trend
- [New Insight — Churn watch](https://us.posthog.com/project/238460/insights/new) — `account_cancelled` over time (high-priority churn signal)
- [Error tracking](https://us.posthog.com/project/238460/error_tracking) — `posthog-rails` is configured for automatic unhandled exception capture

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
