<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy, a Rails-based collaborative project management application. The integration includes server-side event tracking via `posthog-ruby` and `posthog-rails`, user identification on login and signup, automatic exception capture, and client-side tracking via the `posthog-js` snippet.

**Changes made:**

- **Gemfile** — Added `posthog-ruby` and `posthog-rails` gems
- **config/initializers/posthog.rb** — Created PostHog initializer with `auto_capture_exceptions`, `report_rescued_exceptions`, and `auto_instrument_active_job` enabled
- **app/controllers/application_controller.rb** — Added `current_user` private method (delegates to `Current.user`) for `posthog-rails` user context detection
- **app/models/user.rb** — Added `posthog_distinct_id` (returns identity email) and `posthog_properties` methods
- **app/views/layouts/shared/_head.html.erb** — Added `posthog-js` snippet with conditional `identify` call for authenticated users
- **15 controller files** — Added `PostHog.capture` calls for key business events, plus `PostHog.identify` on login and signup

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via magic link. | app/controllers/sessions/magic_links_controller.rb |
| `user_signed_up` | Fired when a new user completes account signup with their name. | app/controllers/signups/completions_controller.rb |
| `card_created` | Fired when a new card (task/issue) is created on a board (API path). | app/controllers/cards_controller.rb |
| `card_deleted` | Fired when a card is permanently deleted from a board. | app/controllers/cards_controller.rb |
| `card_closed` | Fired when a card is marked as closed/completed. | app/controllers/cards/closures_controller.rb |
| `card_reopened` | Fired when a previously closed card is reopened. | app/controllers/cards/closures_controller.rb |
| `card_commented` | Fired when a user posts a comment on a card. | app/controllers/cards/comments_controller.rb |
| `card_assigned` | Fired when a card is assigned to a team member. | app/controllers/cards/assignments_controller.rb |
| `card_postponed` | Fired when a card is manually moved to the not-now state. | app/controllers/cards/not_nows_controller.rb |
| `card_gilded` | Fired when a card is marked as golden (high priority). | app/controllers/cards/goldnesses_controller.rb |
| `card_triaged` | Fired when a card is triaged into a board column for the first time. | app/controllers/cards/triages_controller.rb |
| `board_created` | Fired when a new board is created within an account. | app/controllers/boards_controller.rb |
| `board_deleted` | Fired when a board is permanently deleted. | app/controllers/boards_controller.rb |
| `board_published` | Fired when a board is made publicly accessible with a shareable link. | app/controllers/boards/publications_controller.rb |
| `account_cancelled` | Fired when an account owner cancels and deletes their account. | app/controllers/account/cancellations_controller.rb |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1760680)
  - Signup to Card Creation Funnel
  - Daily Active Users
  - Card Engagement Breakdown
  - Account Churn Over Time
  - Board Publishing Rate

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `posthog.identify` call in the shared head partial handles this on every page load for authenticated users, but verify the magic link sign-in flow correctly identifies returning users who already have accounts.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
