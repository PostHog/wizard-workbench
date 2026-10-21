# PostHog MCP analytics setup report

## Changes made

- Detected a TypeScript Hono MCP server using a custom JSON-RPC dispatcher (Path C).
- Installed and pinned the beta `@posthog/mcp` package at `0.23.0` and `posthog-node` at `5.56.4`.
- Added one module-scoped `PostHogMCP` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Prepared the advertised tool list so PostHog can collect agent intent and self-reported model metadata, while stripping SDK-owned arguments before the original tool handlers run.
- Added `$mcp_tools_list` and `$mcp_tool_call` capture, including durations, sanitized parameters and responses, errors, request protocol headers, user-agent metadata, and vendor-client metadata.
- Preserved the existing tool results and error responses. Conversation-ID response injection is disabled so analytics does not alter tool output.
- Added graceful PostHog draining on `SIGTERM`.
- Added the supplied PostHog project token and ingestion host to the gitignored local `.env` file.

## Files modified or created

- `src/index.ts` — initialized `PostHogMCP` and instrumented the custom dispatcher.
- `package.json` — added pinned PostHog dependencies.
- `package-lock.json` — created dependency lock data.
- `.env` — created local PostHog configuration; already excluded by `.gitignore`.
- `posthog-mcp-analytics-report.md` — created this report.

## Verification

- `npm run build` passed (`tsc --noEmit`).
- Verified in source that `tools/list` uses `prepareToolList`, `tools/call` dispatches the cleaned arguments from `prepareToolCall`, and captured model metadata is forwarded to `$mcp_tool_call`.

## Manual next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the deployed server environment because the local `.env` file is gitignored and will not be deployed.
2. Restart or redeploy the MCP server, then make a `tools/list` request and at least one `tools/call` request.
3. Confirm `$mcp_tools_list` and `$mcp_tool_call` events appear in PostHog. Failed tool calls remain `$mcp_tool_call` events with `$mcp_is_error = true` and also emit a sibling `$exception`.
4. The server's existing `2024-11-05` protocol response was intentionally left unchanged. If initialize analytics for a current MCP revision is required, upgrade the server protocol separately and test that behavior change.

`@posthog/mcp` is pre-1.0 and may include breaking changes in minor releases, so keep the pinned version until upgrades are tested. See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
