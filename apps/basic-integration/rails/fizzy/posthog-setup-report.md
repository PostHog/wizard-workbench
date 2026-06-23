<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The `posthog-ruby` and `posthog-rails` gems were added and configured, with an initializer at `config/initializers/posthog.rb` that enables automatic exception capture, ActiveJob instrumentation, and user context on errors. The `User` model gained `posthog_distinct_id` (identity email) and `posthog_properties` helper methods. A `current_user` helper was added to `ApplicationController` so that `posthog-rails` can automatically associate exceptions with the authenticated user. The posthog-js frontend snippet was inserted into the shared `<head>` partial, identifying the current user on every page load. Server-side events cover all critical user flows: authentication (sign-in, sign-out), signup completion, board lifecycle (created, deleted, published, unpublished), card lifecycle (created, closed, reopened, postponed, gilded), collaboration (comment created), board structure (column created), and account churn (account cancelled).

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticated via a magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | A user explicitly terminated their session by signing out. | `app/controllers/sessions_controller.rb` |
| `signup_completed` | A new user completed sign-up by providing their full name and creating an account. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user created a new board to organize work. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A user deleted a board and all its associated data. | `app/controllers/boards_controller.rb` |
| `board_published` | A user published a board to make it publicly accessible via a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | A user removed the public publication of a board, making it private again. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A user created a new card (task/issue) on a board. | `app/controllers/cards/publishes_controller.rb`, `app/controllers/cards_controller.rb` |
| `card_closed` | A user closed a card to mark it as completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A user manually postponed a card to 'not now', removing it from the active backlog. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | A user added a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_gilded` | A user marked a card as golden (high priority) to highlight it for the team. | `app/controllers/cards/goldnesses_controller.rb` |
| `account_cancelled` | An account owner cancelled and deleted the account. | `app/controllers/account/cancellations_controller.rb` |
| `column_created` | A user added a new column to a board to represent a workflow stage. | `app/controllers/boards/columns_controller.rb` |

## Next steps

To create the recommended dashboard "Analytics basics (wizard)" in PostHog, navigate to your PostHog project and add the following insights:

1. **Signup conversion funnel** — Funnel from `user_signed_in` → `signup_completed` to measure what fraction of sign-ins result in a completed account.
2. **Card completion rate** — Funnel from `card_created` → `card_closed` to see how many created cards are eventually resolved.
3. **Weekly card activity** — Trend of `card_created`, `card_closed`, and `comment_created` events over time to measure team engagement.
4. **Postponement vs closure** — Breakdown of `card_closed` vs `card_postponed` to understand how cards leave the active backlog.
5. **Account churn** — Trend of `account_cancelled` over time to monitor retention risk.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. In particular, add stubs for `PostHog.capture` and `PostHog.identify` in controller tests.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies users on magic-link sign-in and page load (via the frontend snippet), but confirm session resumption for returning users still reaches the `posthog.identify()` call via the layout's `<script>` block.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
