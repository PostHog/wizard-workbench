# PostHog setup report

Server-side PostHog analytics, authenticated-user context, automatic Rails error tracking, 13 business-event captures, and a starter dashboard were configured for this Rails application.

## Installed and initialized

- `posthog-ruby` (`~> 3.21.0`) and `posthog-rails` were declared in `Gemfile`.
- `config/initializers/posthog.rb` initializes PostHog from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` and configures the Rails integration for uncaught exceptions, rescued exceptions, ActiveJob failures, and authenticated-user context.
- `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the real keys were confirmed present in `.env` without exposing their values.
- The initializer and event call sites use the class-level `PostHog` API. No PostHog client was constructed manually.

## Events instrumented

The run verified that these 13 event names are present in the event plan and in intended `PostHog.capture` call sites. The run did **not** observe events arriving in PostHog because the application could not be run or tested in this environment.

| Event | What it measures | File |
|---|---|---|
| `account_signed_up` | A new account is successfully created after signup completion. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | An authenticated user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | An authenticated user creates a card, including a draft started in the web interface. | `app/controllers/cards_controller.rb` |
| `card_published` | An authenticated user publishes a card. | `app/controllers/cards/publishes_controller.rb` |
| `comment_created` | An authenticated user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_closed` | An authenticated user closes a card. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | An authenticated user reopens a card. | `app/controllers/cards/closures_controller.rb` |
| `board_published` | An authenticated user makes a board publicly available. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | An authenticated user removes a board from public availability. | `app/controllers/boards/publications_controller.rb` |
| `account_cancelled` | An account owner cancels their account. | `app/controllers/account/cancellations_controller.rb` |
| `data_export_requested` | An authenticated user requests an export of their data. | `app/controllers/users/data_exports_controller.rb` |
| `access_token_created` | An authenticated identity creates a personal access token. | `app/controllers/my/access_tokens_controller.rb` |
| `access_token_revoked` | An authenticated identity revokes a personal access token. | `app/controllers/my/access_tokens_controller.rb` |

Event properties were reported as internal resource IDs, workflow state, or token permission; the run found no PII or secret values in event properties. Signup uses the newly created user because request-scoped `Current.user` is not established at that action.

## User identification

Identification was wired for server-side user context, not skipped. `app/models/user.rb` provides `posthog_distinct_id` from the stable primary key and person properties; `app/controllers/application_controller.rb` exposes the existing `Current.user` through `current_user`. This lets `posthog-rails` associate automatically captured errors with authenticated users. No browser SDK or browser identify/reset flow was added.

## Error tracking

`config/initializers/posthog.rb` enables global `posthog-rails` instrumentation for uncaught controller exceptions, rescued Rails exceptions, and ActiveJob failures, with current-user context. No manual exception wrappers were added. This setup was reviewed, but no exception was generated and no error event was observed during the run.

## Dashboard

PostHog created **Analytics basics (wizard)**, containing four tagged insights: account signups versus cancellations, workspace activity, signup-to-board activation, and publishing/sharing activity. The dashboard ID is `1914303`. The dashboard and insight definitions were created successfully, but they may remain empty until the application sends its first events. [Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1914303)

## What remains unverified

- No event delivery was observed.
- No runtime Rails boot, dependency resolution, build, lint, or test suite completed.
- The dashboard's charts were created, but their data population was not verified.

## Build conflict

Bundler is unavailable in the run environment: `bundle: command not found` (exit code 127). Consequently, `bundle add posthog-ruby` and `bundle install` could not resolve dependencies, `Gemfile.lock` could not be updated, and Rails build/lint verification could not run. The attempted `bin/rails zeitwerk:check` was blocked by the runtime command allowlist rather than executed. Run Bundler in a Bundler-enabled environment before relying on the integration.

## Before you merge

- [ ] Run `bundle install` in a Bundler-enabled environment and confirm `Gemfile.lock` includes `posthog-ruby` and `posthog-rails` (`Gemfile`).
- [ ] Run the full production build and fix any lint or type errors introduced by the integration, especially `config/initializers/posthog.rb` and the instrumented controllers.
- [ ] Run the test suite; update mocks or fixtures for the 13 `PostHog.capture` calls in the controllers listed above.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every deploy environment, not only `.env`; verify the names in `.env.example`.
- [ ] Exercise signup and the instrumented authenticated actions in a deployed or local app, then confirm the corresponding events arrive in PostHog and populate the dashboard.
- [ ] Trigger a representative controller/rescued exception and ActiveJob failure, then confirm error tracking arrives with the expected authenticated-user context.
- [ ] If the application uses a Content-Security-Policy, load the app and check the browser console for CSP violations; this run did not add a browser SDK or change CSP directives.
