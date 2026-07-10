<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for Fizzy, a Rails 8 kanban-style project management app. The integration covers backend event tracking via `posthog-ruby` + `posthog-rails`, client-side analytics via `posthog-js`, automatic exception capture, user identification at sign-in and sign-up, and a PostHog dashboard with five insights.

## Changes made

**Gemfile** — added `posthog-ruby` and `posthog-rails` gems; `Gemfile.lock` updated via `bundle install`.

**config/initializers/posthog.rb** *(new)* — initialises `PostHog` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment, and configures `posthog-rails` for automatic exception capture, rescued-exception reporting, ActiveJob instrumentation, and current-user context.

**app/models/user.rb** — added `posthog_distinct_id` (returns `identity.id`, the stable identity UUID) and `posthog_properties` (name, role, created_at) methods used by `posthog-rails` for auto user association and by controllers for identify calls.

**app/views/layouts/shared/_head.html.erb** — added the `posthog-js` snippet (with CSP nonce) and a `posthog.identify()` call for authenticated users, so frontend and backend events share the same distinct ID.

**.env** — set `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, and `CSP_CONNECT_SRC` (the last two allow the posthog-js snippet and its API calls through the existing nonce-based CSP).

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User authenticates via magic link | `app/controllers/sessions/magic_links_controller.rb` |
| `user_signed_up` | New user completes signup flow | `app/controllers/signups/completions_controller.rb` |
| `board_created` | User creates a new board | `app/controllers/boards_controller.rb` |
| `board_deleted` | Board admin deletes a board | `app/controllers/boards_controller.rb` |
| `card_created` | User publishes a drafted card | `app/controllers/cards/publishes_controller.rb` |
| `card_closed` | User closes (resolves) a card | `app/controllers/cards/closures_controller.rb` |
| `card_reopened` | User reopens a closed card | `app/controllers/cards/closures_controller.rb` |
| `card_postponed` | User postpones a card to not-now | `app/controllers/cards/not_nows_controller.rb` |
| `comment_created` | User posts a comment on a card | `app/controllers/cards/comments_controller.rb` |
| `card_assigned` | User assigns a team member to a card | `app/controllers/cards/assignments_controller.rb` |
| `board_published` | Board admin makes a board public | `app/controllers/boards/publications_controller.rb` |
| `account_export_created` | Admin triggers an account data export | `app/controllers/account/exports_controller.rb` |
| `account_cancelled` | Owner cancels and deletes an account | `app/controllers/account/cancellations_controller.rb` |

## Next steps

We've built a dashboard and five insights to monitor user behavior:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829319)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/VBZ1ZTt1) — daily `user_signed_up` count, last 30 days
- [Signup to first board created funnel (wizard)](https://us.posthog.com/project/483112/insights/zGZSw8FS) — conversion from sign-up to creating a first board, 14-day window
- [Card activity: created vs closed (wizard)](https://us.posthog.com/project/483112/insights/ejb9Loqo) — daily comparison of cards created and closed, last 30 days
- [Account cancellations (wizard)](https://us.posthog.com/project/483112/insights/dctlqJEA) — weekly churn signal, last 90 days
- [Weekly active users (wizard)](https://us.posthog.com/project/483112/insights/wI3cmZgx) — unique users signing in per week, last 30 days

Dashboard subscription and alerts were not configured (no confirmation received). You can set these up in PostHog under the dashboard's **Share** menu (subscription) and each insight's alert options.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were instrumented may need updated mocks or fixtures (particularly `Sessions::MagicLinksController`, `Signups::CompletionsController`, `BoardsController`, and card-scoped controllers).
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, `CSP_SCRIPT_SRC`, and `CSP_CONNECT_SRC` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `posthog.identify()` fires on every page load in the layout when `Current.user` is present, so returning sessions are covered on the frontend. Verify this is also the case for any mobile or API clients.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
