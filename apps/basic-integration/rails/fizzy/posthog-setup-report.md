# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The following changes were made:

- Added `posthog-ruby` and `posthog-rails` gems to the Gemfile for server-side tracking and automatic exception capture.
- Created `config/initializers/posthog.rb` to initialize PostHog and configure `posthog-rails` auto-instrumentation (exception capture, ActiveJob instrumentation, user context detection).
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to `.env`.
- Added `posthog_distinct_id` and `posthog_properties` methods to the `User` model for consistent user identification.
- Added the posthog-js frontend snippet to `app/views/layouts/shared/_head.html.erb`, with an inline `posthog.identify` call to correlate frontend and backend events for authenticated users.
- Added `PostHog.identify` and `user_logged_in` event capture to `Sessions::MagicLinksController` (the passwordless magic link authentication flow).
- Added `PostHog.identify` and `user_signed_up` event capture to `Signups::CompletionsController`.
- Added `board_created` and `board_deleted` event captures to `BoardsController`.
- Added `card_created` event capture to `CardsController` (JSON API path) and `Cards::PublishesController` (HTML draft-publish path).
- Added `card_closed` and `card_reopened` event captures to `Cards::ClosuresController`.
- Added `comment_added` event capture to `Cards::CommentsController`.
- Added `card_assigned` event capture to `Cards::AssignmentsController`.
- Added `card_marked_golden` event capture to `Cards::GoldnessesController`.
- Added `account_cancelled` event capture to `Account::CancellationsController`.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | User completed signup by setting their name and creating an account. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User created a new kanban board. | `app/controllers/boards_controller.rb` |
| `board_deleted` | User permanently deleted a board. | `app/controllers/boards_controller.rb` |
| `card_created` | User created a new card via the API. | `app/controllers/cards_controller.rb` |
| `card_created` | User published a drafted card to a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User marked a card as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `comment_added` | User added a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | User toggled an assignment on a card. | `app/controllers/cards/assignments_controller.rb` |
| `card_marked_golden` | User marked a card as golden (high priority). | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | Account owner permanently cancelled and deleted their account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1751155)
- **Signup Conversion Funnel** (user_signed_up → board_created → card_created): [View insight](https://us.posthog.com/project/483112/insights/QdZcTpct)
- **Daily Active Users** (user_logged_in trend): [View insight](https://us.posthog.com/project/483112/insights/juWYGo25)
- **Card Completion Rate** (card_created vs card_closed): [View insight](https://us.posthog.com/project/483112/insights/exzQJS1R)
- **Account Churn** (account_cancelled trend): [View insight](https://us.posthog.com/project/483112/insights/l0gEMMt4)
- **Collaboration Activity** (comment_added + card_assigned): [View insight](https://us.posthog.com/project/483112/insights/G0XxWc8s)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The posthog-js snippet in the layout already calls `posthog.identify` for any logged-in user on every page load, which covers the returning-visitor case.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
