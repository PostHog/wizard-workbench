# PostHog MCP analytics setup report

## Changes made

- Installed the beta Go MCP analytics SDK:
  - `github.com/posthog/posthog-go/posthogmcpsdk v1.39.0`
  - `github.com/posthog/posthog-go v1.39.0`
- Kept the existing official MCP Go SDK at `github.com/modelcontextprotocol/go-sdk v1.6.1` and the existing Go directive at `1.25.0`.
- Created one PostHog client at process startup using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Wrapped the existing `mcp.NewServer` instance with `posthogmcpsdk.Instrument` before registering or serving tools.
- Added server metadata for `wb-go-stdio-server` version `0.1.0`.
- Added `defer client.Close()` so queued analytics events flush when the server exits normally.
- Preserved the existing `add_note` tool and stdio behavior unchanged.
- Stored the supplied project token and ingestion host in the local `.env` file.

The default analytics options remain enabled, including agent intent, calling-model capture, and conversation correlation. Tool requests will produce `$mcp_tool_call` events; unregistered tools can produce `$mcp_unknown_tool` events.

## Files modified or created

- `main.go` — initialized PostHog, instrumented the MCP server, and added client shutdown handling.
- `go.mod` — added direct PostHog SDK dependencies.
- `go.sum` — recorded dependency checksums.
- `.env` — added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `go build ./...` passed.
- `go vet ./...` passed.
- Static review confirmed the wrapper is installed once and no options disable intent, model, or conversation capture.

## Manual next steps

1. Go does not load `.env` automatically. Ensure the process launcher exports `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env`, or use the project's existing environment-loading mechanism before starting the server.
2. Rebuild and redeploy the server in any runtime or container that packages it. Confirm CI and deployment environments use Go 1.25 or newer.
3. Connect an MCP client and call `add_note`; analytics will appear after the request is handled and the batch is flushed.
4. The current go-sdk version is `v1.6.1`. Upgrade to `v1.8.0` or newer separately if the server needs MCP protocol revision `2026-07-28`; this integration intentionally did not change the MCP SDK.
5. Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the complete event reference.

The Go MCP analytics SDK is currently beta and may include breaking changes in minor releases.
