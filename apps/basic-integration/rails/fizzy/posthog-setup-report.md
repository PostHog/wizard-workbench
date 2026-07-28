# PostHog setup report

PostHog server-side analytics was added to the Rails application with environment-backed initialization, stable authenticated identities, ten business-event captures, global Rails error tracking, and a starter dashboard.

## What was installed and initialized

- `Gemfile` declares `posthog-ruby (~> 3.21)` and `posthog-rails`.
- The required `bundle add posthog-ruby` / Bundler workflow could not complete because Bundler is unavailable in the environment. The declarations were added as the documented fallback, but neither lockfile was updated.
- `config/initializers/posthog.rb` initializes the class-level PostHog client only when `ENV["POSTHOG_PROJECT_TOKEN"]` is configured. The host is read from `ENV["POSTHOG_HOST"]` when present; no host or token is hardcoded in source.
- The initializer enables `posthog-rails` automatic exception capture, rescued-exception reporting, ActiveJob instrumentation, and authenticated user context.
- `.env.example` documents `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; the real values were configured through the wizard environment tooling.

## Events instrumented

These ten events were added to successful server-side application paths. The run verified their call sites and event contract, but did **not** observe any events arriving in PostHog because dependencies could not be installed and no runtime exercise was completed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A user successfully completes magic-link authentication. | `app/controllers/sessions/magic_links_controller.rb` |
| `signup_completed` | A new account setup is successfully completed. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a published card through the JSON API. | `app/controllers/cards_controller.rb` |
| `comment_created` | A user posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `board_published` | A user publishes a board for public access. | `app/controllers/boards/publications_controller.rb` |
| `webhook_activated` | A user activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |
| `account_export_requested` | An administrator or owner requests an account export. | `app/controllers/account/exports_controller.rb` |
| `account_import_started` | A user creates an account and starts an import. | `app/controllers/account/imports_controller.rb` |
| `account_cancelled` | An account owner cancels the account. | `app/controllers/account/cancellations_controller.rb` |

All captures use the stable persisted `Identity#id` through `posthog_distinct_id`. Event properties were reviewed as non-PII operational metadata. The HTML card-creation path creates a draft, so `card_created` intentionally covers the JSON published-card path only.

## User identification

Identification was wired, not skipped. `Identity#posthog_distinct_id` uses the persisted identity primary key, while email is sent as a person property through `posthog_properties`, not as an event property. The magic-link sign-in path calls `PostHog.identify` after the authenticated session is established and emits `user_signed_in` afterward. `ApplicationController#current_user` resolves to `Current.identity` so automatic exception context can associate authenticated errors with that identity.

The run verified the code paths and stable-ID usage by review, but did not verify a live identify call or event delivery in PostHog.

## Error tracking

Global `posthog-rails` instrumentation is enabled in `config/initializers/posthog.rb` for uncaught controller exceptions, rescued Rails exceptions, and ActiveJob failures. Authenticated user context is enabled. No manual per-controller exception wrappers were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918309)

The dashboard was created in PostHog with five insights covering signup/sign-in activity, board creation, content creation, board activation, and account lifecycle signals. The dashboard exists and its tiles were returned by PostHog; the run did not verify that the newly instrumented events have populated those insights.

## Unresolved issue

**Dependency resolution and runtime verification remain unresolved.** Bundler was unavailable, so `bundle install`, lockfile updates, the Rails check, and RuboCop verification could not be completed. Leaving this unresolved means the declared SDK dependencies may not be installed or loadable in deployment, and event, identify, and error delivery remain unconfirmed.

## Before you merge

- [ ] In an environment with Bundler available, run `bundle install` and commit the resulting `Gemfile.lock` (and any applicable lockfile updates); inspect `Gemfile` and both lockfiles.
- [ ] Run the full production build/startup checks and fix any Rails or lint errors introduced by the integration; review `config/initializers/posthog.rb` and every instrumented controller listed above.
- [ ] Run the test suite, updating mocks or fixtures for the new PostHog initialization, identify call, and captures as needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every deploy environment, not only locally; the exact names are documented in `.env.example`.
- [ ] Because the app ships a Content-Security-Policy, load the app and check the browser console for CSP violations; server-side instrumentation was added and no browser SDK/CSP change was made.
- [ ] Exercise authenticated sign-in and each instrumented success path in a configured environment, then confirm the corresponding events, identify/person profile, and error-tracking records arrive in PostHog.
- [ ] Confirm the returning authenticated-session path preserves the same stable identity and does not fragment users onto anonymous distinct IDs.
