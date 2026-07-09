<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for Fizzy. The `posthog-ruby` and `posthog-rails` gems were added to the Gemfile. A PostHog initializer was created at `config/initializers/posthog.rb` with automatic exception capture, ActiveJob instrumentation, and user-context detection. The posthog-js snippet was added to the shared head partial for frontend session replay and pageview tracking. Twelve business-critical events were instrumented across 10 controller files, covering the full user lifecycle from signup through daily engagement to account cancellation. Users are identified on sign-in and signup using `identity.id` as the stable distinct_id, with email set as a person property via `PostHog.identify`.

| Event | Description | File |
|---|---|---|
| `signup_completed` | A new user has finished the signup flow and their account has been created. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | A user has successfully authenticated via magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | A user has created a new board to organize their team's work. | `app/controllers/boards_controller.rb` |
| `board_published` | A user has made a board publicly accessible via a shareable link. | `app/controllers/boards/publications_controller.rb` |
| `card_created` | A user has published a new card (task/issue) to a board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | A user has marked a card as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_commented` | A user has added a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | A user has assigned a card to a team member. | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A user has marked a card as golden (high priority). | `app/controllers/cards/goldnesses_controller.rb` |
| `card_postponed` | A user has manually postponed a card to the 'not now' state. | `app/controllers/cards/not_nows_controller.rb` |
| `account_cancelled` | The account owner has cancelled and deleted their account. | `app/controllers/account/cancellations_controller.rb` |
| `data_export_started` | An admin or owner has initiated a data export of their account. | `app/controllers/account/exports_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824625)
- **Insight**: [Signup to login funnel](https://us.posthog.com/project/483112/insights/M8PAJ2Bp)
- **Insight**: [Daily signups and logins](https://us.posthog.com/project/483112/insights/8HQvBDlc)
- **Insight**: [Card activity breakdown](https://us.posthog.com/project/483112/insights/l2FcC9pB)
- **Insight**: [Board creation to first card funnel](https://us.posthog.com/project/483112/insights/8yxiZK06)
- **Insight**: [Account cancellations (churn)](https://us.posthog.com/project/483112/insights/zAHhKvCX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
