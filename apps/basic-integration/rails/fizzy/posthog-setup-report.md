<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. PostHog is initialized via a new `config/initializers/posthog.rb` initializer using the `posthog-rails` gem, which provides automatic exception capture, ActiveJob instrumentation, and user context detection. The `posthog-js` snippet was added to `app/views/layouts/shared/_head.html.erb` to capture client-side pageviews and session replay for all layouts. Users are identified on sign-in via magic link and on signup completion using `Identity#email_address` as the persistent distinct ID, ensuring backend and frontend events are correlated.

| Event | Description | File |
|-------|-------------|------|
| `signup_completed` | User successfully completes the signup process and their account is created. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | User successfully authenticates via magic link and starts a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User terminates their session by logging out. | `app/controllers/sessions_controller.rb` |
| `board_created` | User creates a new board for organizing work. | `app/controllers/boards_controller.rb` |
| `board_deleted` | User permanently deletes a board. | `app/controllers/boards_controller.rb` |
| `board_published` | User makes a board publicly accessible via a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `board_unpublished` | User removes public access from a previously published board. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | User publishes a new card from the draft state. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User marks a card as done and closes it. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User moves a card to the 'not now' pile to postpone it. | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | User assigns or unassigns a team member to a card. | `app/controllers/cards/assignments_controller.rb` |
| `account_cancelled` | Account owner cancels and deletes their account. | `app/controllers/account/cancellations_controller.rb` |
| `join_code_redeemed` | User joins an account using an invite code. | `app/controllers/join_codes_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787482)
- [Signup Conversion Funnel](https://us.posthog.com/project/483112/insights/VQB83OIo)
- [New Cards Created](https://us.posthog.com/project/483112/insights/buMl41t9)
- [Account Cancellations](https://us.posthog.com/project/483112/insights/DjzDlJvf)
- [Card Completion Funnel](https://us.posthog.com/project/483112/insights/etKfwZaw)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/BifVCva5)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
