# PostHog MCP Analytics Setup

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the custom-dispatcher (Path C) integration.
- Installed exact versions of the beta MCP analytics SDK (`@posthog/mcp` 0.21.4) and Node SDK (`posthog-node` 5.55.0).
- Added one module-scope `PostHogMCP` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Prepared advertised tool schemas for agent intent, self-reported model, and conversation correlation while continuing to dispatch only cleaned application arguments.
- Added `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` capture, including errors, duration, protocol/session metadata, client headers, intent, model, and conversation metadata.
- Added graceful PostHog shutdown on `SIGTERM` so queued events are flushed.
- Configured the supplied PostHog project values in a local ignored `.env` file.
- Verified the integration with `npm run build` (`tsc --noEmit`), which passed.

## Files modified or created

- `src/index.ts` — custom-dispatcher instrumentation and shutdown handling.
- `package.json` — pinned PostHog dependencies.
- `package-lock.json` — npm dependency lockfile.
- `.env` — local PostHog environment configuration (ignored; values are not documented here).
- `.gitignore` — ignores `.env` and `.env.local`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every deployed runtime or secret manager. Ensure your local process loads `.env` before running `npm start`.
2. Restart the MCP server and make an `initialize`, `tools/list`, and `tools/call` request. The corresponding `$mcp_*` events will then appear in PostHog; failed calls also emit a sibling `$exception` event.
3. Keep `@posthog/mcp` pinned and review release notes before upgrading because the package is pre-1.0.
4. See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
