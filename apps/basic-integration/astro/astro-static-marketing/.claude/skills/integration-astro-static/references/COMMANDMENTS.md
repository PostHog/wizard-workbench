# Framework rules

Follow these when integrating PostHog into this framework.

- Always use the is:inline directive on PostHog script tags to prevent Astro from processing them and causing TypeScript errors
- Use PUBLIC_ prefix for client-side environment variables in Astro (e.g., PUBLIC_POSTHOG_PROJECT_TOKEN)
- Create a posthog.astro component in src/components/ for reusable initialization across pages
- Import the PostHog component in a Layout and wrap all pages with that layout
- Remember that source code is available in the node_modules directory
- Check package.json for type checking or build scripts to validate changes
- When a reverse proxy is configured, both /static/* AND /array/* must route to the assets origin (us-assets.i.posthog.com or eu-assets.i.posthog.com).
- posthog-js is the JavaScript SDK package name
- posthog.init() MUST be called before any other PostHog methods (capture, identify, etc.)
- posthog-js is browser-only — do NOT import it in Node.js or server-side contexts (use posthog-node instead)
- Autocapture is ON by default with posthog-js (tracks clicks, form submissions, pageviews). Keep autocapture enabled unless the user explicitly asks to turn it off.
- NEVER send PII in posthog.capture() event properties — no emails, full names, phone numbers, physical addresses, IP addresses, or user-generated content
- PII belongs in posthog.identify() person properties (email, name, role), NOT in capture() event properties
- Call posthog.identify(userId, { email, name, role }) on login AND on page refresh if the user is already logged in
- Call posthog.reset() on logout to unlink future events from the current user
- For SPAs without a framework router, capture pageviews with posthog.capture($pageview) or use the capture_pageview history_change option in init for History API routing
