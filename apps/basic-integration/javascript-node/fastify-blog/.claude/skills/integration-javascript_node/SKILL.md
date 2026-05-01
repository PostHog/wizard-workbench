---
name: integration-javascript_node
description: PostHog integration for server-side Node.js applications using posthog-node
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for JavaScript Node

This skill helps you add PostHog analytics to JavaScript Node applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `references/node.md` - Node.js - docs
- `references/posthog-node.md` - PostHog Node.js SDK
- `references/node.md` - Node.js error tracking installation - docs
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

- posthog-node is the Node.js server-side SDK package name – do NOT use posthog-js on the server
- Include enableExceptionAutocapture: true in the PostHog constructor options
- Add posthog.capture() calls in route handlers for meaningful user actions – every route that creates, updates, or deletes data should track an event with contextual properties
- Add posthog.captureException(err, distinctId) in the application's error handler (e.g., Express error middleware, Fastify setErrorHandler, Koa app.on('error'))
- In long-running servers, the SDK batches events automatically – do NOT set flushAt or flushInterval unless you have a specific reason to
- For short-lived processes (scripts, CLIs, serverless), set flushAt to 1 and flushInterval to 0 to send events immediately
- Reverse proxy is NOT needed for server-side Node.js – only client-side JavaScript needs a proxy to avoid ad blockers
- Remember that source code is available in the node_modules directory
- Check package.json for type checking or build scripts to validate changes

## Identifying users

Always add `identify()` on login and signup flows. Refer to the SDK and identify documentation for the correct pattern. Never use raw emails or IP addresses as the distinct ID.

## Error tracking

Always add exception capture around critical user flows. Refer to the error tracking installation documentation for the correct pattern for this language.
