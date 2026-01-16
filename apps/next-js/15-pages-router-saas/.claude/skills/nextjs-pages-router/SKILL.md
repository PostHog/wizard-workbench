---
name: nextjs-pages-router
description: PostHog integration for Next.js Pages Router applications
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for Next.js Pages Router

This skill helps you add PostHog analytics to Next.js Pages Router applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `EXAMPLE.md` - Next.js Pages Router example project code
- `next-js.md` - Next.js - docs
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

- Never use useEffect() for analytics capture - it's brittle and causes errors
- Prefer event handlers or routing mechanisms to trigger analytics calls
- Add handlers where user actions occur rather than reacting to state changes
- Remember that source code is available in the node_modules directory

## Identifying users

Call `posthog.identify()` on the client side during login and signup events. Use form contents to identify users on submit. If server-side code exists, pass the client-side session and distinct ID using `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to maintain correlation.

## Error tracking

Add PostHog error tracking to relevant files, particularly around critical user flows and API boundaries.
