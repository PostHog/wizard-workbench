# PostHog MCP analytics setup

> **Experimental:** The Rust SDK is experimental and not officially supported. Its API, options, and `$mcp_*` events may change in any `posthog-rs` release; do not treat this setup as production-ready reporting.

## Changes made

- Added `posthog-rs` 0.30.0 with the `mcp` feature; the existing `rmcp` 3.8.0 dependency remains compatible.
- Created one shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing `Notes` `ServerHandler` with `posthog_rs::mcp::instrument` before serving it over the unchanged stdio transport.
- Added graceful `posthog.shutdown().await` flushing after the server stops.
- Preserved existing tool registration and behavior. Default intent, model, conversation, error, and tool-call analytics remain enabled.
- Configured the supplied PostHog values in the ignored local `.env` file.

## Files modified or created

- `Cargo.toml` — added `posthog-rs` with MCP support.
- `Cargo.lock` — resolved `posthog-rs` 0.30.0 and transitive dependencies.
- `src/main.rs` — initialized and wrapped the MCP server, with shutdown flushing.
- `.env` — stored the project token and host locally (not committed).
- `.gitignore` — excludes `.env`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `cargo build` completed successfully.
- Static review confirmed the default model and conversation capture options were not disabled.
- No stdout logging was added, so the stdio protocol channel remains clean.

## Manual next steps

1. Ensure the MCP server process receives `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. Rust does not load `.env` automatically, so export them or configure them in the MCP client/process environment.
2. Restart or reconnect the MCP server, then invoke a tool. `$mcp_*` events should appear in PostHog after the next handled request.
3. Use the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
