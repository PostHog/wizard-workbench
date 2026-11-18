# Experimental Ruby MCP analytics setup (not officially supported)

> **The Ruby MCP analytics SDK is experimental and not officially supported.** Its API and `$mcp_*` events may change in a minor `posthog-ruby` release; do not treat this integration as production-ready.

## Changes made

- Added `posthog-ruby` with a `>= 3.29.0` floor and a `~> 3.0` major bound.
- Created one module-scope `PostHog::Client` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Routed PostHog SDK logging to stderr so STDIO protocol output remains clean.
- Wrapped the existing official `MCP::Server` with `PostHog::MCP.instrument` before opening the transport.
- Added an `at_exit` shutdown hook to flush queued events without changing tool behavior.
- Added the supplied PostHog project token and host to `.env`.

## Files modified or created

- `Gemfile` — declared the PostHog Ruby SDK dependency.
- `server.rb` — initialized PostHog, instrumented the server, and added shutdown handling.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — created this report.

`Gemfile.lock` was inspected but could not be updated because `bundle` is not installed in this environment.

## Manual steps

1. Install Ruby 3.0 or later and Bundler, then run `bundle install` to resolve `posthog-ruby` and update `Gemfile.lock`. Confirm the locked `posthog-ruby` version is 3.29.0 or later.
2. Ensure the MCP client configuration exports `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; Ruby does not load `.env` automatically in this project.
3. Re-run the project's Ruby checks after dependencies are installed. No RuboCop configuration was found.
4. Connect an MCP client and call a tool. The server will then emit `$mcp_*` events such as `$mcp_tool_call` to PostHog.

See the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
