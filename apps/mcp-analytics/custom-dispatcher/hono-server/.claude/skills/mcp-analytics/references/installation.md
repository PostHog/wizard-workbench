> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Install MCP Analytics

Canonical URL: https://posthog.com/docs/mcp-analytics/installation

## On this page

- [Install with the wizard](#install-with-the-wizard)
- [Install by hand](#install-by-hand)
- [What each SDK captures](#what-each-sdk-captures)

MCP Analytics captures how agents use your MCP server. Add the SDK for your server's language, and every tool call becomes a `$mcp_tool_call` event in PostHog.

## Install with the wizard

The wizard detects your server, installs the SDK, and adds the instrumentation. It supports TypeScript and Python servers, and [LLM coding agents](https://posthog.com/blog/envoy-wizard-llm-agent.md) such as Cursor:

`npx @posthog/wizard mcp-analytics`

## Install by hand

Choose your server's language. For tools that a web page registers, choose WebMCP:

-   [![](https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/docs/integrate/nodejs.svg)TypeScript](https://posthog.com/docs/mcp-analytics/installation/typescript.md)

-   [![](https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/docs/integrate/python.svg)Python](https://posthog.com/docs/mcp-analytics/installation/python.md)

-   [![](https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/docs/integrate/go.svg)Go](https://posthog.com/docs/mcp-analytics/installation/go.md)

-   [![](https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/docs/integrate/ruby.svg)Ruby](https://posthog.com/docs/mcp-analytics/installation/ruby.md)

-   [![](https://res.cloudinary.com/dmukukwp6/image/upload/posthog.com/contents/images/docs/integrate/js.svg)WebMCP](https://posthog.com/docs/mcp-analytics/installation/webmcp.md)

Each page has a Markdown version for coding agents. Add `.md` to the URL, such as [`/docs/mcp-analytics/installation/python.md`](https://posthog.com/docs/mcp-analytics/installation/python.md).

## What each SDK captures

Every server SDK sends the core events, `$mcp_tool_call` for each tool call and `$exception` for each failed call, so your insights and dashboards work across languages. The SDKs differ in which other events and features they implement:

| Feature | TypeScript | Python | Go | Ruby |
| --- | --- | --- | --- | --- |
| Tool calls and failures (`$mcp_tool_call`, `$exception`) | Yes | Yes | Yes | Yes |
| Tool listings, handshakes, and resource reads | Yes | Yes | No | Yes |
| Unknown-tool calls (`$mcp_unknown_tool`) | No | No | Yes | No |
| `input_required` rounds (`$mcp_input_required`) | No | No | Yes | No |
| [Agent intent](https://posthog.com/docs/mcp-analytics/intent.md) (`context` argument) | Yes | Yes | Yes | Yes |
| Intent fallback callback | Yes | Yes | No | Yes |
| [Model capture](https://posthog.com/docs/mcp-analytics/events.md#model-capture) | Yes | Yes | Yes | Yes |
| [Conversation IDs](https://posthog.com/docs/mcp-analytics/conversation-id.md) | Yes | Yes | Yes | Yes |
| [Identifying users](https://posthog.com/docs/mcp-analytics/identifying-users.md) | Yes | Yes | Yes | Yes |
| [Missing capabilities](https://posthog.com/docs/mcp-analytics/missing-capability.md) (`get_more_tools`) | Yes | Yes | No | Yes |
| Stateless session token | Yes | Yes | No | Yes |
| Custom dispatchers | Yes | Yes | Yes | Yes |
| Wizard | Yes | Yes | No | No |
| Support | Beta | Beta | Beta | Experimental |

The Go SDK sends no `$identify` event.

All SDKs remove credentials and binary content from captured payloads. See [Privacy](https://posthog.com/docs/mcp-analytics/privacy.md).
