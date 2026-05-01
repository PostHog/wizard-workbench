---
name: integration-python
description: PostHog integration for any Python application using the Python SDK
metadata:
  author: PostHog
  version: dev
---

# PostHog integration for Python

This skill helps you add PostHog analytics to Python applications.

## Workflow

Follow these steps in order to complete the integration:

1. `basic-integration-1.0-begin.md` - PostHog Setup - Begin ← **Start here**
2. `basic-integration-1.1-edit.md` - PostHog Setup - Edit
3. `basic-integration-1.2-revise.md` - PostHog Setup - Revise
4. `basic-integration-1.3-conclude.md` - PostHog Setup - Conclusion

## Reference files

- `references/python.md` - Python - docs
- `references/posthog-python.md` - PostHog python SDK
- `references/python.md` - Python error tracking installation - docs
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

- Remember that source code is available in the venv/site-packages directory
- posthog is the Python SDK package name
- Install dependencies with `pip install posthog` or `pip install -r requirements.txt` and do NOT use unquoted version specifiers like `>=` directly in shell commands
- In CLIs and scripts: MUST call posthog.shutdown() before exit or all events are lost
- Prefer the Posthog() class constructor (instance-based API) for better control over initialization and shutdown, but adapt to the project's existing patterns if it already uses module-level config
- Always include enable_exception_autocapture=True in the Posthog() constructor to automatically track exceptions
- NEVER send PII in capture() event properties — no emails, full names, phone numbers, physical addresses, IP addresses, or user-generated content
- PII belongs in identify() person properties, NOT in capture() event properties. Safe event properties are metadata like message_length, form_type, boolean flags.
- Register posthog_client.shutdown with atexit.register() to ensure all events are flushed on exit
- The Python SDK has NO identify() method — use posthog_client.set(distinct_id=user_id, properties={...}) to set person properties, or use identify_context(user_id) within a context

## Identifying users

Always add `identify()` on login and signup flows. Refer to the SDK and identify documentation for the correct pattern. Never use raw emails or IP addresses as the distinct ID.

## Error tracking

Always add exception capture around critical user flows. Refer to the error tracking installation documentation for the correct pattern for this language.
