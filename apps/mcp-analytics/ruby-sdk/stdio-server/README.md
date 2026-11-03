# wb-ruby-stdio-server

A PostHog-less MCP server built on the official `mcp` gem (STDIO transport). Test fixture for `wizard mcp-analytics`.

`.wizard-root` registers this directory as an app for local runs: `findApps` in `services/wizard-ci/utils.ts` only treats a `Gemfile` alongside `config.ru` as a Ruby app.

Expected wizard outcome:

- runs `bundle add posthog-ruby` and locks 3.29.0 or later
- creates a `PostHog::Client` from `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST`
- instruments the `MCP::Server` before the transport opens
- shuts the client down when the server exits
- reports that the Ruby SDK is experimental
