# PostHog setup report

PostHog server-side analytics and Rails error tracking were configured, with 15 successful-action events instrumented and a starter dashboard created.

## What was installed and initialized

- `Gemfile` declares `posthog-ruby ~> 3.21.0` and `posthog-rails`.
- `config/initializers/posthog.rb` performs one process-wide `PostHog.init`, reading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment. The real values were confirmed present in `.env`; `.env.example` documents both names.
- Rails instrumentation enables automatic exception capture, rescued-exception reporting, ActiveJob instrumentation, and authenticated user context.
- No browser SDK was added, and the existing CSP was left unchanged.

The run did not observe events arriving in PostHog. The event list below is the instrumented plan, not proof of delivery.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `account_created` | An authenticated identity completes account setup. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user creates a board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a card through the HTML draft or JSON published flow. | `app/controllers/cards_controller.rb` |
| `card_published` | A user publishes a card. | `app/controllers/cards/publishes_controller.rb` |
| `comment_created` | A user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_closed` | A user closes a card. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopens a closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A user postpones a card. | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A user moves a card into a board column. | `app/controllers/cards/triages_controller.rb` |
| `card_assignment_changed` | A user toggles another member's assignment on a card. | `app/controllers/cards/assignments_controller.rb` |
| `card_self_assignment_changed` | A user toggles their own assignment on a card. | `app/controllers/cards/self_assignments_controller.rb` |
| `board_published` | An administrator publishes a board publicly. | `app/controllers/boards/publications_controller.rb` |
| `account_export_requested` | An administrator requests an account export. | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | An owner cancels an account. | `app/controllers/account/cancellations_controller.rb` |
| `webhook_activated` | An administrator activates a board webhook. | `app/controllers/webhooks/activations_controller.rb` |

All explicit captures use stable UUID-backed user identity and non-PII event properties. Assignment events intentionally describe toggles, so they can represent either adding or removing an assignment.

## User identification

Identification was wired for the Rails integration. `app/models/user.rb` exposes the stable UUID primary key through `posthog_distinct_id` and person properties separately; `app/controllers/application_controller.rb` exposes `Current.user` through `current_user`. Automatic Rails exception context and explicit captures therefore use the stable identity rather than an email address. No browser identify/reset flow was added because this is server-side only.

## Error tracking

`config/initializers/posthog.rb` enables automatic exception capture, rescued-exception reporting, ActiveJob failure instrumentation, and current-user context. No manual error boundary was added. This configuration was reviewed, but runtime exception delivery was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926635) contains three valid tiles: Account activity, Card workflow, and Account lifecycle. The dashboard is expected to render empty until events arrive; the run did not verify populated data.

## What the run verified—and did not

Verified: the changed files were reviewed for minimality, event names matched the 15-entry event contract, captures sit after successful domain actions, identity uses stable UUIDs, properties avoid PII, and the PostHog dashboard plus three insight tiles were created.

Not verified: dependency resolution, compilation, lint success, tests, runtime initialization, exception delivery, or event delivery. Bundler was unavailable (`bundle: command not found`), so `Gemfile.lock` could not be generated and `bundle install` plus `bundle exec rubocop config/initializers/posthog.rb` could not run. No tests were run.

## Unresolved issues

- **Dependency and build verification:** `posthog-ruby` and `posthog-rails` remain declared but unresolved in `Gemfile.lock`. If left unresolved, deployment/build dependency installation can fail and none of the instrumentation can run.
- **Dashboard data is unconfirmed:** the dashboard references planned events, but no event arrival was observed. If left unchecked, the dashboard may remain empty or reveal runtime/configuration issues only after deployment.
- **Insight creation transport conflict:** several parallel insight-create payloads were rejected by MCP JSON parsing; three valid tiles were still attached. The rejected attempts do not represent missing required coverage, but should be revisited if additional tiles are expected.

## Before you merge

- [ ] In a Ruby-provisioned environment, run dependency installation and a full production build; inspect `Gemfile` and `Gemfile.lock` (PostHog declarations and resolved versions) and fix any build errors.
- [ ] Run the test suite and update mocks or fixtures for captures at the call sites in `app/controllers/signups/completions_controller.rb`, `app/controllers/boards_controller.rb`, `app/controllers/cards_controller.rb`, and the other controller files listed above.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`.
- [ ] Exercise each successful action and verify the corresponding events arrive in PostHog with the stable UUID distinct ID; inspect the `PostHog.capture` calls in the listed controller files.
- [ ] Trigger an exception and an ActiveJob failure, then confirm error reports arrive; inspect the flags and user-context configuration in `config/initializers/posthog.rb`.
- [ ] Load the application with its existing CSP and check the browser console for violations; inspect `config/initializers/content_security_policy.rb` even though no browser SDK was added.
