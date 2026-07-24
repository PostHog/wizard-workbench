# PostHog setup report

PostHog analytics was added to the Flask social-media application: the Python SDK is installed, a shared client is initialized from environment configuration, authenticated request identity is wired, eleven server-side events are instrumented, global error capture is enabled, and a starter dashboard is available.

## Verified by this run

### Installation and initialization

- Added the `posthog` dependency to `requirements.txt`; `pip install -r requirements.txt` completed successfully with PostHog 7.29.0.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` configuration in `config.py`.
- `app/__init__.py` creates one shared `Posthog` client before blueprint registration, enables SDK exception autocapture, registers shutdown, and exposes the client as `app.posthog_client`.
- Missing configuration is tolerated in production and raises the required runtime error in debug/testing. The real keys are present in the local `.env`; `.env.example` documents the names with placeholders.
- Request boundaries establish a fresh PostHog context. Authenticated Flask-Login users are identified with stable `User.id` values. Successful login sets email and username as person properties; these values are not event properties.

### Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A registered user successfully signs in through the web form. | `app/auth/routes.py` |
| `user_logged_out` | An authenticated user signs out of the web application. | `app/auth/routes.py` |
| `user_registered` | A visitor successfully creates a new account. | `app/auth/routes.py` |
| `password_reset_requested` | A visitor submits the password-reset request form. | `app/auth/routes.py` |
| `password_reset_completed` | A visitor successfully sets a new password with a valid reset link. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a new microblog post. | `app/main/routes.py` |
| `profile_updated` | An authenticated user saves changes to their profile. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another user. | `app/main/routes.py` |
| `message_sent` | An authenticated user sends a direct message. | `app/main/routes.py` |
| `post_export_requested` | An authenticated user requests an export of their posts. | `app/main/routes.py` |

Captures are guarded when PostHog is unconfigured. The unauthenticated password-reset request is intentionally personless. No runtime traffic was observed, so this run does **not** confirm that any event reached PostHog.

### Identification

Identification was wired, not skipped. Authenticated requests inherit a stable distinct ID from the request context, while login and completed password reset provide the known stable `User.id` directly. Registration does not authenticate the new account in this application, and background jobs or CLI commands do not establish identity automatically.

### Error tracking

The existing global Flask 500 handler in `app/errors/handlers.py` now calls the shared client's `capture_exception(error)` while preserving rollback and response behavior. SDK exception autocapture is also enabled at initialization. No runtime error delivery was observed.

### Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901795)

The dashboard has five wizard-tagged insights covering registration-to-publishing conversion, authentication, content/export activity, social relationships, and profile/account recovery. They use a rolling 30-day range and may be empty until events arrive.

## Not verified by this run

- No test suite, build, lint, or typecheck command was available or run.
- No application runtime exercise or PostHog event-delivery check was performed. Successful dependency installation and source review do not prove event delivery.
- No CSP was detected, so no CSP change or browser-console verification was applicable.

## Build conflict

No build, lint, or typecheck command is defined by this project, so verification was limited to successful dependency installation and strict source review. A full production build was therefore not run.

## Before you merge

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only locally; inspect `config.py` and deployment configuration.
- [ ] Exercise login, logout, registration, password reset, publishing, profile updates, follows, unfollows, direct messages, and exports, then confirm the corresponding events arrive in PostHog.
- [ ] Confirm the returning authenticated-visitor path continues to identify users through `app/__init__.py`, so sessions do not fragment across anonymous IDs.
- [ ] If background jobs or CLI commands should be attributed, establish identity explicitly before adding or relying on captures outside request handlers.
