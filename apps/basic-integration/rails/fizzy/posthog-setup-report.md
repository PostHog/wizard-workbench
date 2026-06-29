<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Rails-based kanban project management application. The integration includes server-side event tracking via `posthog-ruby` + `posthog-rails`, client-side session replay and pageview tracking via the `posthog-js` browser snippet, automatic exception capture for unhandled controller errors and ActiveJob failures, and user identification tied to the magic-link authentication system.

**Key changes:**
- Added `posthog-ruby` and `posthog-rails` gems to the Gemfile
- Created `config/initializers/posthog.rb` with auto-capture, exception tracking, and ActiveJob instrumentation enabled
- Added `posthog_distinct_id` and `posthog_properties` methods to the `User` model for posthog-rails user association
- Added a `current_user` helper to `ApplicationController` so posthog-rails can auto-associate errors with the current user
- Added `PostHog.identify` calls on login (`Sessions::MagicLinksController`) and signup (`Signups::CompletionsController`)
- Added `PostHog.capture` calls across 12 controllers covering the full user lifecycle
- Added the posthog-js snippet to `app/views/layouts/shared/_head.html.erb` for frontend tracking (pageviews, session replay, client-side identification)
- Updated `config/initializers/content_security_policy.rb` to allow PostHog CDN and API connections
- Created `.env` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed signup and their account was created. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | A user successfully authenticated via a magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | A user explicitly terminated their session by logging out. | `app/controllers/sessions_controller.rb` |
| `board_created` | A user created a new board to organize work. | `app/controllers/boards_controller.rb` |
| `card_published` | A user published a card draft, making it visible on the board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | A user closed a card, marking the task as complete. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A user postponed a card to the 'not now' queue. | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A user moved a card from triage into a board column to start work. | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | A user posted a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner permanently deleted their account. | `app/controllers/account/cancellations_controller.rb` |
| `board_published` | A user published a board publicly, making it accessible via a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_assigned` | A user assigned or unassigned a team member on a card. | `app/controllers/cards/assignments_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1775142)
- **Signup → Board funnel**: [Signup to first board created funnel](https://us.posthog.com/project/483112/insights/HtRL1Vdr)
- **Card workflow funnel**: [Card workflow funnel](https://us.posthog.com/project/483112/insights/5EuNWyLG)
- **Active engagement trend**: [Active engagement trend](https://us.posthog.com/project/483112/insights/7DcrWir8)
- **Account churn**: [Account churn (cancellations over time)](https://us.posthog.com/project/483112/insights/CiQ6YU1z)
- **Daily active users**: [Daily active users](https://us.posthog.com/project/483112/insights/xap4P5tI)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation calls `identify` on fresh login and on every page load via the posthog-js snippet. Verify that users who resume a session via the cookie path are also properly identified in both frontend and backend contexts.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
