/**
 * Local debugging entry point for the stub MCP server.
 *
 *   pnpm mcp-stub                       # listen on 8799, journal to /tmp
 *   pnpm mcp-stub --port 0              # ephemeral port
 *   pnpm mcp-stub --fail-kinds Stripe   # make Stripe reject credentials
 *
 * The e2e runner starts the stub in-process through `startMcpStub()`. This
 * entry point exists so you can point a wizard run — or `curl` — at it by hand
 * and watch the journal fill up.
 */

import { DEFAULT_PORT, startMcpStub } from "./index.js";
import { journalPath, readJournal } from "./journal.js";

function parseArgs(argv: string[]): {
  port?: number;
  journal?: string;
  failKinds?: string;
} {
  const opts: { port?: number; journal?: string; failKinds?: string } = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = argv[i + 1];
    if (arg === "--port") {
      opts.port = Number(value);
      i += 1;
    } else if (arg === "--journal") {
      opts.journal = value;
      i += 1;
    } else if (arg === "--fail-kinds") {
      opts.failKinds = value;
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
mcp-stub: stub PostHog MCP server for warehouse e2e runs

Usage:
  pnpm mcp-stub [options]

Options:
  --port <n>            Port to listen on (default ${DEFAULT_PORT}, 0 = ephemeral)
  --journal <path>      Where to write the tool-call journal
  --fail-kinds <list>   Comma-separated kinds that must reject credentials
  -h, --help            Show this message

Environment:
  MCP_STUB_PORT         Same as --port
  MCP_STUB_JOURNAL      Same as --journal
  MCP_STUB_FAIL_KINDS   Same as --fail-kinds
  MCP_STUB_REQUIRE_INFO 'true' rejects a call to a tool that was never info'd
  MCP_STUB_REDACT       'false' keeps secret values in the journal (debug only)
`);
      process.exit(0);
    }
  }
  return opts;
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.failKinds) process.env.MCP_STUB_FAIL_KINDS = opts.failKinds;

  const journal =
    opts.journal ?? process.env.MCP_STUB_JOURNAL ?? "/tmp/mcp-stub-journal.json";

  const stub = await startMcpStub({ port: opts.port, journalPath: journal });

  console.log(`mcp-stub listening — MCP_URL=${stub.url}`);
  console.log(`journal            ${journal}`);
  if (process.env.MCP_STUB_FAIL_KINDS) {
    console.log(`failing kinds      ${process.env.MCP_STUB_FAIL_KINDS}`);
  }
  console.log("\nCtrl-C to stop.\n");

  const shutdown = async (): Promise<void> => {
    await stub.stop();
    const entries = readJournal(journalPath() ?? journal);
    console.log(`\n${entries.length} tool call(s) recorded:`);
    for (const entry of entries) console.log(`  ${entry.at}  ${entry.tool}`);
    console.log(`\n${stub.state.created.length} source(s) created:`);
    for (const source of stub.state.created) {
      console.log(`  ${source.source_type.padEnd(14)} ${source.id}`);
    }
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

void main();
