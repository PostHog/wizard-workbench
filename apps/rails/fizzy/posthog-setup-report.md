<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. Here's a summary of all changes made:

**Backend (Ruby):** Added `posthog-ruby` and `posthog-rails` gems to the Gemfile and created a PostHog initializer at `config/initializers/posthog.rb` with auto-exception capture, rescued exception reporting, and ActiveJob instrumentation enabled. Added `posthog_distinct_id` and `posthog_properties` methods to the `User` model, using the user's email address as the stable identifier. Added a `current_user` bridge method in `ApplicationController` so `posthog-rails` can associate requests with the current user via Fizzy's `Current.user` pattern. Instrumented 13 events across 10 controllers covering the full user lifecycle: signup, login, account joins, board management, card workflow (triage, close, reopen, postpone, comment, assign, gild), and account cancellation. Identify calls are made on signup and login to keep user profiles up to date.

**Frontend (JavaScript):** Added the PostHog JS snippet to `app/views/layouts/shared/_head.html.erb` with inline user identification, enabling automatic pageview tracking, session replay, and client-side event capture.

**Environment:** `POSTHOG_API_KEY` and `POSTHOG_HOST` are stored in `.env` and accessed via `ENV.fetch` — no keys are hardcoded.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes signup and their account is created | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | Fired when a user successfully authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_joined_account` | Fired when a user joins an existing account via a join code | `app/controllers/join_codes_controller.rb` |
| `board_created` | Fired when a new board is created, with board name and access type | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a board is permanently deleted | `app/controllers/boards_controller.rb` |
| `card_triaged` | Fired when a card is moved from triage into a board column | `app/controllers/cards/triages_controller.rb` |
| `card_closed` | Fired when a card is marked as closed/completed | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a previously closed card is reopened | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Fired when a card is moved to "not now" (postponed/snoozed) | `app/controllers/cards/not_nows_controller.rb` |
| `card_comment_created` | Fired when a comment is added to a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Fired when a card is assigned to a team member | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | Fired when a card is marked as high priority (gilded) | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | Fired immediately before an account is permanently cancelled (churn signal) | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics:** https://us.posthog.com/project/2/dashboard/1295760
- 📈 **User Signups & Logins (Daily):** https://us.posthog.com/project/2/insights/nXJzs1AP
- 🔻 **Onboarding Funnel: Signup → Board → Card Triaged:** https://us.posthog.com/project/2/insights/GsfcOxOf
- ✅ **Card Activity: Closed, Postponed & Commented:** https://us.posthog.com/project/2/insights/d4h1uzUD
- ⚠️ **Account Cancellations (Churn):** https://us.posthog.com/project/2/insights/hoqArCKX
- 🤝 **Team Collaboration: Assignments & Joins:** https://us.posthog.com/project/2/insights/bWRx3xL9

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
