# PostHog setup report

PostHog server-side analytics, user identification, Rails error tracking, product-event capture, and a starter dashboard were added to this Rails application.

## Installed and initialized

- `Gemfile` declares `posthog-ruby`, constrained to `~> 3.0`, and `posthog-rails`.
- `config/initializers/posthog.rb` requires both integrations and initializes the PostHog singleton from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- The initializer configures Rails exception capture, rescued-exception reporting, ActiveJob instrumentation, and authenticated-user context. Missing configuration is a production no-op and raises a descriptive error outside production.
- `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are present in `.env`; their names are documented in `.env.example`.
- No browser SDK was added.

## Events instrumented

These events were added to successful business-action paths. The run verified the capture call sites and event contract, but did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | Successful magic-link authentication | `app/controllers/sessions/magic_links_controller.rb` |
| `account_created` | Completed signup and account creation | `app/controllers/signups/completions_controller.rb` |
| `account_cancelled` | Account-owner cancellation | `app/controllers/account/cancellations_controller.rb` |
| `account_import_started` | Start of an account data import | `app/controllers/account/imports_controller.rb` |
| `account_export_started` | Start of an account data export | `app/controllers/account/exports_controller.rb` |
| `board_created` | Board creation | `app/controllers/boards_controller.rb` |
| `card_draft_started` | Start of card drafting | `app/controllers/cards_controller.rb` |
| `card_created` | Published card creation through the API | `app/controllers/cards_controller.rb` |
| `card_updated` | Saved card changes | `app/controllers/cards_controller.rb` |
| `card_deleted` | Card deletion | `app/controllers/cards_controller.rb` |
| `comment_created` | Comment creation on a card | `app/controllers/cards/comments_controller.rb` |

All captures use the stable `Current.identity.posthog_distinct_id`; event properties contain no PII. The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`.

## Identification

Identification was wired. `Identity#posthog_distinct_id` uses the stable identity UUID, and successful magic-link authentication calls `PostHog.identify` after the request establishes `Current.identity`. Rails automatic error context resolves the same identity through `ApplicationController#current_user`. Returning-session identification was not independently runtime-tested.

## Error tracking

`config/initializers/posthog.rb` already provides the reference-supported global Rails integration for uncaught controller exceptions, rescued exceptions, and ActiveJob failures through `auto_capture_exceptions`, `report_rescued_exceptions`, and `auto_instrument_active_job`. No duplicate manual exception handlers were added. Error delivery was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902671) is live with five tagged insights covering account creation, signup-to-board activation, collaboration activity, cancellations, and imports/exports. The insights intentionally use the instrumented event contract; event arrival was not verified during this run.

## What the run verified and did not verify

Verified: the edited source files and event plan were reviewed; event names are snake_case; captures are placed after successful mutations; identity wiring and initializer configuration match the supplied Rails pattern; the dashboard and five insights were created successfully.

Not verified: dependency resolution, Rails boot, production build, lint, tests, or actual event/error delivery. Bundler was unavailable (`bundle: command not found`), so `Gemfile.lock` was not regenerated. Runtime policy also blocked `bin/rails assets:precompile` and `bin/rubocop`; no tests ran. The run therefore proves code/configuration edits were made and reviewed, not that the application compiles or that PostHog receives data.

## Follow-up issues

- **Dependency and runtime verification unresolved:** `posthog-ruby` and `posthog-rails` are declared but absent from `Gemfile.lock`; Bundler, Rails build, lint, and tests could not run. Leaving this unresolved can prevent boot or expose incompatible gem/API assumptions.
- **Delivery unconfirmed:** no run step observed any instrumented event or error arrive in PostHog. Leaving this unresolved means dashboards may remain empty even though capture calls exist.
- **Browser attribution remains unresolved:** no browser SDK was installed, so browser-side identify/reset and frontend attribution are not implemented. This costs continuity between browser activity and server events if browser analytics is expected.

## Before you merge

- [ ] From `Gemfile:1-20`, run `bundle install` in an environment with Bundler, regenerate `Gemfile.lock`, and run the full production build; fix any generated-code lint or type errors.
- [ ] Run the full test suite, including the instrumented controller paths in `app/controllers/sessions/magic_links_controller.rb`, `app/controllers/signups/completions_controller.rb`, `app/controllers/account/cancellations_controller.rb`, `app/controllers/account/imports_controller.rb`, `app/controllers/account/exports_controller.rb`, `app/controllers/boards_controller.rb`, `app/controllers/cards_controller.rb`, and `app/controllers/cards/comments_controller.rb`; update mocks or fixtures as needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example:1-2` are configured in every deployment environment, not only local `.env`.
- [ ] Exercise a successful authenticated flow and confirm the events from the capture call sites arrive in PostHog with the stable identity; separately trigger a handled and unhandled failure to verify error delivery.
- [ ] Because the app ships a Content-Security-Policy in `config/initializers/content_security_policy.rb`, load the app and check the browser console for CSP violations if browser analytics is added later.
- [ ] Because authentication and identify are wired in `app/controllers/sessions/magic_links_controller.rb`, verify a returning authenticated session also identifies the existing stable identity rather than creating an anonymous distinct ID.
