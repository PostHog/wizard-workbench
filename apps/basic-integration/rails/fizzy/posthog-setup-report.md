<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a Ruby on Rails kanban project management app. The integration adds server-side event tracking via `posthog-ruby` and `posthog-rails`, user identification on login and signup, automatic exception capture for controllers and ActiveJobs, and a posthog-js frontend snippet for pageview and session replay tracking.

Key changes:
- **Gemfile**: Added `posthog-ruby` and `posthog-rails` gems.
- **config/initializers/posthog.rb**: Initialized PostHog client with env vars and configured `posthog-rails` for automatic exception capture, rescued exception reporting, and ActiveJob instrumentation.
- **app/models/user.rb**: Added `posthog_distinct_id` (returns identity email address) and `posthog_properties` methods used by posthog-rails for automatic user association in error reports.
- **app/controllers/application_controller.rb**: Added `current_user` helper method wrapping `Current.user`, required by posthog-rails for user context in auto-captured exceptions.
- **app/views/layouts/shared/_head.html.erb**: Added posthog-js frontend snippet with automatic user identification when a user is logged in.
- **13 controller files**: Added `PostHog.capture` and `PostHog.identify` calls (see table below).

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes the signup flow. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Fired when a user authenticates via magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_logged_out` | Fired when a user ends their session. | `app/controllers/sessions_controller.rb` |
| `board_created` | Fired when a user creates a new board. | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a user deletes a board. | `app/controllers/boards_controller.rb` |
| `card_published` | Fired when a user publishes a card from draft. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fired when a user closes (completes) a card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Fired when a user postpones a card to 'not now'. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | Fired when a user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Fired when a card is assigned to a team member. | `app/controllers/cards/assignments_controller.rb` |
| `user_joined_via_invite` | Fired when a user joins via a join code invite. | `app/controllers/join_codes_controller.rb` |
| `account_export_started` | Fired when an admin starts a data export. | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | Fired when an owner cancels and deletes the account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/478060/dashboard/1737096)
- [Signup to First Card Funnel](https://us.posthog.com/project/478060/insights/UxpVF4bS/)
- [New Signups Over Time](https://us.posthog.com/project/478060/insights/0GbAX1IR/)
- [Account Cancellations Over Time](https://us.posthog.com/project/478060/insights/HU0v46Tz/)
- [Cards Published Over Time](https://us.posthog.com/project/478060/insights/c3YzMP1S/)
- [Logins Over Time](https://us.posthog.com/project/478060/insights/Jkj8itSO/)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the posthog-js snippet in the layout identifies on every page load when a user is logged in, but verify this covers your SSO/session-restore flows.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
