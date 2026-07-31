# PostHog setup report

PostHog server-side analytics was configured for Rails with environment-based initialization, stable authenticated identities, twelve success-path events, automatic Rails error tracking, and a starter dashboard.

## What was installed and initialized

- `Gemfile` declares `posthog-ruby` and `posthog-rails`.
- `config/initializers/posthog.rb` initializes PostHog once using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with automatic exception capture, rescued-exception reporting, and ActiveJob instrumentation enabled.
- `.env.example` documents the required environment variable names, and the run confirmed both keys are present in the local `.env`.
- Authenticated identities use UUID-based stable distinct IDs. Magic-link sign-in identifies the `Identity`; completed signup identifies the account `User` and sets person properties. Custom backend captures explicitly pass the authenticated actor's stable `posthog_distinct_id`.
- No frontend SDK or browser logout/reset flow was added.

These files were reviewed after editing, but the run did not start the application or observe events arriving in PostHog. Therefore, event delivery and runtime initialization remain unconfirmed.

## Events instrumented

| Event | What it measures | Source file |
|---|---|---|
| `user_signed_in` | An identity successfully completes magic-link authentication. | `app/controllers/sessions/magic_links_controller.rb` |
| `account_signup_completed` | A newly authenticated identity finishes account signup. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a card through the web flow or JSON API. | `app/controllers/cards_controller.rb` |
| `card_comment_created` | A user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_closed` | A user closes a card. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopens a card. | `app/controllers/cards/closures_controller.rb` |
| `board_published` | An administrator publishes a board. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | An administrator unpublishes a board. | `app/controllers/boards/publications_controller.rb` |
| `account_export_requested` | An administrator or owner starts an account data export. | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | An account owner cancels the account. | `app/controllers/account/cancellations_controller.rb` |
| `webhook_activated` | An administrator activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |

The event plan and review confirm these twelve call sites exist. No event was observed arriving, so “instrumented” here does not mean “captured successfully.”

## Identification

Identification was wired, not skipped. The integration identifies the authenticated `Identity` after magic-link login and the completed account `User` after signup, using UUID-derived stable IDs. Automatic controller exception association also uses the configured Rails user context. A frontend identity/reset flow was not part of this server-side setup.

## Error tracking

`config/initializers/posthog.rb` enables `posthog-rails` automatic exception capture, rescued-exception reporting, and ActiveJob instrumentation. No manual exception wrappers were added. Runtime error delivery was not exercised in this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935665)

The dashboard contains five saved insights covering authentication/signups, boards/cards, card workflow, account/publishing operations, and signup-to-board-creation conversion. The insights use the twelve intended event names and may remain empty until traffic produces events.

## Build and dependency conflict

Bundler was unavailable in the execution environment. `bundle add posthog-ruby posthog-rails` and later `bundle install`/`bundle exec rubocop app/controllers/application_controller.rb` exited with status 127 and `/bin/bash: bundle: command not found`. As a result, the PostHog gems were declared in `Gemfile` but could not be installed or resolved into `Gemfile.lock`, and Rails build/lint verification could not run. `bin/rails` and `bin/rubocop` verification commands were also blocked by the runtime command allowlist. The initializer and event call sites therefore remain unverified at runtime.

## Next steps

1. In an environment with Bundler, run dependency installation and update `Gemfile.lock`.
2. Run the Rails production build/checks, lint, and test suite.
3. Deploy `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every environment; do not rely only on local `.env`.
4. Exercise login, signup, board/card, workflow, publishing, account, and webhook paths, then confirm the twelve events and distinct IDs appear in PostHog.
5. Open the dashboard and confirm its tiles populate with real traffic.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; inspect `Gemfile`, `config/initializers/posthog.rb`, and the instrumented controllers.
- [ ] Run the test suite; update mocks or fixtures for captures in `app/controllers/application_controller.rb` and the twelve controller call sites.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in each deploy environment, not only `.env`.
- [ ] Because the app ships a Content-Security-Policy, load the app and check the browser console for CSP violations; inspect `config/initializers/content_security_policy.rb` if frontend tracking is later added.
- [ ] If authentication is exercised in a browser, verify returning authenticated sessions still identify the same person; inspect `config/initializers/posthog.rb`, `app/controllers/application_controller.rb`, and the identity/login callers.
