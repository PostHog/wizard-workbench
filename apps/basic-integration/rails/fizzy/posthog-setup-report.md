# PostHog setup report

PostHog server-side analytics and Rails error tracking were added, with 14 business events instrumented and a starter dashboard created.

## What was set up

- **Installed:** `posthog-ruby` and `posthog-rails` were declared in `Gemfile`.
- **Initialized:** `config/initializers/posthog.rb` performs one process-wide `PostHog.init` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. In production, missing configuration logs a disabled warning; outside production, missing configuration raises an actionable error.
- **Environment:** `.env.example` documents the required variable names, and the run confirmed both variables are present in the local `.env`. Deploy environments still need their own configuration.
- **Scope:** This is server-side Rails instrumentation. No browser SDK was added, so no CSP changes were required.

## Events instrumented

These are implemented call sites recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified that each planned event has a corresponding capture call; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `signup_completed` | A newly created account is completed successfully. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user creates a board. | `app/controllers/boards_controller.rb` |
| `board_updated` | A user saves changes to a board. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A user deletes a board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a card. | `app/controllers/cards_controller.rb` |
| `card_updated` | A user saves changes to a card. | `app/controllers/cards_controller.rb` |
| `card_deleted` | A user deletes a card. | `app/controllers/cards_controller.rb` |
| `comment_created` | A user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `board_published` | A user publishes a board for public access. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A user removes a board from public access. | `app/controllers/boards/publications_controller.rb` |
| `account_canceled` | An account owner cancels their account. | `app/controllers/account/cancellations_controller.rb` |
| `join_code_redeemed` | A person successfully joins an account using a join code. | `app/controllers/join_codes_controller.rb` |
| `webhook_activated` | An administrator activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |
| `card_published` | A user publishes a card. | `app/controllers/cards/publishes_controller.rb` |

Captures use stable authenticated or newly created user IDs and avoid PII in event properties. The magic-link completion path was intentionally not captured because it lacks one account-scoped `Current.user`; subscription checkout and import/export flows were also left for follow-up.

## Identification and error tracking

User identification **was wired** for signup completion with `PostHog.identify`, using the stable user ID and `User#posthog_properties` for person properties. Rails request context exposes `Current.user` through `ApplicationController#current_user`, allowing automatic exception context to use `posthog_distinct_id`. No browser identify/reset flow exists because there is no browser SDK. The returning-visitor/authentication path was not fully wired with an explicit identify call; the magic-link path remains unresolved.

`posthog-rails` automatic exception capture, rescued-exception reporting, ActiveJob instrumentation, and authenticated user context are enabled in `config/initializers/posthog.rb`. The run did not trigger an exception or observe an error event in PostHog, so delivery remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924709) was created in PostHog project 483112 with four saved insights: signup completions, board and card activity, signup-to-first-board funnel, and account cancellations. The definitions were created successfully; the run did not wait for event ingestion, so populated results are unconfirmed.

## What the run verified—and did not

**Verified:** the files and event plan were reviewed; every planned event has a matching capture call; the dashboard and four insights were successfully created; the local environment contains both required PostHog variable keys; and the integration review found no unrelated changes.

**Not verified:** dependency resolution, application boot, production build, lint, tests, event delivery, error delivery, or dashboard data population. No PostHog event arrival was observed.

## Build and dependency conflict

Bundler is unavailable in the execution environment. `bundle add posthog-ruby` and `bundle install` failed with `/bin/bash: bundle: command not found`, leaving `Gemfile.lock` without resolved `posthog-ruby` or `posthog-rails` specs. `bin/rails zeitwerk:check` and targeted `bin/rubocop` verification were rejected by the runtime command allowlist and therefore were not executed. A Ruby environment with Bundler must resolve and lock both gems before the application can be considered build-ready.

## Unresolved issues and cost if left alone

1. **Dependencies are unresolved.** `Gemfile` declares the gems, but `Gemfile.lock` does not. Until Bundler resolves them, the app may not boot with the initializer or event calls, so analytics and automatic error tracking cannot run.
2. **Event and error delivery are unconfirmed.** The run verified code placement only. Without exercising the flows and checking PostHog, event funnels, dashboard tiles, and exception tracking may remain empty or misconfigured.
3. **Magic-link attribution is unresolved.** The authentication completion path has no single account-scoped user, so no event was captured there. Adding an event without choosing a stable account/user attribution could create misleading authentication analytics.
4. **Follow-up product coverage is unresolved.** Subscription checkout and import/export flows were intentionally omitted; their conversion or operational activity will not appear in this dashboard.

## Before you merge

- [ ] Run Bundler in a Ruby environment with the required toolchain, resolve `posthog-ruby` and `posthog-rails`, and commit the resulting `Gemfile.lock` entries; inspect `Gemfile` around the PostHog declarations.
- [ ] Run a full production build and fix any errors introduced by the integration; the relevant initialization is in `config/initializers/posthog.rb`.
- [ ] Run the test suite, including mocks or fixtures for the instrumented controllers listed in `.posthog-wizard-cache/.posthog-events.json`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in each deployment environment, matching `.env.example` and the reads in `config/initializers/posthog.rb`—not only in local `.env`.
- [ ] Exercise signup and each instrumented business flow, then confirm the corresponding events arrive in PostHog with stable distinct IDs and that the dashboard populates.
- [ ] Trigger a controlled controller or ActiveJob exception and confirm automatic error capture reaches PostHog with user context when authenticated; inspect `config/initializers/posthog.rb` and `app/models/user.rb`.
- [ ] Decide how magic-link completion should be attributed before adding or relying on authentication analytics; inspect the authentication completion controller and the current-user wiring in `app/controllers/application_controller.rb`.
- [ ] If returning authenticated sessions need explicit person identification, add and verify an identify call at the appropriate authentication/account-selection point; inspect `app/controllers/application_controller.rb` and the authentication flow.
- [ ] If the app later adds browser tracking, recheck the CSP initializer for PostHog script, connect, and worker directives; no browser SDK was added in this run.
