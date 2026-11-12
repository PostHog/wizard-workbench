# PostHog MCP Analytics Setup Report

## Changes made

- Detected a Python MCP server using the official `mcp` 2.x `MCPServer` over STDIO.
- Added the beta Python PostHog SDK with the supported pinned range `posthog>=7.62.0,<8`; uv resolved version `7.87.1`.
- Created one module-scope `Posthog` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the existing server with `instrument(server, posthog)` immediately after construction, preserving the existing tool and its behavior.
- Added graceful event delivery on normal server exit and a bounded shutdown path for `SIGTERM`.
- Added the supplied project token and US ingest host to the local `.env` file.
- Left model capture, conversation IDs, intent capture, session handling, autocapture, and exception capture at their SDK defaults.

The Python MCP Analytics SDK is currently in beta and may introduce breaking changes in minor releases. The project constrains it to the current major version.

## Files modified or created

- `pyproject.toml` — added the PostHog dependency range.
- `uv.lock` — recorded the resolved PostHog SDK and transitive dependencies.
- `server.py` — initialized PostHog, instrumented the MCP server, and added shutdown flushing.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `uv sync` completed successfully.
- The resolved `posthog` version is `7.87.1`, above the required `7.62.0` floor.
- Static review confirmed that the client is module-scoped, the server is wrapped once, tool behavior is unchanged, credentials are read from environment variables, and default model/conversation capture remains enabled.
- The project does not define a type-check, lint, or test command, so verification used dependency resolution and static inspection rather than starting the STDIO server.

## Manual next steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the `env` block of the MCP client configuration that launches this server. Python does not load `.env` automatically, and MCP clients may launch the process from another directory.
2. Keep `.env` out of version control according to your repository policy.
3. Restart or reconnect the MCP client, then call a tool. PostHog will begin receiving `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` events as applicable.
4. Review the MCP Analytics dashboard and event reference: https://posthog.com/docs/mcp-analytics
