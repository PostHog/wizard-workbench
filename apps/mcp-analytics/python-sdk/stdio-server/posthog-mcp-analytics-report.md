# PostHog MCP Analytics Setup Report

## Changes made

- Instrumented the Python MCP 2.x `MCPServer` using the supported P1 `instrument(server, posthog)` wrapper path.
- Added a module-scope PostHog client configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Kept the existing `add_note` tool and server behavior unchanged.
- Added graceful event draining on normal shutdown and a bounded, stdio-safe SIGTERM shutdown handler.
- Added the beta Python SDK dependency as `posthog>=8,<9`; uv resolved `posthog==8.0.1`.
- Configured the provided project token and ingestion host in the local `.env` file.

## Files modified or created

- `server.py` — PostHog client, MCP wrapper, and shutdown handling.
- `pyproject.toml` — pinned PostHog dependency range.
- `uv.lock` — resolved dependency lock, including `posthog==8.0.1`.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `uv sync` completed successfully and installed `posthog==8.0.1` with the existing MCP 2.x server dependencies.
- Static verification confirmed the wrapper runs immediately after server construction, default model and conversation capture remain enabled, no tool handler behavior changed, and no stdout logging was added.
- Both required environment variables are present in `.env`.

## Manual next steps

- Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP client's server `env` configuration. Python does not automatically load `.env`, and MCP clients may launch this server from another working directory.
- Restart or reconnect the MCP client, then invoke a tool. The server will begin sending `$mcp_*` events, including `$mcp_tool_call`, to PostHog.
- Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.

The Python MCP analytics SDK is currently beta and may introduce breaking changes in future releases; the dependency is pinned to major version 8.
