# Framework rules

Follow these when integrating PostHog into this framework.

- Add 'posthog.integrations.django.PosthogContextMiddleware' to MIDDLEWARE it auto-extracts tracing headers and captures exceptions
- Initialize PostHog in AppConfig.ready() with api_key and host from environment variables
- Use the context API pattern with new_context(), identify_context(user_id), then capture()
- For login/logout views, create a new context since user state changes during the request
- Do NOT create custom middleware, distinct_id helpers, or conditional checks - the SDK handles these
- Remember that source code is available in the venv/site-packages directory
- posthog is the Python SDK package name
- Install dependencies with `pip install posthog` or `pip install -r requirements.txt` and do NOT use unquoted version specifiers like `>=` directly in shell commands
- In CLIs and scripts: MUST call posthog.shutdown() before exit or all events are lost
- Always use the Posthog() class constructor (instance-based API) instead of module-level posthog.api_key config
- Always include enable_exception_autocapture=True in the Posthog() constructor to automatically track exceptions
- NEVER send PII in capture() event properties — no emails, full names, phone numbers, physical addresses, IP addresses, or user-generated content
- PII belongs in identify() person properties, NOT in capture() event properties. Safe event properties are metadata like message_length, form_type, boolean flags.
- Register posthog_client.shutdown with atexit.register() to ensure all events are flushed on exit
- The Python SDK has NO identify() method — use posthog_client.set(distinct_id=user_id, properties={...}) to set person properties, or use identify_context(user_id) within a context
