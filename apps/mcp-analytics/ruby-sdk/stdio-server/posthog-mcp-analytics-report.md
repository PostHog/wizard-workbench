# PostHog MCP analytics setup

> **Experimental and not officially supported:** The Ruby `PostHog::MCP` SDK is experimental, is not maintained by the MCP Analytics team, and may change its API or `$mcp_*` event contract in a minor `posthog-ruby` release. Do not treat this integration as production-ready reporting infrastructure.

## Changes made

- Added `posthog-ruby` with the skill-recommended `~> 3.0` constraint to the bundle manifest.
- Created one module-scope `PostHog::Client` using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the environment.
- Directed PostHog SDK logging to stderr so the stdio MCP protocol channel remains clean.
- Wrapped the existing official `MCP::Server` with `PostHog::MCP.instrument` before opening its existing stdio transport.
- Added an `at_exit` shutdown hook so queued analytics events are flushed when the process exits.
- Added the configured project token and host to `.env` without putting either value in source code.
- Preserved the existing `AddNote` tool implementation and transport behavior.

## Files modified or created

- `Gemfile` — added the `posthog-ruby` dependency declaration.
- `server.rb` — added the PostHog client, stderr logging, MCP wrapper, and shutdown hook.
- `.env` — created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- `posthog-mcp-analytics-report.md` — created this report.

`Gemfile.lock` was inspected but could not be updated because the `bundle` executable is unavailable in this environment.

## Verification

Static verification confirmed that:

- the existing server uses the official `mcp` gem and `MCP::Server`;
- the locked MCP version is `1.8.2`, which satisfies the wrapper's `>= 1.4` requirement;
- instrumentation runs exactly once after server construction and before transport startup;
- model capture and conversation IDs remain enabled at their defaults;
- both required environment keys are present in `.env`;
- no tool behavior or tool arguments were changed.

Dependency installation and runtime verification could not be completed because `bundle install` failed with `bundle: command not found`.

## Manual steps

1. Install Ruby 3.0 or later and Bundler, then run `bundle install` in this directory. Confirm `Gemfile.lock` resolves `posthog-ruby` to version `3.29.0` or later.
2. If running Ruby 3.4 or later and Bundler reports missing default gems, add `logger` and `base64` to the bundle as required by `posthog-ruby`.
3. Ruby does not load `.env` automatically. Export `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, or place them in the `env` block of the MCP client's server configuration before launching this stdio server.
4. Connect an MCP client and call a tool. PostHog should then receive `$mcp_initialize`, `$mcp_tools_list`, and `$mcp_tool_call` events as applicable.
5. Review the [PostHog MCP analytics documentation](https://posthog.com/docs/mcp-analytics) for the dashboard and event reference.
