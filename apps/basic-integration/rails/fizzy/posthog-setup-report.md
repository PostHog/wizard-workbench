# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Rails application. The `posthog-ruby` and `posthog-rails` gems were added to the Gemfile, and a PostHog initializer was configured at `config/initializers/posthog.rb`. Server-side event tracking was added across nine controller files covering the full user lifecycle — from authentication through account cancellation. A PostHog JavaScript snippet was embedded in the shared layout head partial to enable frontend session recording and autocapture. User identification was wired up via a `posthog_distinct_id` helper. Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are read optionally so the app boots safely without them in production, but raises loudly in development if unconfigured.

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticated via a magic link and started a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | A new user completed the signup flow by setting their full name and creating an account. | `app/controllers/signups/completions_controller.rb` |
| `board_created` | A user created a new board in their account. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A user deleted an existing board from their account. | `app/controllers/boards_controller.rb` |
| `card_created` | A user created a new card on a board. | `app/controllers/cards_controller.rb` |
| `card_closed` | A user closed (resolved) a card, marking it as done. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | A user moved a card from the triage inbox into a board column. | `app/controllers/cards/triages_controller.rb` |
| `comment_added` | A user posted a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `card_postponed` | A user manually postponed a card to the 'not now' state. | `app/controllers/cards/not_nows_controller.rb` |
| `account_cancelled` | An account owner cancelled and deleted their account — a critical churn event. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1897432)
- [New user signups over time (wizard)](https://us.i.posthog.com/project/483112/insights/AhAXSZIC)
- [Signup funnel (wizard)](https://us.i.posthog.com/project/483112/insights/v6GStkF1)
- [Cards created over time (wizard)](https://us.i.posthog.com/project/483112/insights/wpncfENZ)
- [Account cancellations (wizard)](https://us.i.posthog.com/project/483112/insights/nCXheKxC)
- [Cards closed over time (wizard)](https://us.i.posthog.com/project/483112/insights/XZS7XTsu)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
