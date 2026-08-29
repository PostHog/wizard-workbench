/**
 * Stub PostHog MCP server.
 *
 * Stands in for `mcp.posthog.com` during a warehouse e2e run. The wizard
 * honours an `MCP_URL` override in non-production builds, so pointing it here
 * gives the agent the whole PostHog MCP surface it expects — answered from
 * fixtures recorded off prod — while creating nothing real and consuming no
 * real credential.
 *
 * Transport: Streamable HTTP, stateless. That is what both of the wizard's
 * clients speak — `StreamableHTTPClientTransport` in the wizard's
 * `src/lib/agent/runner/harness/pi/mcp.ts` (and the same URL + bearer config
 * for `pi-mcp-adapter`), and the Claude Agent SDK's own CLI on the anthropic
 * harness. Stateless means a fresh `Server` + transport per request and no
 * `Mcp-Session-Id` bookkeeping; the run's state lives in `StubState`, which
 * outlives the requests.
 *
 * This server answers from the event loop of the process that started it. A
 * synchronous call in that process — `spawnSync` above all — stops it answering
 * for as long as the call runs, and a client that gets no answer reports the
 * server as `pending` or `failed` and loses the tool. Start children with
 * `runChild` from `../wizard-ci/run-child.js`.
 *
 * Set `MCP_STUB_WIRE_LOG` to see every exchange — see `wire-log.ts`.
 *
 * Usage:
 *
 *   const stub = await startMcpStub();
 *   process.env.MCP_URL = stub.url;
 *   …run the wizard…
 *   await stub.stop();
 */

import { createServer, type Server as HttpServer } from "node:http";
import { AddressInfo } from "node:net";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { loadFixtures, type Fixtures } from "./fixtures.js";
import { resetJournal } from "./journal.js";
import { runExec, StubState } from "./exec.js";
import { createWireLog } from "./wire-log.js";

export const DEFAULT_PORT = 8799;
export const MCP_PATH = "/mcp";

/**
 * Server `instructions`. The wizard fetches these and puts them in the agent's
 * system prompt, so they have to carry the same rule prod's do: find the tool,
 * read its schema once, then call it.
 */
const INSTRUCTIONS = [
  "PostHog MCP. Pass CLI-style commands in the `command` parameter.",
  "",
  "  search <regex>            find tools by name",
  "  tools                     list every tool",
  "  info <tool>               show a tool's description and input schema",
  "  schema <tool> [path]      drill into one field of a tool's schema",
  "  call <tool> <json_input>  call a tool",
  "",
  "Run `info <tool>` once before calling a tool whose schema is not already in",
  "context. Never guess a schema.",
].join("\n");

export interface McpStub {
  /** Full URL to pass as `MCP_URL`, e.g. `http://127.0.0.1:8799/mcp`. */
  url: string;
  port: number;
  /** The run's recorded state — created sources, tools `info`d. */
  state: StubState;
  stop: () => Promise<void>;
}

export interface McpStubOptions {
  /** Defaults to `$MCP_STUB_PORT`, then 8799. Pass 0 for an ephemeral port. */
  port?: number;
  /** Defaults to `$MCP_STUB_JOURNAL`. */
  journalPath?: string;
  /** Truncate the journal on start. Default true — a stale file must not pass. */
  resetJournalOnStart?: boolean;
  /**
   * Project the run is scoped to, substituted into recorded error text.
   *
   * The runner exports the project id onto the *wizard subprocess'* env, not
   * its own, and the stub lives in the runner's process — so this has to be
   * handed over explicitly rather than read from `process.env`.
   */
  projectId?: string;
  fixtures?: Fixtures;
}

function buildServer(state: StubState, fixtures: Fixtures): Server {
  const server = new Server(
    { name: "posthog-mcp-stub", version: "1.0.0" },
    { capabilities: { tools: {} }, instructions: INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: "exec",
        title: "PostHog",
        description: INSTRUCTIONS,
        inputSchema: {
          type: "object",
          properties: {
            command: {
              type: "string",
              description:
                "CLI-style command: tools | search <regex> | info <tool> | " +
                "schema <tool> [path] | call <tool> <json_input>",
            },
            context: {
              type: "string",
              description: "Why this call is being made. Used for analytics.",
            },
          },
          required: ["command"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, (request) => {
    if (request.params.name !== "exec") {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown tool "${request.params.name}". This server exposes one tool: exec.`,
          },
        ],
        isError: true,
      };
    }

    const command = (request.params.arguments as { command?: unknown })?.command;
    if (typeof command !== "string") {
      return {
        content: [
          { type: "text" as const, text: "exec requires a string `command`." },
        ],
        isError: true,
      };
    }

    const result = runExec(command, state, fixtures);
    return {
      content: [{ type: "text" as const, text: result.text }],
      isError: result.isError,
    };
  });

  return server;
}

/** Read the whole request body. Bodies here are small — one JSON-RPC message. */
async function readBody(req: NodeJS.ReadableStream): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return undefined;
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

/** Start the stub. Resolves once it is listening. */
export async function startMcpStub(
  options: McpStubOptions = {},
): Promise<McpStub> {
  const fixtures = options.fixtures ?? loadFixtures();
  const state = new StubState(
    options.projectId ?? process.env.PROJECT_ID ?? "0",
  );

  const journal = options.journalPath ?? process.env.MCP_STUB_JOURNAL;
  if (journal) {
    process.env.MCP_STUB_JOURNAL = journal;
    if (options.resetJournalOnStart !== false) resetJournal(journal);
  }

  const port =
    options.port ?? Number(process.env.MCP_STUB_PORT ?? DEFAULT_PORT);

  const wire = createWireLog();

  const http: HttpServer = createServer((req, res) => {
    void (async () => {
      const logRequest = wire.record(req, res);
      const path = (req.url ?? "").split("?")[0];
      if (path !== MCP_PATH) {
        logRequest(undefined);
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: `not found: ${path}` }));
        return;
      }

      // A fresh Server + transport per request: stateless Streamable HTTP. The
      // run's state is in `state`, which is closed over, so nothing is lost.
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      const server = buildServer(state, fixtures);

      res.on("close", () => {
        void transport.close();
        void server.close();
      });

      try {
        await server.connect(transport);
        const body = await readBody(req);
        logRequest(body);
        await transport.handleRequest(req, res, body);
      } catch (error) {
        // The detail goes to the runner's own log, where whoever is debugging
        // the stub will actually look, rather than over the wire. Tool errors
        // are unaffected — those carry real text back through `runExec`.
        console.error("mcp-stub: request failed —", error);
        if (!res.headersSent) {
          res.writeHead(500, { "content-type": "application/json" });
        }
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32603, message: "Internal server error" },
            id: null,
          }),
        );
      }
    })();
  });

  await new Promise<void>((resolve, reject) => {
    http.once("error", reject);
    http.listen(port, "127.0.0.1", resolve);
  });

  const bound = (http.address() as AddressInfo).port;

  return {
    url: `http://127.0.0.1:${bound}${MCP_PATH}`,
    port: bound,
    state,
    stop: () =>
      new Promise<void>((resolve) => {
        http.close(() => resolve());
        http.closeAllConnections?.();
      }),
  };
}

export { StubState } from "./exec.js";
export type { CreatedSource } from "./exec.js";
export { readJournal, type JournalEntry } from "./journal.js";
