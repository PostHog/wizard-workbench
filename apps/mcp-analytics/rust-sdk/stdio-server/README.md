# wb-rust-stdio-server

A PostHog-less MCP server built on `rmcp` (`ServerHandler`, STDIO transport). Test fixture for `wizard mcp-analytics`.

Expected wizard outcome (path RS1):

- runs `cargo add posthog-rs --features mcp` and locks 0.29.0 or later
- creates the client from `POSTHOG_PROJECT_TOKEN`, and still starts with no token set
- serves `posthog_rs::mcp::instrument(Notes, posthog.clone())` in place of `Notes`
- calls `posthog.shutdown().await` when the server exits
- verifies with `cargo build` and `cargo clippy`
- reports that the Rust SDK is experimental
