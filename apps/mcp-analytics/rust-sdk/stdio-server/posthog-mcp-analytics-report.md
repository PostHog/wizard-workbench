# PostHog MCP analytics setup

> **Experimental:** The Rust MCP analytics SDK is experimental and not officially supported. Its API, options, and `$mcp_*` events may change in a `posthog-rs` release; do not treat this setup as production-ready reporting yet.

## Changes made

- Added `posthog-rs` 0.31 with the `mcp` feature; Cargo resolved version 0.31.3.
- Kept the existing `rmcp` 3.8 stdio server and tool implementation unchanged.
- Created one shared PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the existing `Notes` `ServerHandler` with `posthog_rs::mcp::instrument` before serving it.
- Added `posthog.shutdown().await` after the stdio server stops so queued analytics events are sent.
- Added the supplied PostHog configuration to the local `.env` and ensured `.env` is ignored by Git.
- Verified the integration successfully with `cargo build`.

## Files modified or created

- `Cargo.toml` — added the PostHog Rust SDK dependency and MCP feature.
- `Cargo.lock` — locked `posthog-rs` 0.31.3 and its transitive dependencies.
- `src/main.rs` — initialized PostHog, wrapped the server, and added graceful analytics shutdown.
- `.env` — created local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `.gitignore` — ignores `.env`.
- `posthog-mcp-analytics-report.md` — this report.

## Manual steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP client's server `env` configuration (or export them before starting the server). Rust does not load `.env` automatically, and MCP clients may start the server from another working directory.
2. Rebuild or restart the MCP server, connect an MCP client, and call a tool.
3. Confirm `$mcp_*` events appear in PostHog. See the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
