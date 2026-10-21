# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 `McpServer` API.
- Installed and pinned the beta MCP analytics SDK (`@posthog/mcp` 0.23.0) and `posthog-node` 5.56.4.
- Created one module-scoped PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with fail-fast validation when either variable is missing.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful PostHog shutdown handling for `SIGTERM` without changing either tool's behavior.
- Added the supplied project token and ingestion host to `.env`.
- Verified the integration with `npm run build`; TypeScript completed successfully.

## Files modified or created

- `src/index.ts` — initialized PostHog, wrapped the MCP server, and added shutdown handling.
- `package.json` — added pinned analytics dependencies.
- `package-lock.json` — recorded installed dependency versions.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

1. Ensure the process manager or launch command loads `.env` (or injects the same environment variables) before starting the server. Do not commit `.env`.
2. Restart the MCP server and invoke a tool. PostHog will then receive `$mcp_tools_list`, `$mcp_initialize`, and `$mcp_tool_call` events as applicable; failed calls remain `$mcp_tool_call` events with `$mcp_is_error = true` and may also emit `$exception`.
3. To validate model capture, connect with a compatible client, confirm `tools/list` includes the required `llm_model` argument, and make a call with a non-`unknown` value. The SDK removes that SDK-owned argument before the tool handler and records `$mcp_llm_model_source` as `self_reported`.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and full event reference. The `@posthog/mcp` package is pre-1.0, so review release notes before future upgrades.
