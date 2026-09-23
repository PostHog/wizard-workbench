# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript Hono custom MCP dispatcher and used the custom-dispatcher (Path C) integration.
- Installed pinned `@posthog/mcp` `0.18.0` and `posthog-node` `5.53.0` dependencies.
- Created one module-scope `PostHogMCP` client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Prepared advertised tool schemas for intent and self-reported model capture, and stripped SDK-owned analytics arguments before invoking the existing tool handlers.
- Added `$mcp_initialize` capture for `2025-11-25` handshakes, `$mcp_tools_list` capture for listings, and `$mcp_tool_call` capture for successful and failed calls.
- Included tool name, description, sanitized parameters/response, duration, error state, intent, model metadata, protocol revision, MCP session header, user agent, and vendor client header when available.
- Added graceful PostHog shutdown on `SIGTERM`.
- Stored the supplied project token and host in the local `.env` file without hardcoding either value in source.
- Created an [MCP Server Analytics dashboard](https://us.posthog.com/project/483112/dashboard/2128926) with tool-call volume, error-rate, and p95 latency insights.

## Files modified or created

- `src/index.ts` — initialized `PostHogMCP`, instrumented the dispatcher, and added shutdown handling.
- `package.json` — added `@posthog/mcp` and `posthog-node`.
- `package-lock.json` — recorded the installed dependency graph.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Confirmed `tools/list` preparation advertises required `context` and `llm_model` fields.
- Confirmed `prepareToolCall` removes SDK-owned analytics fields before `runTool` receives arguments.
- Confirmed non-empty, non-`unknown` model values are captured as `$mcp_llm_model` with `$mcp_llm_model_source` set to `self_reported` (or `client_metadata` when recognized metadata is available).
- Dashboard queries are valid and ready to populate; no MCP analytics events had arrived during setup.

## Manual next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed server environment. The local `.env` file is for local configuration and must not be committed.
2. Ensure the process launcher loads the local `.env` file when running locally, or export the variables before `npm start`.
3. Restart the MCP server and send `tools/list` and `tools/call` requests. `$mcp_*` events will then appear in PostHog and populate the dashboard.
4. Keep `@posthog/mcp` pinned and review release notes before upgrades because the package is pre-1.0.

See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the event and dashboard reference.
