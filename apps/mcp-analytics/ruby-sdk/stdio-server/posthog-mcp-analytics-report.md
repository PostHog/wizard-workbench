# Ruby MCP analytics is experimental and not officially supported

`PostHog::MCP` is experimental, is not maintained by the MCP Analytics team, and should not be treated as production-ready. Its API and `$mcp_*` events may change in a minor `posthog-ruby` release.

## Changes made

- Detected an official Ruby `mcp` gem server using `MCP::Server` and stdio transport; selected wrapper path R1.
- Added `posthog-ruby >= 3.29.0` to the Bundler manifest and installed the resolved 3.29.0 release.
- Created one module-scope `PostHog::Client` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Routed SDK logging to stderr so stdout remains reserved for MCP protocol traffic.
- Wrapped the existing server with `PostHog::MCP.instrument(server, posthog)` without changing the tool or transport behavior.
- Added `at_exit { posthog.shutdown }` to flush queued analytics.
- Added the supplied project token and host to the local `.env` file.
- Kept model capture, conversation IDs, intent capture, session handling, and exception autocapture at SDK defaults.

## Files modified or created

- `Gemfile` — added the `posthog-ruby` dependency constraint.
- `Gemfile.lock` — locked `posthog-ruby` 3.29.0 and its dependency.
- `server.rb` — initialized PostHog, instrumented the server, configured stderr logging, and added shutdown flushing.
- `.bundle/config` — configured a project-local `vendor/bundle` install path.
- `vendor/bundle/` — contains the Bundler-installed project dependencies.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — created this report.

## Verification

- `bundle install` completed successfully using Ruby 3.3 and a project-local gem path.
- `Gemfile.lock` confirms the official `mcp` gem at 1.8.2 and `posthog-ruby` at 3.29.0.
- Static inspection confirms the analytics wrapper runs after server construction and before the stdio transport opens.
- No options disable model capture or conversation IDs.
- Both required environment keys are present in `.env`.
- Per the Ruby verification guardrail, the stdio server itself was not started.

## Manual steps

1. Ensure the server process exports `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. This project does not include a dotenv loader, so Ruby will not load `.env` automatically.
2. Start the server normally and call a tool from an MCP client. The next requests should produce canonical events such as `$mcp_tools_list`, `$mcp_tool_call`, and `$mcp_initialize` where the protocol revision includes an initialize handshake.
3. Review the [MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and complete event reference.
