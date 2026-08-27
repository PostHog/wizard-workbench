# mcp-stub

A stub PostHog MCP server. It stands in for `mcp.posthog.com` during a
warehouse e2e run, so the run exercises the whole agent-in-the-loop layer —
detect, ask, create, report — **without creating a real data warehouse source
and without a real credential**.

The wizard honours an `MCP_URL` override in non-production builds. Point it
here and the agent gets the same surface it expects.

## Why a stub and not the real thing

The warehouse flow's whole job is to create things in PostHog. Testing it
against prod would leave a trail of half-configured sources in a real project,
and it would need real Stripe and Postgres credentials in CI to get past the
first credential check. Neither is worth it to find out whether the agent asked
the right questions.

So the stub answers, and it **writes down everything the agent tried to do**.
The journal replaces "diff the source list before and after" as the evidence
that a source was created.

## What it serves

One MCP tool, `exec`, driven with the same CLI-style grammar prod uses:

```
tools                     list every tool
search <regex>            find tools by name
info <tool>               a tool's description and input schema
schema <tool> [path]      drill into one field
call <tool> <json>        call a tool
```

Four tools answer a `call`:

| Tool | Behaviour |
|---|---|
| `external-data-sources-wizard` | recorded per-kind credential field schemas |
| `external-data-sources-db-schema` | validates, then returns the recorded table list |
| `external-data-sources-create` | records the payload, returns a synthetic source id |
| `external-data-sources-list` | reflects the creates this run made |

Anything else errors clearly and says so — a stub that invents a plausible
answer would hide the drift these tests exist to find.

## Transport

Streamable HTTP, stateless, on `$MCP_STUB_PORT` (default 8799) at `/mcp`.

That matches the wizard's client: `StreamableHTTPClientTransport` in
`src/lib/agent/runner/harness/pi/mcp.ts`, and the same URL-plus-bearer config
it hands to `pi-mcp-adapter`. Stateless means a fresh `Server` and transport per
request and no `Mcp-Session-Id` bookkeeping. The run's state lives in
`StubState`, which outlives the requests, so `-list` still sees what `-create`
recorded.

The stub ignores the bearer token. Anything authenticates.

## The journal

Every tool call appends one `{ tool, input, at }` entry to
`$MCP_STUB_JOURNAL`. This is the file the assertion layer reads.

- A `call` is journalled under the PostHog tool name.
- A grammar verb is journalled as `exec:info`, `exec:search`, … so an assertion
  can check that `info` came before the first `call`.
- The file is a valid JSON array after every write, so a killed run still leaves
  a readable journal.

**Secret values never land in it.** Any field the recorded source metadata marks
`secret: true` is written as `<redacted:N>`, keeping the field name and the
value's length. Any value with a known credential prefix is written as
`<redacted>` whatever field it arrived under. An assertion can still tell that
a password was supplied and that it was not empty.

## Driving a failure

A fixture's `attemptedFailOk` says "this source may fail to create, and the
report has to say so honestly". The stub cannot decide that on its own — the
credentials an e2e run supplies are placeholders, so *every* create would look
invalid. Name the kinds instead:

```bash
MCP_STUB_FAIL_KINDS=HuggingFace
```

Those kinds get prod's own recorded rejection: a database kind gets the
unresolvable-host message, a key-authenticated SaaS gets the rejected-key one.

Two failures are intrinsic and always apply, with no configuration: a source
type PostHog does not have, and a payload missing a required field.

## Use

From the runner:

```ts
import { startMcpStub } from "../mcp-stub/index.js";

const stub = await startMcpStub({ journalPath: "/tmp/run-journal.json" });
childEnv.MCP_URL = stub.url;
childEnv.MCP_STUB_JOURNAL = "/tmp/run-journal.json";
// …run the wizard…
await stub.stop();
```

By hand:

```bash
pnpm mcp-stub --port 8799 --journal /tmp/journal.json
pnpm mcp-stub --help
```

## Environment

| Var | Meaning |
|---|---|
| `MCP_STUB_PORT` | listen port, default 8799 |
| `MCP_STUB_JOURNAL` | where the journal is written; unset ⇒ no journal |
| `MCP_STUB_FAIL_KINDS` | comma-separated kinds that must reject credentials |
| `MCP_STUB_REQUIRE_INFO` | `true` ⇒ refuse a `call` to a tool never `info`d |
| `MCP_STUB_REDACT` | `false` ⇒ keep secret values in the journal (debug only) |
| `PROJECT_ID` | project named in replayed error paths, default `0` |

`PROJECT_ID` is read only when nothing is passed to `startMcpStub`. The e2e
runner always passes it — the stub lives in the runner's process, while
`PROJECT_ID` is exported onto the *wizard subprocess'* environment, so reading
it here would never see the real one.

## Fixtures

Recorded from production, never hand-authored. See
[`fixtures/README.md`](fixtures/README.md) for what each file holds and how the
redaction pass works.

```bash
POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record
POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record --dry-run
POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record --kinds Postgres,Snowflake
```

Refresh them when a source's credential fields change, when PostHog rewords a
validation message, or when a new fixture app starts using a kind the stub has
never seen. Review the diff before committing — a recording is only as safe as
its redactions.

## Tests

```bash
pnpm test:mcp-stub
```
