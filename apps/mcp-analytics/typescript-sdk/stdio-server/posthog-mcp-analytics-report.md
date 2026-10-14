# PostHog MCP analytics setup report

## Changes made

- Detected a TypeScript STDIO MCP server using the official `@modelcontextprotocol/sdk` v1 high-level `McpServer` and selected instrumentation Path A.
- Installed and pinned `@posthog/mcp` at `0.22.3` and `posthog-node` at `5.56.1` without changing the existing MCP SDK dependency.
- Created one module-scope PostHog client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server immediately after construction with `instrument(server, posthog, { captureModel: true })`.
- Added graceful PostHog shutdown on `SIGTERM` while leaving both existing tool handlers unchanged.
- Configured the supplied project token and host in `.env`; no credentials were embedded in source code.

## Files modified or created

- `src/index.ts` — PostHog client initialization, MCP instrumentation, and shutdown draining.
- `package.json` — pinned MCP analytics dependencies.
- `package-lock.json` — npm dependency lockfile.
- `.env` — PostHog environment variables.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `npm run build` completed successfully (`tsc --noEmit`).
- Confirmed the resolved MCP SDK is compatible with the installed analytics package.
- Confirmed the installed wrapper adds the required `llm_model` schema field, strips SDK-owned analytics arguments before tool handlers run, and records non-unknown self-reports as `$mcp_llm_model` with source `self_reported`.
- Confirmed both required environment variable keys are present.

## Manual next steps

1. Ensure the MCP process launcher loads `.env` or otherwise exports `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` before starting the server.
2. Restart the MCP server and invoke a tool. PostHog will begin receiving `$mcp_*` events such as `$mcp_tool_call`; failed calls can also emit `$exception`.
3. Build dashboards or inspect the event reference using the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics).

`@posthog/mcp` is pre-1.0 beta software, so review release notes before future upgrades.
