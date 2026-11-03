# PostHog MCP Analytics Setup Report

> **The Rust MCP analytics SDK is experimental and not officially supported.** Its API, options, and `$mcp_*` event contract may change in any `posthog-rs` release; do not treat this integration as production-ready reporting infrastructure.

## Changes made

- Detected an `rmcp` 3.8 stdio server using a `ServerHandler` and selected instrumentation path **RS1**.
- Added `posthog-rs` 0.30.0 with the `mcp` feature.
- Created one shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing `Notes` server with `posthog_rs::mcp::instrument(...)` without changing tool behavior.
- Added graceful `posthog.shutdown().await` handling after the MCP service stops.
- Stored the provided token and host in the ignored local `.env` file.
- Verified the integration with successful `cargo build` and `cargo clippy` runs.

Once the server handles requests, PostHog will receive supported Rust MCP events such as `$mcp_tool_call`, `$mcp_tools_list`, `$mcp_initialize`, `$mcp_unknown_tool`, `$mcp_input_required`, and `$exception` for failed calls.

## Files modified or created

- `Cargo.toml` — added `posthog-rs` with MCP support.
- `Cargo.lock` — locked `posthog-rs` 0.30.0 and its dependencies; `rmcp` remains at 3.8.0.
- `src/main.rs` — added the client, server wrapper, environment reads, and shutdown flush.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; this file is ignored by Git.
- `posthog-mcp-analytics-report.md` — created this report.

## Manual steps

- Rust does not load `.env` automatically in this project. Export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` into the MCP server process environment, or configure the process manager to load the local `.env`, before starting the server.
- Connect an MCP client and call a tool to generate the first analytics events.
- Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboard and event-reference guidance.
