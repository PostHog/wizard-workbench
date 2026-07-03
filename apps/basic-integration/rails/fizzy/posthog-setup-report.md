<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Ruby on Rails kanban application. The integration uses `posthog-ruby` for server-side event capture and `posthog-rails` for automatic exception tracking and ActiveJob instrumentation. A `posthog-js` snippet was added to the application layout for client-side session replay and pageview tracking. Users are identified on login via their Identity ID as the distinct_id.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes account signup with their name. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Fired when a user successfully authenticates via magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | Fired when a user creates a new board. | `app/controllers/boards_controller.rb` |
| `board_published` | Fired when a board is published publicly with a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_published` | Fired when a card is published from draft status onto a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fired when a card is marked as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a previously closed card is reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_comment_created` | Fired when a user posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `card_triaged` | Fired when a card is moved from triage into a board column. | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | Fired when a card is moved to the 'not now' postpone state. | `app/controllers/cards/not_nows_controller.rb` |
| `card_gilded` | Fired when a card is marked as golden/high-priority. | `app/controllers/cards/goldnesses_controller.rb` |
| `card_assigned` | Fired when a user is assigned to or unassigned from a card. | `app/controllers/cards/assignments_controller.rb` |
| `account_cancelled` | Fired when an account owner cancels and deletes their account. | `app/controllers/account/cancellations_controller.rb` |
| `import_started` | Fired when a user starts importing data into a new account. | `app/controllers/account/imports_controller.rb` |

## Other changes

- `Gemfile` — added `posthog-ruby` and `posthog-rails` gems
- `config/initializers/posthog.rb` — created with `PostHog.init` and `PostHog::Rails.configure` (auto-capture exceptions, ActiveJob instrumentation, user context)
- `app/models/user.rb` — added `posthog_distinct_id` and `posthog_properties` methods
- `app/controllers/application_controller.rb` — added `current_user` helper delegating to `Current.user` for posthog-rails auto-instrumentation
- `app/views/layouts/shared/_head.html.erb` — added posthog-js snippet with CSP nonce and per-user `posthog.identify()` call
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793526)
- [Onboarding Funnel](https://us.posthog.com/project/483112/insights/yRt5GN2a) — Signup → Board created → Card published conversion funnel
- [Daily Active Users](https://us.posthog.com/project/483112/insights/t6CFYiIh) — Unique users logging in per day
- [Card Completion Rate](https://us.posthog.com/project/483112/insights/UYHyGnuJ) — Closed cards as a percentage of published cards
- [Account Churn](https://us.posthog.com/project/483112/insights/D4ZawRoO) — Account cancellations over time
- [User Engagement Activity](https://us.posthog.com/project/483112/insights/qX50yqHA) — Comments, assignments, and gilded cards

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current `posthog.identify()` in the layout fires on every authenticated page load, which covers returning sessions, but verify this works end-to-end after login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
