<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Fizzy Rails application. Here's what was done:

**Gems added** — `posthog-ruby` and `posthog-rails` were added to the `Gemfile`. The `posthog-rails` gem provides automatic exception capture, ActiveJob instrumentation, and Rails error reporting integration on top of the core Ruby SDK.

**Initializer created** — `config/initializers/posthog.rb` initialises the PostHog client from environment variables and enables auto-instrumentation: unhandled exceptions in controllers, rescued exceptions, and background job failures are all captured automatically without any extra code.

**User model updated** — `posthog_distinct_id` and `posthog_properties` methods were added to `User` so that posthog-rails can automatically associate error events with the authenticated user.

**ApplicationController updated** — A `current_user` helper was added (returning `Current.user`) so that posthog-rails' user-context detection works seamlessly.

**12 server-side events instrumented** across 10 controllers covering the full user lifecycle from acquisition through churn.

**Frontend tracking added** — The posthog-js snippet was added to `app/views/layouts/shared/_head.html.erb` with Turbo Drive-aware pageview capture (fires on `turbo:load`) and automatic user identification for authenticated users, linking frontend and backend events by shared `distinct_id`.

**Environment variables** — `POSTHOG_API_KEY` and `POSTHOG_HOST` were written to `.env` and are referenced everywhere via `ENV.fetch(...)`. Keys are never hardcoded.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New identity created, magic sign-up link sent (top of acquisition funnel) | `app/controllers/signups_controller.rb` |
| `signup_completed` | User finishes profile and account setup — conversion event | `app/controllers/signups/completions_controller.rb` |
| `user_signed_in` | Successful magic-link authentication, new session started | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_out` | User explicitly signs out, session terminated | `app/controllers/sessions_controller.rb` |
| `join_code_redeemed` | User joins an account by redeeming an invite code | `app/controllers/join_codes_controller.rb` |
| `board_created` | New board created (primary organisational unit) | `app/controllers/boards_controller.rb` |
| `board_published` | Board made publicly accessible with shareable link | `app/controllers/boards/publications_controller.rb` |
| `card_published` | Drafted card published and visible on a board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | Card marked as closed/done — key workflow completion signal | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Card sent to the "not now" list by a user | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | Comment posted on a card — collaboration engagement signal | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Account owner cancels — critical churn event | `app/controllers/account/cancellations_controller.rb` |

## Next steps

Create an **"Analytics basics"** dashboard in your [PostHog project](https://us.posthog.com/project/238460) with the following five insights to keep an eye on the key business metrics:

1. **Signup Funnel** — Funnel insight: `user_signed_up` → `signup_completed`. Measures how many users who start the signup process complete onboarding. Spot drop-off and iterate on the completion flow.

2. **Daily Active Users** — Trends insight: `user_signed_in` (unique users, daily). Your core engagement metric showing how many distinct identities log in each day.

3. **Card Workflow Health** — Trends insight: `card_published`, `card_closed`, `card_postponed` overlaid. A closed-to-postponed ratio below 1 signals backlog accumulation — the entropy system might need tuning.

4. **Collaboration Engagement** — Trends insight: `comment_created` (event count and unique users). Measures how actively teams communicate on cards; a leading indicator of product stickiness.

5. **Churn Monitor** — Trends insight: `account_cancelled` (event count, weekly). Your most critical retention metric. Set up a PostHog alert to notify your team whenever this event fires.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
