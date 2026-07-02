<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Fizzy. The integration uses the `posthog-rails` gem for server-side event capture and automatic exception tracking, with `posthog-ruby` as the underlying SDK. The following changes were made:

- Added `posthog-ruby` and `posthog-rails` gems to the Gemfile
- Created `config/initializers/posthog.rb` with `PostHog.init` (API key + host from env vars) and `PostHog::Rails.configure` (auto exception capture, ActiveJob instrumentation, user context)
- Added `posthog_distinct_id` and `posthog_properties` methods to `User` model (using non-PII identity ID as the distinct identifier)
- Added a `current_user` helper to `ApplicationController` so posthog-rails can auto-associate exceptions with the authenticated user
- Added `PostHog.identify` + `PostHog.capture` calls on sign-in and sign-up flows
- Added `PostHog.capture` calls for 12 business events across 10 controllers
- Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes signup by providing their full name and creating their first account. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | A user successfully authenticates via a magic link and starts a new session. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | A user creates a new board to organize work. | `app/controllers/boards_controller.rb` |
| `board_deleted` | A user deletes an existing board. | `app/controllers/boards_controller.rb` |
| `card_created` | A user creates a new card (task/issue) on a board. | `app/controllers/cards/publishes_controller.rb`, `app/controllers/cards_controller.rb` |
| `card_closed` | A user marks a card as closed/completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopens a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | A user postpones a card to 'not now', removing it from the active backlog. | `app/controllers/cards/not_nows_controller.rb` |
| `card_triaged` | A user moves a card from the triage inbox into a workflow column. | `app/controllers/cards/triages_controller.rb` |
| `comment_created` | A user posts a comment on a card. | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner cancels and deletes their account. | `app/controllers/account/cancellations_controller.rb` |
| `export_started` | An admin or owner initiates an account data export. | `app/controllers/account/exports_controller.rb` |
| `import_started` | A user starts importing data into a new account. | `app/controllers/account/imports_controller.rb` |
| `board_published` | A user makes a board publicly accessible. | `app/controllers/boards/publications_controller.rb` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792541)
- [Signup to board to card funnel](https://us.posthog.com/project/483112/insights/kptezSY4)
- [Daily active signins](https://us.posthog.com/project/483112/insights/VtJCDDC5)
- [Card completion rate](https://us.posthog.com/project/483112/insights/YVIlaRjZ)
- [Card abandonment (postponed)](https://us.posthog.com/project/483112/insights/wGhKITzr)
- [Account cancellations](https://us.posthog.com/project/483112/insights/xE15AByH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (and any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies users on fresh magic-link sign-in; returning sessions resume via cookie and do not re-identify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
