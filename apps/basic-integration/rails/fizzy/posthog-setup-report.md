<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy. Changes include: adding `posthog-ruby` and `posthog-rails` gems, a PostHog initializer with auto-instrumentation for exceptions and background jobs, a `posthog_distinct_id` method on the User model, server-side identify and event capture across authentication and key business flows, and a posthog-js frontend snippet with CSP nonce support in the shared head layout.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | Fired when a new user completes account signup by providing their full name. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_out` | Fired when a user terminates their session. | `app/controllers/sessions_controller.rb` |
| `board_created` | Fired when a user creates a new board. | `app/controllers/boards_controller.rb` |
| `board_deleted` | Fired when a user deletes a board. | `app/controllers/boards_controller.rb` |
| `board_published` | Fired when a board is published publicly with a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | Fired when a board is unpublished and removed from public access. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | Fired when a draft card is published and becomes a real card on the board. | `app/controllers/cards/publishes_controller.rb` |
| `card_deleted` | Fired when a card is permanently deleted from a board. | `app/controllers/cards_controller.rb` |
| `card_closed` | Fired when a card is marked as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a previously closed card is reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Fired when a card is moved to 'not now' / postponed. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | Fired when a user posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | Fired when a card's assignment is toggled for a user. | `app/controllers/cards/assignments_controller.rb` |
| `account_cancelled` | Fired when an account owner cancels and deletes the account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818275)
- [User signups over time (wizard)](https://us.posthog.com/project/483112/insights/J4cRB1x8)
- [Card lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/nkT0srNl)
- [Card actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/RffmgFwi)
- [Account churn events (wizard)](https://us.posthog.com/project/483112/insights/lktoSpGD)
- [Collaboration activity (wizard)](https://us.posthog.com/project/483112/insights/EkAKDqHw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, and `CSP_CONNECT_SRC` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
