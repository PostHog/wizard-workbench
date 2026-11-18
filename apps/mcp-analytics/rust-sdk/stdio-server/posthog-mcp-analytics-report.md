# PostHog MCP Analytics Setup

> **The Rust SDK is experimental and not officially supported.** Its API, options, and `$mcp_*` events may change in a future release, so this setup should not be treated as production-ready reporting infrastructure.

## Changes made

- Added `posthog` 1.0.0 with the `mcp` feature and retained the existing `rmcp` 3.8.0 dependency.
- Created one shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing `Notes` `ServerHandler` with `posthog::mcp::instrument` without changing tool behavior.
- Preserved the stdio transport and added `posthog.shutdown().await` after serving so queued events are flushed.
- Kept the server operational when analytics variables are absent, with a warning written only to stderr.
- Added the provided PostHog project configuration to the local `.env` file.

## Files modified or created

- `Cargo.toml` — added the PostHog dependency and MCP feature.
- `Cargo.lock` — locked `posthog` 1.0.0 and its transitive dependencies.
- `src/main.rs` — initialized PostHog, wrapped the rmcp server, and added shutdown flushing.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `cargo build` completed successfully.
- The integration uses the default MCP analytics options, so intent, model capture, and conversation IDs remain enabled.
- No tool implementation or response behavior was changed.

## Manual steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP server's `env` block (or export them before launch). Rust does not load `.env` automatically.
2. Restart or reconnect the MCP client, then call a tool. The server will begin sending `$mcp_*` events, including `$mcp_tool_call`, to PostHog.
3. Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
