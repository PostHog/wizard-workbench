# PostHog MCP Analytics Setup Report

## Changes made

- Detected a Python MCP server using the official `mcp` 2.x `MCPServer` over STDIO.
- Added and pinned the beta `posthog` SDK at `7.83.1` using uv.
- Created one module-scope `Posthog` client using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the existing server with `instrument(server, posthog)` immediately after construction, preserving the existing tool and its behavior.
- Added graceful shutdown handling that waits for MCP analytics captures with `analytics.flush()` and then drains the PostHog client with `posthog.shutdown()`.
- Stored the supplied PostHog project token and ingestion host in the local `.env` file.
- Kept the default MCP analytics settings, including intent, calling-model, conversation-ID, tool-list, initialize, and exception capture.

Python MCP Analytics is currently in beta, so the SDK is pinned to avoid unexpected minor-version changes.

## Files modified or created

- `server.py` — initialized PostHog, instrumented the MCP server, and added shutdown flushing.
- `pyproject.toml` — added the exact dependency `posthog==7.83.1`.
- `uv.lock` — recorded the resolved PostHog SDK and transitive dependencies.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- Confirmed the project uses the supported official MCP 2.x server path (P1).
- Confirmed `posthog==7.83.1`, above the required `7.62.0` minimum, in both the manifest and lockfile.
- Confirmed both required environment keys are present in `.env` without exposing their values.
- Confirmed instrumentation runs once, before tool registration, with model capture and conversation IDs left enabled by default.
- Confirmed the STDIO path adds no stdout logging.
- Confirmed queued events are flushed during normal server shutdown.
- The project defines no build, type-check, lint, formatter, or test command, so verification was static and the server was not started.

## Manual steps

1. Ensure the process that launches the MCP server loads `.env`, or export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` into its environment. Python does not load `.env` automatically in this project.
2. Keep `.env` out of version control and deployment artifacts that should not contain environment configuration.
3. Restart the MCP server, connect an MCP client, and call a tool. PostHog will begin receiving events such as `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call`.
4. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
