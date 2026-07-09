<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the Rails app with `posthog-ruby` and `posthog-rails`, an initializer was created for backend analytics and automatic exception tracking, frontend PostHog JS bootstrapping was added through the shared layout head, authenticated users are identified on the client and server, and key product events were instrumented across signup, login, board creation, card publishing, and webhook setup flows.

| Event name | Description | File |
| --- | --- | --- |
| `signup_requested` | Tracks when a visitor submits the signup email form to start creating an account. | `app/controllers/signups_controller.rb` |
| `user_signed_up` | Tracks when a user completes account setup and their account is successfully created. | `app/controllers/signups/completions_controller.rb` |
| `user_logged_in` | Tracks when a user successfully authenticates with a magic link and starts a session. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | Tracks when an authenticated user creates a new board. | `app/controllers/boards_controller.rb` |
| `card_published` | Tracks when a drafted card is published to a board. | `app/controllers/cards/publishes_controller.rb` |
| `webhook_created` | Tracks when a board admin creates a new webhook integration. | `app/controllers/webhooks_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825401
- Insight: Signup requests (wizard) — https://us.posthog.com/project/483112/insights/G07ZKXpF
- Insight: Signup funnel (wizard) — https://us.posthog.com/project/483112/insights/NiFm7ZGp
- Insight: Logins after signup (wizard) — https://us.posthog.com/project/483112/insights/BHkkh7S2
- Insight: Boards created (wizard) — https://us.posthog.com/project/483112/insights/UXkEvePZ
- Insight: Publishing and webhooks mix (wizard) — https://us.posthog.com/project/483112/insights/yBKUaXNB

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
