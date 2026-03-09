# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Fizzy, a collaborative project management and issue tracking application. Here is a summary of all changes made:

**Gems added** (`Gemfile`): `posthog-ruby` (server-side event capture) and `posthog-rails` (Rails auto-instrumentation for exception capture, ActiveJob, and user context).

**Environment variables** (`.env`): `POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST` configured via the wizard-tools MCP server.

**Initializer** (`config/initializers/posthog.rb`): PostHog client initialized via `PostHog.init` with Rails error logging on failure. `PostHog::Rails` configured with `auto_capture_exceptions`, `auto_instrument_active_job`, and `capture_user_context` enabled. The `current_user` method is delegated from `ApplicationController` to `Current.user` (the app's `CurrentAttributes` pattern) so posthog-rails can resolve the authenticated user.

**User model** (`app/models/user.rb`): Added `posthog_distinct_id` (returns the user's email or id — used automatically by posthog-rails for error tracking) and `posthog_properties` (name, account_id, role, date_joined).

**Frontend snippet** (`app/views/layouts/shared/_head.html.erb`): posthog-js snippet injected in the `<head>` with `person_profiles: 'identified_only'`. When `Current.user` is present, `posthog.identify()` is called with the same `posthog_distinct_id` as the backend, ensuring frontend and backend events are linked.

**Events instrumented** across 9 controller files:

| Event | Description | File |
|---|---|---|
| `signed_up` | User completed signup and created a new account | `app/controllers/signups/completions_controller.rb` |
| `signed_in` | User authenticated via magic link and started a new session | `app/controllers/sessions/magic_links_controller.rb` |
| `signed_out` | User signed out of their session | `app/controllers/sessions_controller.rb` |
| `board_created` | User created a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | User deleted a board | `app/controllers/boards_controller.rb` |
| `card_published` | User published a card from draft state to the board | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User closed a card as done | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User manually postponed a card to not now | `app/controllers/cards/not_nows_controller.rb` |
| `card_assigned` | User toggled assignment of a card to a team member | `app/controllers/cards/assignments_controller.rb` |
| `comment_created` | User added a comment to a card | `app/controllers/cards/comments_controller.rb` |
| `subscription_checkout_started` | User initiated a Stripe checkout session to subscribe to a plan | `saas/app/controllers/account/subscriptions_controller.rb` |
| `subscription_activated` | Stripe webhook confirmed checkout.session.completed for a subscription | `saas/app/controllers/stripe/webhooks_controller.rb` |
| `subscription_updated` | Stripe webhook updated an existing subscription (plan change or cancellation) | `saas/app/controllers/stripe/webhooks_controller.rb` |

`PostHog.identify` is called on `signed_up` and `signed_in` to sync user properties to PostHog person profiles. All server-side events use the user's email address (via `posthog_distinct_id`) as the distinct ID, matching the frontend `posthog.identify` call for seamless cross-platform attribution.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Analytics basics dashboard**: https://us.posthog.com/project/2/dashboard/1344803
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb) — tracks users from pricing page through checkout completion
  - [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB) — daily signups and sign-ins over 30 days
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy) — checkout completions and subscription changes
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI) — team member invitations and removals
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE) — account deletions as a leading churn indicator

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
