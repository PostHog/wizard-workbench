---
name: integration-javascript_web
description: >-
  PostHog integration for client-side web JavaScript applications using
  posthog-js
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for JavaScript Web

This skill helps you add PostHog analytics to JavaScript Web applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `references/js.md` - JavaScript web - docs
- `references/posthog-js.md` - PostHog JavaScript web SDK
- `references/web.md` - Web error tracking installation - docs
- `references/identify-users.md` - Identify users - docs
- `references/basic-integration-1.0-begin.md` - PostHog setup - begin
- `references/basic-integration-1.1-edit.md` - PostHog setup - edit
- `references/basic-integration-1.2-revise.md` - PostHog setup - revise
- `references/basic-integration-1.3-conclude.md` - PostHog setup - conclusion

The example project demonstrates SDK usage patterns (initialization, event capture, user identification, error tracking). Use it to understand the PostHog API, but adapt your implementation to match the actual project's architecture and conventions.

## Key principles

- **Environment variables**: Always use environment variables for PostHog keys. Never hardcode real API keys. If the project has no build step or runtime that supports environment variables (e.g. vanilla HTML), use placeholder values like `'YOUR_POSTHOG_API_KEY'` and instruct the user to replace them in the setup report.
- **Minimal changes**: Add PostHog code alongside existing integrations. Don't replace or restructure existing code.
- **Adapt to the project**: Follow the SDK documentation for how to integrate, but find the right place in the project's architecture to put it. Every project is structured differently — look for the natural entry point.
- **Explore first**: Read the project's key files before writing any code. Understand what the project does, where requests are handled, where users authenticate, and where errors are caught.

## SDK guardrails

- When a reverse proxy is configured, both /static/* AND /array/* must route to the assets origin (us-assets.i.posthog.com or eu-assets.i.posthog.com).
- Remember that source code is available in the node_modules directory
- Check package.json for type checking or build scripts to validate changes
- posthog-js is the JavaScript SDK package name
- posthog.init() MUST be called before any other PostHog methods (capture, identify, etc.)
- posthog-js is browser-only — do NOT import it in Node.js or server-side contexts (use posthog-node instead)
- Autocapture is ON by default with posthog-js (tracks clicks, form submissions, pageviews). Do NOT disable autocapture unless the user explicitly requests it.
- NEVER send PII in posthog.capture() event properties — no emails, full names, phone numbers, physical addresses, IP addresses, or user-generated content
- PII belongs in posthog.identify() person properties (email, name, role), NOT in capture() event properties
- Call posthog.identify(userId, { email, name, role }) on login AND on page refresh if the user is already logged in
- Call posthog.reset() on logout to unlink future events from the current user
- For SPAs without a framework router, capture pageviews with posthog.capture($pageview) or use the capture_pageview history_change option in init for History API routing

## Identifying users

Always add `identify()` on login and signup flows. Refer to the SDK and identify documentation for the correct pattern. Never use raw emails or IP addresses as the distinct ID.

## Error tracking

Always add exception capture around critical user flows. Refer to the error tracking installation documentation for the correct pattern for this language.
