<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. The integration adds server-side event tracking for all major business actions, user identification on login and signup, automatic exception capture via `posthog-rails`, and a frontend posthog-js snippet for pageview tracking and session replay.

**Files changed:**
- `Gemfile` — added `posthog-ruby` and `posthog-rails` gems
- `config/initializers/posthog.rb` — new file: PostHog client initialization with Rails auto-instrumentation
- `app/models/user.rb` — added `posthog_distinct_id` and `posthog_properties` helpers
- `app/controllers/application_controller.rb` — added `current_user` helper delegating to `Current.user` (required by `posthog-rails` for exception user context)
- `app/views/layouts/shared/_head.html.erb` — added posthog-js snippet with per-session `identify` call for logged-in users
- 10 controller files — `PostHog.capture` calls added (see table below)
- 2 controller files — `PostHog.identify` calls added (signup + login flows)

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completed the signup flow and created their account. | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | A user successfully authenticated via magic link and started a session. | `app/controllers/sessions/magic_links_controller.rb` |
| `board_created` | A user created a new board. | `app/controllers/boards_controller.rb` |
| `board_published_publicly` | A user published a board publicly for external sharing. | `app/controllers/boards/publications_controller.rb` |
| `card_published` | A user published a card from a draft, making it live on the board. | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | A user closed a card, marking it as completed. | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | A user reopened a previously closed card. | `app/controllers/cards/closures_controller.rb` |
| `card_triaged` | A user triaged a card into a column from the triage queue. | `app/controllers/cards/triages_controller.rb` |
| `card_postponed` | A user manually postponed a card to the not-now list. | `app/controllers/cards/not_nows_controller.rb` |
| `card_assigned` | A user toggled an assignment on a card. | `app/controllers/cards/assignments_controller.rb` |
| `card_gilded` | A user marked a card as golden to highlight it as high priority. | `app/controllers/cards/goldnesses_controller.rb` |
| `comment_created` | A user added a comment to a card. | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | An account owner cancelled their account, a critical churn event. | `app/controllers/account/cancellations_controller.rb` |

## Next steps

A PostHog dashboard could not be auto-created in this run because the available API key lacked `dashboard:write` scope. To create one manually, log into PostHog and build a dashboard with these suggested insights:

1. **Signup funnel** — Funnel from `user_signed_in` → `board_created` → `card_published`
2. **Churn over time** — Trend of `account_cancelled` events
3. **Daily active users** — Unique users who fired `user_signed_in` per day
4. **Card completion rate** — Ratio of `card_closed` to `card_published` per user
5. **Collaboration index** — Trend of `comment_created` + `card_assigned` events over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures. Add `PostHog.test_mode = true` or stub `PostHog.capture` in test helpers if tests start making real network calls.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] The posthog-js snippet dynamically loads `array.js` from the PostHog CDN. If your Content Security Policy enforces `script-src`, add the PostHog assets host (e.g. `https://us-assets.i.posthog.com`) to `CSP_SCRIPT_SRC` and `https://us.i.posthog.com` to `CSP_CONNECT_SRC` via environment variables.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called at magic-link sign-in and on page load via the JS snippet for any authenticated session, which covers returning visitors as long as they have an active Rails session.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
