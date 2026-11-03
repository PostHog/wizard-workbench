# Experimental Ruby SDK — PostHog MCP analytics report

> ⚠️ **Needs your attention**
> - The Ruby MCP analytics SDK is experimental and not officially supported. Its API and `$mcp_*` events may change in a minor `posthog-ruby` release; do not treat this setup as production-ready reporting.
> - `posthog-ruby` 3.29.0 is installed in the current Ruby environment, but the harness could not invoke the user-installed Bundler executable to update `Gemfile.lock`. Run `bundle install` in a normal shell and commit the updated lockfile.
> - This project does not load `.env` itself. Export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in the MCP server runtime, or load the local `.env` through the deployment environment before starting the server.

## Changes made

- Detected an official Ruby `mcp` gem server using `MCP::Server` with the stdio transport (instrumentation path R1).
- Added the `posthog-ruby >= 3.29.0` dependency declaration and installed `posthog-ruby` 3.29.0 with RubyGems.
- Created one module-scope `PostHog::Client` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Routed PostHog SDK logging to stderr so stdout remains reserved for the MCP protocol.
- Wrapped the existing server with `PostHog::MCP.instrument(server, posthog)` without changing tool registration or behavior.
- Added `at_exit { posthog.shutdown }` so queued analytics events flush during normal shutdown.
- Added the supplied project token and host to the local `.env` file without hardcoding either value in source.

## Files modified or created

- `Gemfile` — declared `posthog-ruby >= 3.29.0`.
- `server.rb` — initialized PostHog, instrumented the server, configured stderr logging, and added shutdown flushing.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — created this report.

`Gemfile.lock` was inspected but remains unchanged because the harness rejected the user-installed Bundler executable path.

## Verification

Static verification confirmed:

- The project uses the supported official `mcp` gem at locked version 1.8.2.
- The wrapper is applied once before `StdioTransport#open`.
- The client is created once and reads both configuration values from environment variables.
- Default intent, model, and conversation ID capture remain enabled; no disabling options were added.
- The original `AddNote` tool implementation is unchanged.
- Both environment keys are present in `.env`.
- RubyGems reports `posthog-ruby` 3.29.0 and `concurrent-ruby` 1.3.8 installed for Ruby 3.3.

The SDK installation and source integration were verified statically. Bundler lockfile verification remains a manual follow-up because the harness rejected the absolute path of the user-installed Bundler executable.

## Next steps

1. Run `bundle install` in a normal shell and verify `Gemfile.lock` includes `posthog-ruby` 3.29.0 or later.
2. Ensure the server process receives `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; Ruby does not automatically load `.env`.
3. Start the server through the normal MCP client and call a tool.
4. Confirm `$mcp_tool_call` events appear in PostHog. See the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for dashboards and the event reference.
