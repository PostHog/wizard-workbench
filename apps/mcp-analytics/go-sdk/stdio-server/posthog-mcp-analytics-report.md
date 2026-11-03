# PostHog MCP Analytics Setup Report

## Changes made

- Instrumented the official Go MCP SDK server using the Go wrapper path (`posthogmcpsdk.Instrument`).
- Added `posthog-go` and `posthogmcpsdk` v1.39.0 dependencies.
- Created one PostHog client at process startup using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Added server name and version metadata while leaving the existing `add_note` tool and handler behavior unchanged.
- Added client shutdown handling so queued analytics events are flushed when the server exits, including its existing fatal server-error path.
- Kept model capture, conversation IDs, intent capture, parameter capture, and response capture at SDK defaults.
- Configured the supplied project token and ingestion host in the local `.env` file.

The Go MCP analytics SDK is currently beta and may introduce breaking changes in minor releases.

## Files modified or created

- `main.go` — initializes PostHog, wraps the MCP server, and closes the client on shutdown.
- `go.mod` — records direct dependencies on `posthog-go` and `posthogmcpsdk` v1.39.0.
- `go.sum` — records resolved dependency checksums.
- `.env` — stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` locally.
- `posthog-mcp-analytics-report.md` — this report.

## Verification

- `go fmt main.go` passed.
- `go build -o /dev/null ./...` passed.
- `go vet ./...` passed.
- Static review confirmed exactly one instrumentation wrapper and no options disabling model capture or conversation IDs.
- The project remains on Go 1.25.0 and `github.com/modelcontextprotocol/go-sdk` v1.6.1. Dependency installation did not raise either version.

## Manual next steps

1. Ensure the runtime, container, and CI export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; Go does not load `.env` automatically unless the application adds a dotenv loader.
2. Ensure CI and deployment images use Go 1.25 or later.
3. Connect an MCP client and call a tool. The next handled request should produce `$mcp_tool_call` events in PostHog.
4. The current go-sdk v1.6.1 supports this integration, but protocol revision `2026-07-28` requires go-sdk v1.8.0 or later if that revision is needed later.

See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
