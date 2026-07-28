# PostHog setup report

PostHog backend analytics, user identification, automatic Rails error tracking, and a starter dashboard were wired into the Fizzy Rails application; runtime delivery remains unverified.

## What was installed and initialized

- `Gemfile` declares `posthog-ruby` 3.21.x (required as `posthog`) and `posthog-rails` (Gemfile lines 31–32).
- Bundler was unavailable during this run (`bundle: command not found`), so the gems were not installed and `Gemfile.lock` was not updated.
- `config/initializers/posthog.rb` reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. When both are present it calls `PostHog.init` and configures `posthog-rails` for uncaught exceptions, rescued exceptions, ActiveJob failures, and current-user context (initializer lines 1–15).
- In local environments, a missing variable raises an explicit error; production remains a no-op when configuration is absent (initializer lines 16–20).
- `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (lines 2–3). The run's environment check confirmed both keys are configured, without exposing their values.

## Events instrumented

These 15 lower-snake-case events were added to successful backend state changes. The run verified the call sites and event definitions, but did **not** observe any event arrive in PostHog because the app was not run and the dependencies were not installed.

| Event | What it measures | Instrumented file |
|---|---|---|
| `user_signed_in` | Authentication completed through a magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `session_transferred` | An authenticated session is transferred to a new device | `app/controllers/sessions/transfers_controller.rb` |
| `signup_completed` | A new account signup is completed | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A workspace board is created | `app/controllers/boards_controller.rb` |
| `card_created` | A published card is created through the API | `app/controllers/cards_controller.rb` |
| `comment_created` | A comment is added to a card | `app/controllers/cards/comments_controller.rb` |
| `card_closed` | A card is closed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_assignment_changed` | A card assignment is toggled successfully | `app/controllers/cards/assignments_controller.rb` |
| `card_published` | A drafted card is published | `app/controllers/cards/publishes_controller.rb` |
| `board_published` | A board is made public | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A public board is made private | `app/controllers/boards/publications_controller.rb` |
| `account_export_requested` | An account data export is requested | `app/controllers/account/exports_controller.rb` |
| `account_import_started` | An account import is started | `app/controllers/account/imports_controller.rb` |
| `account_cancelled` | An account owner cancels the account | `app/controllers/account/cancellations_controller.rb` |

## Identification

Identification was wired, not skipped. `Identity` and `User` expose stable UUID-based `posthog_distinct_id` values and person properties. The application identifies users after magic-link sign-in, session transfer, and signup completion, and request-boundary identification is available through `ApplicationController`. Event captures explicitly pass the stable identity. No browser SDK or browser reset flow was added.

The run did not execute the application, so it did not verify that identify calls or captured events reach PostHog. The identity design assumes `Current.user` and `Current.identity` are populated at the documented call sites.

## Error tracking

`posthog-rails` automatic instrumentation is configured in `config/initializers/posthog.rb` for controller exceptions, rescued Rails exceptions, ActiveJob failures, and current-user context. No duplicate manual exception handlers were added. The run verified the initializer configuration only; it did not boot Rails or observe an error report in PostHog.

## Dashboard

[Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918913)

The dashboard was created with five wizard-tagged insight tiles covering signup funnel, collaboration activity, content lifecycle, sharing changes, and account workflows. The dashboard and tile creation responses were successful. It is expected to remain empty until instrumented events are actually delivered.

## Unresolved issues and build conflict

- **Dependency and verification block:** Bundler was unavailable (`bundle: command not found`, exit 127). Consequently, `posthog-ruby` and `posthog-rails` could not be installed, `Gemfile.lock` could not be updated, `bundle install` could not complete, scoped `bundle exec rubocop` could not run, and no build, boot, or test verification was possible. Leaving this unresolved prevents confirming that the initializer loads and that capture/identify calls execute.
- **Runtime delivery unconfirmed:** The run inspected code and event definitions only. It did not exercise the application or observe any event or error arrive in PostHog, so analytics flow, error reporting, and dashboard population remain unconfirmed.

## Next steps

1. In an environment with Bundler available, run `bundle install` and commit the resulting `Gemfile.lock` changes.
2. Run the application's production build/boot checks, scoped RuboCop, and test suite.
3. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deploy environment using the names documented in `.env.example`.
4. Exercise sign-in, signup, board/card/comment, publication, account export/import, and cancellation paths in a safe environment; confirm the corresponding events appear in PostHog with stable distinct IDs and non-PII event properties.
5. Trigger a representative controller or ActiveJob failure and confirm the automatic error report appears in PostHog with user context.
6. Review the [Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918913) after events arrive.

## Before you merge

- [ ] Run the full production build and fix any errors introduced by the integration (`Gemfile` lines 31–32; `config/initializers/posthog.rb` lines 1–22).
- [ ] Run the test suite and update mocks or fixtures for the instrumented controller call sites (`app/controllers/sessions/magic_links_controller.rb`, `app/controllers/sessions/transfers_controller.rb`, `app/controllers/signups/completions_controller.rb`, `app/controllers/boards_controller.rb`, `app/controllers/cards_controller.rb`, `app/controllers/cards/comments_controller.rb`, `app/controllers/cards/closures_controller.rb`, `app/controllers/cards/assignments_controller.rb`, `app/controllers/cards/publishes_controller.rb`, `app/controllers/boards/publications_controller.rb`, `app/controllers/account/exports_controller.rb`, `app/controllers/account/imports_controller.rb`, and `app/controllers/account/cancellations_controller.rb`; inspect each `PostHog.capture` call).
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in deploy environments, not only locally (`.env.example` lines 2–3 and `config/initializers/posthog.rb` lines 1–3).
- [ ] If authentication tests cover returning sessions, confirm they continue to identify the stable user rather than creating anonymous fragments (`app/controllers/application_controller.rb`, `app/controllers/sessions/magic_links_controller.rb`, `app/controllers/sessions/transfers_controller.rb`, and `app/controllers/signups/completions_controller.rb`; inspect the identification calls).
