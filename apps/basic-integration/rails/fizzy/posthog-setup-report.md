<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The following changes were made:

- Added `posthog-ruby` and `posthog-rails` gems to the Gemfile
- Created `config/initializers/posthog.rb` with `PostHog.init` and `PostHog::Rails` configuration, including automatic exception capture, ActiveJob instrumentation, and user context detection
- Added `posthog_distinct_id` and `posthog_properties` methods to the `User` model (uses `identity.email_address` as the globally unique identifier)
- Added a `current_user` helper to `ApplicationController` for posthog-rails auto-instrumentation
- Added the posthog-js frontend snippet (with CSP nonce) to `app/views/layouts/shared/_head.html.erb`, which is shared by all layouts. Authenticated users are automatically identified on each page load.
- Updated `config/initializers/content_security_policy.rb` to allow `*.posthog.com` in `script-src` and `connect-src`
- Instrumented 17 business events across 11 controller files (see table below)
- Added `PostHog.identify` calls at sign-in and signup completion to associate events with the correct person profile
- Environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) written to `.env`

| Event | Description | File |
|-------|-------------|------|
| `signed_up` | A new user identity was created via the signup flow | `app/controllers/signups_controller.rb` |
| `signup_completed` | User completed account setup (name + account created) | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User explicitly signed out | `app/controllers/sessions_controller.rb` |
| `join_code_redeemed` | User joined an account via invite link | `app/controllers/join_codes_controller.rb` |
| `board_created` | A new board was created | `app/controllers/boards_controller.rb` |
| `board_deleted` | A board was permanently deleted | `app/controllers/boards_controller.rb` |
| `board_published` | A board was made publicly accessible | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A board's public access was revoked | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A new card was created on a board | `app/controllers/cards_controller.rb` |
| `card_closed` | A card was marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A closed card was reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A card was moved to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_comment_created` | A comment was added to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner cancelled their account | `app/controllers/account/cancellations_controller.rb` |
| `account_export_started` | An account data export was initiated | `app/controllers/account/exports_controller.rb` |
| `account_import_started` | An account data import was initiated | `app/controllers/account/imports_controller.rb` |

## Next steps

An "Analytics basics" dashboard was not automatically created because the PostHog API key lacks the required `query:read`, `insight:write`, and `dashboard:write` scopes. You can create it manually in PostHog with these recommended insights:

1. **Signup funnel** — Funnel from `signed_up` → `signup_completed` → `board_created`. Tracks how many new users complete onboarding and create their first board.

2. **Daily active signins** — Trends chart of `signed_in` over time. Shows engagement and growth.

3. **Card lifecycle** — Trends chart comparing `card_created`, `card_closed`, and `card_postponed`. Reveals throughput and how effectively teams complete work.

4. **Churn signal** — Trends chart of `account_cancelled`. Essential for monitoring retention.

5. **Collaboration activity** — Trends chart of `card_comment_created` and `join_code_redeemed`. Measures team collaboration depth.

Create these at [PostHog Insights](/insights) and add them to a new [Dashboard](/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
