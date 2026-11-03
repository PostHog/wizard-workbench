# PostHog MCP Analytics Setup Report

> ⚠️ **Manual step required:** Run `uv sync` in this project. The runtime did not have the `uv` executable, so `uv.lock` and the local environment could not be updated.

## Changes made

- Detected a Python MCP server using the official `mcp` 2.x `MCPServer` over STDIO.
- Added the beta PostHog Python SDK requirement (`posthog>=7.62.0`).
- Created one module-scope `Posthog` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the server once with `posthog.mcp.instrument(server, posthog)` before tool registration.
- Added graceful shutdown handling that awaits `analytics.flush()` and then calls `posthog.shutdown()`.
- Preserved the existing `add_note` tool and its behavior unchanged.
- Added the supplied project token and host to the local `.env` file.

## Files modified or created

- `server.py` — PostHog client initialization, MCP instrumentation, and shutdown flushing.
- `pyproject.toml` — added `posthog>=7.62.0`.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

`uv.lock` was not changed because `uv` was unavailable in the runtime.

## Verification

- Statically verified that instrumentation is initialized before tool registration.
- Confirmed model capture, conversation IDs, autocapture, and session recording were not disabled or overridden.
- Confirmed the STDIO server adds no stdout logging.
- Confirmed both required environment keys are present in `.env`.
- Confirmed queued MCP analytics events are drained during normal shutdown.
- Runtime import/build verification could not be performed until dependencies are synchronized.

## Next steps

1. Install/synchronize dependencies with `uv sync`.
2. Ensure the process launcher loads `.env`, or export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` before starting the server.
3. Restart the MCP server and call a tool. PostHog will begin receiving `$mcp_*` events, including `$mcp_tool_call`.
4. Review the [PostHog MCP Analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.

The Python MCP Analytics SDK is currently beta and may introduce breaking changes in minor releases.
