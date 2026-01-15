---
name: react-react-router-7-framework
description: PostHog integration for React Router v7 Framework mode applications
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for React Router v7 - Framework mode

This skill helps you add PostHog analytics to React Router v7 - Framework mode applications.

## Reference files

- `EXAMPLE.md` - React Router v7 - Framework mode example project code
- `react-router-v7-framework-mode.md` - React router v7 framework mode (remix v3) - docs
- `identify-users.md` - Identify users - docs
- `basic-integration-1.0-begin.md` - PostHog setup - begin
- `basic-integration-1.1-edit.md` - PostHog setup - edit
- `basic-integration-1.2-revise.md` - PostHog setup - revise
- `basic-integration-1.3-conclude.md` - PostHog setup - conclusion

Review the example project first to understand the pattern, then consult the documentation for API details.

## Key principles

- **Environment variables**: Always use environment variables for PostHog keys. Never hardcode them.
- **Minimal changes**: Add PostHog code alongside existing integrations. Don't replace or restructure existing code.
- **Match the example**: Your implementation should follow the example project's patterns as closely as possible.

## Framework guidelines

- Never use useEffect() for analytics capture - it's brittle and causes errors
- Prefer event handlers or routing mechanisms to trigger analytics calls
- Add handlers where user actions occur rather than reacting to state changes
- Remember that source code is available in the node_modules directory

## Identifying users

Call `posthog.identify()` on the client side during login and signup events. Use form contents to identify users on submit. If server-side code exists, pass the client-side session and distinct ID using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to maintain correlation.

## Error tracking

Add PostHog error tracking to relevant files, particularly around critical user flows and API boundaries.
