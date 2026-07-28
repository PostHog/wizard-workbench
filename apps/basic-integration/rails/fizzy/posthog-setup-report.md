# PostHog setup report

PostHog backend analytics, user identification, automatic Rails error tracking, and a starter dashboard were configured for this Rails application.

## What was installed and initialized

- Added `posthog-ruby (~> 3.0)` and `posthog-rails` to `Gemfile`.
- Added a process-level initializer at `config/initializers/posthog.rb` using `POSTHOG_PROJECT_TOKEN` and optional `POSTHOG_HOST` from the environment; no token or host is hardcoded.
- Enabled `posthog-rails` automatic exception capture, rescued-exception reporting, ActiveJob failure instrumentation, and current-user context.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` documentation to `.env.example`; the real values were configured in `.env` during the run.

## Instrumented events

These are instrumented server-side events. The run did not observe any event arriving in PostHog, so this table describes code instrumentation, not confirmed ingestion.

| Event | What it measures | File |
|---|---|---|
| `signup_completed` | An authenticated identity completes account setup. | `app/controllers/signups/completions_controller.rb` |
| `account_cancelled` | An account owner permanently cancels an account. | `app/controllers/account/cancellations_controller.rb` |
| `board_created` | A user creates a board. | `app/controllers/boards_controller.rb` |
| `board_published` | An administrator publishes a board for public access. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | An administrator removes a board from public access. | `app/controllers/boards/publications_controller.rb` |
| `card_draft_started` | A user starts a new card draft from a board. | `app/controllers/cards_controller.rb` |
| `card_created` | A user creates a published card through the API. | `app/controllers/cards_controller.rb` |
| `card_published` | A user publishes a card draft. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | A user closes a card. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopens a closed card. | `app/controllers/cards/closures_controller.rb` |
| `comment_created` | A user posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |

The event call sites use the stable `Current.identity.posthog_distinct_id` and avoid putting PII in event properties. The review step added `defined?(PostHog)` guards around the 11 capture call sites so production can remain operational when configuration is intentionally absent.

## User identification

Identification was wired. `app/models/identity.rb` exposes the immutable identity primary key through `posthog_distinct_id` and person properties through `posthog_properties`. `app/controllers/application_controller.rb` exposes `Current.identity` as `current_user` for automatic context. Successful magic-link authentication calls `PostHog.identify` in `app/controllers/sessions/magic_links_controller.rb` (around line 47), after the session identity is established. No browser SDK or client-side identification was added.

## Error tracking

`config/initializers/posthog.rb` enables automatic controller exception capture, rescued-exception reporting, ActiveJob failure instrumentation, and current-user association. No manual exception wrappers were added. The run verified these settings in the initializer, but did not boot Rails or observe an error event arriving in PostHog.

## Dashboard

The dashboard **Analytics basics (wizard)** was created with five insights covering signup-to-board creation, core creation activity, publishing activity, account cancellations, and card lifecycle activity. It uses a rolling 30-day range and may initially show no data until events are ingested.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1919815)

## Unresolved issues and build conflict

- **Dependency resolution and verification remain unresolved.** `bundle add posthog-ruby posthog-rails` and later `bundle install` could not run because the environment had no `bundle` executable (`bundle: command not found`, exit 127). Consequently, no `Gemfile.lock` resolution, Rails boot, production build, test suite, or event-flow verification was completed. The runtime also rejected the attempted scoped `bin/rubocop` command before execution. Leaving this unresolved costs confidence that the declared gems resolve and that the app boots with the initializer.
- **Event delivery was not verified.** The run confirmed capture calls and the event plan, but did not trigger the application and did not observe events in PostHog. The dashboard therefore may remain empty until the deployment is exercised.

## Before you merge

- [ ] In an environment with Bundler available, run `bundle install` to resolve `posthog-ruby` and `posthog-rails` from `Gemfile`, then run the full production build and fix any introduced errors. Check `Gemfile:11-12`.
- [ ] Run the test suite and lint checks; instrumented call sites may require updated mocks or fixtures. Review the capture changes in `app/controllers/signups/completions_controller.rb:14`, `app/controllers/account/cancellations_controller.rb:5`, `app/controllers/boards_controller.rb:31`, `app/controllers/boards/publications_controller.rb:9,19`, `app/controllers/cards_controller.rb:17,27`, `app/controllers/cards/publishes_controller.rb:7`, `app/controllers/cards/closures_controller.rb:8,25`, and `app/controllers/cards/comments_controller.rb:15`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names documented in `.env.example` and consumed by `config/initializers/posthog.rb:1-2`.
- [ ] Exercise signup, board, card, comment, and cancellation flows in a configured environment and confirm the 11 named events appear in PostHog; otherwise the integration remains unconfirmed.
- [ ] Because authentication and identify are wired, verify a returning magic-link session also reaches `PostHog.identify` at `app/controllers/sessions/magic_links_controller.rb:47` so users do not fragment across anonymous IDs.
