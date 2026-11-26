# PostHog MCP Analytics Setup Report

## Changes made

- Detected an official Go MCP SDK STDIO server and used the supported Go wrapper path.
- Added `posthogmcpsdk` v2.3.1 and `posthog-go` v2.3.1 as direct, pinned module dependencies.
- Created one PostHog client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Wrapped the server once with `posthogmcpsdk.Instrument` before tool registration, preserving existing tool behavior.
- Added server name/version metadata and graceful `client.Close()` flushing when the server exits.
- Added stderr warnings when required PostHog configuration is absent; the MCP server continues to run without analytics.
- Configured the supplied project token and host in the local `.env` file.
- Ran `go mod tidy`, `go fmt ./...`, `go build -o /dev/null ./...`, and `go vet ./...` successfully.

The Go MCP analytics SDK is currently beta and may introduce breaking changes in minor releases.

## Files modified or created

- `main.go` — PostHog client initialization, server instrumentation, configuration warnings, and shutdown flushing.
- `go.mod` — direct PostHog MCP SDK and core SDK dependencies.
- `go.sum` — resolved dependency checksums.
- `.env` — local `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `posthog-mcp-analytics-report.md` — this report.

## Manual next steps

1. Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the MCP server's `env` block or exported process environment. Go does not load `.env` automatically, and MCP clients may launch the server from another working directory.
2. Keep CI and container builds on Go 1.25 or later. The existing `go 1.25.0` directive and go-sdk v1.6.1 were unchanged.
3. If protocol revision `2026-07-28` is needed, upgrade the official Go MCP SDK to v1.8.0 or later separately.
4. Restart the MCP server and call a tool. PostHog will begin receiving `$mcp_tool_call` events; see the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
