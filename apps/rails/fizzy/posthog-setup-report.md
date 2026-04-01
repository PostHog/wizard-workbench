<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fizzy Ruby on Rails application. The integration covers backend event tracking via `posthog-ruby` + `posthog-rails`, frontend tracking via `posthog-js`, user identification, and automatic exception capture.

## What was done

- Added `posthog-ruby` and `posthog-rails` gems to `Gemfile`
- Created `config/initializers/posthog.rb` with full `posthog-rails` auto-instrumentation (exception capture, ActiveJob, user context)
- Added `posthog_distinct_id` method to `app/models/user.rb` (returns identity email, falling back to user ID)
- Added `current_user` helper to `app/controllers/application_controller.rb` so `posthog-rails` can auto-associate exceptions with users
- Added `PostHog.capture` calls to 8 key controller actions covering auth, core workflows, and the churn event
- Added `PostHog.identify` calls on sign-in and sign-up to link events to person profiles
- Injected the `posthog-js` frontend snippet into `app/views/layouts/shared/_head.html.erb` with a CSP nonce and per-request `posthog.identify` when a user is logged in
- Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | Fired when a new user completes account setup | `app/controllers/signups/completions_controller.rb` |
| `user_signed_out` | Fired when a user ends their session | `app/controllers/sessions_controller.rb` |
| `board_created` | Fired when a new board is created | `app/controllers/boards_controller.rb` |
| `card_created` | Fired when a card is published (HTML and JSON paths) | `app/controllers/cards/publishes_controller.rb`, `app/controllers/cards_controller.rb` |
| `card_closed` | Fired when a card is closed/resolved | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | Fired when a card is postponed to "not now" | `app/controllers/cards/not_nows_controller.rb` |
| `card_commented` | Fired when a comment is added to a card | `app/controllers/cards/comments_controller.rb` |
| `account_cancelled` | Churn event: fired when an account is cancelled | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

### Suggested dashboard URL
https://us.posthog.com/project/238460/dashboard

### Recommended insights

1. **Signup → First card conversion funnel**
   Create a Funnel insight with steps: `user_signed_up` → `card_created`
   https://us.posthog.com/project/238460/insights/new?insight=FUNNELS

2. **Daily active users (sign-ins)**
   Create a Trends insight for `user_signed_in` unique users per day
   https://us.posthog.com/project/238460/insights/new?insight=TRENDS

3. **Cards created over time**
   Create a Trends insight for `card_created` event count per day
   https://us.posthog.com/project/238460/insights/new?insight=TRENDS

4. **Card resolution rate**
   Create a Trends insight comparing `card_created` vs `card_closed` per week
   https://us.posthog.com/project/238460/insights/new?insight=TRENDS

5. **Churn — account cancellations**
   Create a Trends insight for `account_cancelled` event count per week
   https://us.posthog.com/project/238460/insights/new?insight=TRENDS

### CSP note

Fizzy uses a strict nonce-based Content Security Policy. The inline `posthog-js` snippet is already nonce-tagged and will work. However, PostHog's external script (`array.js`) and API calls need two CSP env vars added to your deployment:

```
CSP_SCRIPT_SRC=https://us-assets.i.posthog.com
CSP_CONNECT_SRC=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-ruby-on-rails/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
