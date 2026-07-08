<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy. The `posthog-ruby` and `posthog-rails` gems were added and configured with an initializer that enables automatic exception capture, ActiveJob instrumentation, and user context. A `posthog_distinct_id` method was added to the `User` model and a `current_user` helper was added to `ApplicationController` so posthog-rails can auto-associate errors with users. The `posthog-js` snippet was added to the shared head layout partial for frontend tracking with automatic `identify` calls on authenticated pages. Thirteen server-side events were instrumented across the key business flows — authentication, board and card lifecycle, collaboration, and churn.

| Event | Description | File |
|---|---|---|
| `signup_completed` | Fired when a new user completes account signup with their full name. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | Fired when a user successfully authenticates via a magic link. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | Fired when a user ends their session by signing out. | `app/controllers/sessions_controller.rb` |
| `board_created` | Fired when a user creates a new board. | `app/controllers/boards_controller.rb` |
| `card_created` | Fired when a card is published and added to a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Fired when a card is marked as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | Fired when a previously closed card is reopened. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Fired when a card is moved to 'not now' and postponed. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_added` | Fired when a user adds a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_triaged` | Fired when a card is moved from triage into a board column. | `app/controllers/cards/triages_controller.rb` |
| `card_gilded` | Fired when a card is marked as high priority (gilded). | `app/controllers/cards/goldnesses_controller.rb` |
| `board_published` | Fired when a board is published publicly for external sharing. | `app/controllers/boards/publications_controller.rb` |
| `account_cancelled` | Fired when an account owner cancels and deletes their account. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818262)
- [Daily signups](https://us.posthog.com/project/483112/insights/8Hfm1R0D)
- [Signup to first board funnel](https://us.posthog.com/project/483112/insights/JjDFDvou)
- [Card completion funnel](https://us.posthog.com/project/483112/insights/g7w4wb1H)
- [Account cancellations](https://us.posthog.com/project/483112/insights/eAnOBWZY)
- [Weekly active users](https://us.posthog.com/project/483112/insights/Axz8DW40)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. The `posthog-js` snippet in the layout automatically calls `identify` on every authenticated page load, which covers this, but verify the frontend distinct IDs match the backend IDs used in `PostHog.identify`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
