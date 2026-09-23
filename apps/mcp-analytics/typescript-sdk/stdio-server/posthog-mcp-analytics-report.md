# PostHog MCP Analytics Setup Report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 high-level `McpServer` (Path A).
- Installed exact versions of the beta MCP analytics SDK and Node client:
  - `@posthog/mcp` `0.18.0`
  - `posthog-node` `5.53.0`
- Created one module-scope `PostHog` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful `SIGTERM` shutdown so queued analytics are flushed with `posthog.shutdown()`.
- Preserved the existing `echo` and `add` tool implementations and avoided stdout logging on the STDIO protocol channel.
- Added the supplied project token and host to the local `.env` file.

The wrapper captures MCP analytics including `$mcp_initialize`, `$mcp_tools_list`, `$mcp_tool_call`, and `$exception` for failures. Supported clients can self-report their model; the SDK advertises `llm_model`, strips its SDK-owned value before the existing tool handler runs, and records it as `$mcp_llm_model` with source `self_reported`.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP instrumentation, and graceful shutdown.
- `package.json` — added pinned analytics dependencies.
- `package-lock.json` — recorded resolved dependency versions.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- The resolved `@modelcontextprotocol/sdk` version is `1.30.1`, satisfying `@posthog/mcp` `0.18.0`'s v1 peer requirement.
- Static verification confirmed credentials are read only from environment variables, the wrapper is attached before tool registration, model capture is enabled, SDK-owned analytics arguments are removed before dispatch, and no `console.*` output was added.

## Manual next steps

1. Ensure the MCP launcher supplies `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the server process. The values are in the local `.env`, but the launcher must load that file or define the variables itself.
2. Restart or reconnect the MCP server, then invoke `tools/list` and one of the existing tools to generate the first analytics events.
3. Confirm the resulting `$mcp_*` events in PostHog and use the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
4. Keep `@posthog/mcp` pinned and review release notes before upgrading because it is pre-1.0.
