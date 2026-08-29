/**
 * Drive one MCP handshake against the stub through the Claude Agent SDK — the
 * client the wizard's *anthropic* harness uses.
 *
 * The stub's own tests speak `StreamableHTTPClientTransport` directly. That is
 * the pi harness' client, and it is in the test process. Neither matches the
 * real chain: the anthropic harness hands the config to the Agent SDK, the SDK
 * spawns its own CLI, and that CLI is the thing that must reach the stub. A
 * stub that answers an in-process client can still fail that chain, and did.
 *
 * Run as a script, so a test can start it the same way the e2e runner starts
 * the wizard — as a child of the process that hosts the stub:
 *
 *   MCP_STUB_PROBE_URL=http://127.0.0.1:8799/mcp \
 *     tsx services/mcp-stub/handshake-probe.ts
 *
 * Prints exactly one line of JSON on stdout:
 *
 *   {"status":"connected","hasTool":true,"tools":["mcp__posthog-wizard__exec"]}
 *
 * The run never reaches the model: `ANTHROPIC_BASE_URL` points nowhere, and the
 * probe stops at the SDK's `system/init` message. The MCP handshake happens
 * before that message, which is the whole point — `init` is where the SDK
 * publishes its per-server verdict.
 */

import { query } from "@anthropic-ai/claude-agent-sdk";

/** Same server name the wizard registers, so the tool prefix matches too. */
export const PROBE_SERVER_NAME = "posthog-wizard";
export const PROBE_TOOL_PREFIX = `mcp__${PROBE_SERVER_NAME}__`;

export interface ProbeResult {
  /** The SDK's verdict: `connected`, `pending`, `failed`, `needs-auth`, … */
  status: string;
  /** Whether the server registered a tool under its prefix. */
  hasTool: boolean;
  tools: string[];
  error?: string;
}

/** Nowhere-address for the model API. The probe must not reach a real one. */
const NO_MODEL_API = "http://127.0.0.1:1/no-model-api";

/**
 * Host agent state the probe must not inherit. The e2e runner strips the same
 * prefixes before it starts the wizard. `CLAUDECODE` matters most: the SDK's
 * CLI refuses to launch inside another Claude Code session, so a probe run from
 * an agent's shell would fail for a reason that has nothing to do with the stub.
 */
const STRIP_HOST_AGENT_ENV = /^(CLAUDE|ANTHROPIC|AI_AGENT)/;

function probeEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && !STRIP_HOST_AGENT_ENV.test(key)) env[key] = value;
  }
  return env;
}

export async function probeHandshake(url: string): Promise<ProbeResult> {
  const response = query({
    prompt: "stop",
    options: {
      cwd: "/tmp",
      // The wizard's own registration, minus the parts that need a real run.
      mcpServers: {
        [PROBE_SERVER_NAME]: {
          type: "http",
          url,
          headers: {
            Authorization: "Bearer ${POSTHOG_MCP_TOKEN}",
            "User-Agent": "posthog-wizard/probe (program=warehouse-source)",
          },
        },
      },
      allowedTools: [`${PROBE_TOOL_PREFIX}exec`],
      env: {
        ...probeEnv(),
        POSTHOG_MCP_TOKEN: "phx_probe_token",
        // The wizard sets this so the SDK waits for MCP connect before turn 1.
        // Without it a slow stub reports `pending` and the tool is absent.
        MCP_CONNECTION_NONBLOCKING: "0",
        ANTHROPIC_BASE_URL: NO_MODEL_API,
        ANTHROPIC_AUTH_TOKEN: "probe",
      },
      stderr: () => {},
    },
  });

  try {
    for await (const message of response) {
      if (message.type !== "system" || message.subtype !== "init") continue;
      const servers = (message.mcp_servers ?? []) as Array<{
        name: string;
        status: string;
      }>;
      const server = servers.find((s) => s.name === PROBE_SERVER_NAME);
      const tools = (message.tools ?? []).filter((t) =>
        t.startsWith(PROBE_TOOL_PREFIX),
      );
      return {
        status: server?.status ?? "missing",
        hasTool: tools.length > 0,
        tools,
      };
    }
  } catch (error) {
    return { status: "error", hasTool: false, tools: [], error: String(error) };
  }
  return {
    status: "error",
    hasTool: false,
    tools: [],
    error: "the SDK produced no init message",
  };
}

const invokedDirectly = process.argv[1]?.endsWith("handshake-probe.ts");
if (invokedDirectly) {
  const url = process.env.MCP_STUB_PROBE_URL;
  if (!url) {
    console.error("MCP_STUB_PROBE_URL is required");
    process.exit(2);
  }
  const result = await probeHandshake(url);
  console.log(JSON.stringify(result));
  // The SDK keeps its CLI subprocess and its transports alive; nothing here
  // needs them once the verdict is in.
  process.exit(result.status === "connected" && result.hasTool ? 0 : 1);
}
