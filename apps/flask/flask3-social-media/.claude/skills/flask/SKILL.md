---
name: flask
description: PostHog integration for Flask applications
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for Flask

This skill helps you add PostHog analytics to Flask applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `EXAMPLE.md` - Flask example project code
- `flask.md` - Flask - docs
- `identify-users.md` - Identify users - docs
- `basic-integration-1.0-begin.md` - PostHog setup - begin
- `basic-integration-1.1-edit.md` - PostHog setup - edit
- `basic-integration-1.2-revise.md` - PostHog setup - revise
- `basic-integration-1.3-conclude.md` - PostHog setup - conclusion

The example project shows the target implementation pattern. Consult the documentation for API details.

## Key principles

- **Environment variables**: Always use environment variables for PostHog keys. Never hardcode them.
- **Minimal changes**: Add PostHog code alongside existing integrations. Don't replace or restructure existing code.
- **Match the example**: Your implementation should follow the example project's patterns as closely as possible.

## Framework guidelines

- Initialize PostHog globally in create_app() using posthog.api_key and posthog.host (NOT per-request)
- Manually capture exceptions with `posthog.capture_exception(e)` for error tracking since Flask has built-in error handlers
- Blueprint registration happens AFTER PostHog initialization in create_app()
- Remember that source code is available in the venv/site-packages directory
- posthog is the Python SDK package name
- Install dependencies with `pip install posthog` or `pip install -r requirements.txt` and do NOT use unquoted version specifiers like `>=` directly in shell commands

## Identifying users

Identify users during login and signup events. Refer to the example code and documentation for the correct identify pattern for this framework. If both frontend and backend code exist, pass the client-side session and distinct ID using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to maintain correlation.

## Error tracking

Add PostHog error tracking to relevant files, particularly around critical user flows and API boundaries.
