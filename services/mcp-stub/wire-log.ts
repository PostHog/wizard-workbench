/**
 * Wire log for the stub MCP server.
 *
 * The stub answers a transport, not just a tool surface. When a client decides
 * the server never came up, the reason is in the HTTP exchange — which methods
 * it sent, what it accepted, what came back — and nowhere else. Reconstructing
 * that from the client side is guesswork, so the stub records it.
 *
 * Off unless `MCP_STUB_WIRE_LOG` is set. Set it to `1`, `true`, or `stderr` to
 * write to stderr. Set it to any other value to append to that file path.
 *
 * Two or three lines per exchange, all prefixed `mcp-wire`:
 *
 *   mcp-wire #2 -> GET /mcp  accept=text/event-stream protocol=2026-05-19 …
 *   mcp-wire #2 open 200 text/event-stream 1ms          (streams only)
 *   mcp-wire #2 <- 200 text/event-stream 41200ms aborted
 *
 * The `open` line is what tells a stalled handshake from a refused one: a
 * stream the stub opened and held reads as `open` then `aborted`, while a
 * rejected one reaches `<-` straight away.
 */

import { appendFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

/** Headers that decide how a Streamable HTTP exchange is routed. */
const INTERESTING_HEADERS = [
  "accept",
  "content-type",
  "mcp-session-id",
  "mcp-protocol-version",
  "last-event-id",
  "user-agent",
] as const;

/** How long to wait before calling a still-open response a live stream. */
const OPEN_AFTER_MS = 250;

export interface WireLog {
  /** True when the log is on. Lets callers skip work the log would not use. */
  readonly enabled: boolean;
  /**
   * Record one exchange. Call before handling. `body` is read lazily so a
   * caller can pass the parsed body once it has it.
   */
  record: (req: IncomingMessage, res: ServerResponse) => (body: unknown) => void;
}

/** No-op log, used when the flag is unset. */
const OFF: WireLog = { enabled: false, record: () => () => {} };

function sink(target: string): (line: string) => void {
  if (target === "1" || target === "true" || target === "stderr") {
    return (line) => console.error(line);
  }
  return (line) => appendFileSync(target, `${line}\n`);
}

/**
 * Describe the JSON-RPC payload without printing it. Bodies carry credentials
 * the run injected, so the log names the method and id and stops there.
 */
function describeBody(body: unknown): string {
  if (body === undefined) return "body=none";
  const messages = Array.isArray(body) ? body : [body];
  const parts = messages.map((message) => {
    const m = message as { method?: unknown; id?: unknown; result?: unknown };
    if (typeof m.method === "string") {
      return m.id === undefined
        ? `${m.method}(notification)`
        : `${m.method}#${String(m.id)}`;
    }
    if (m.result !== undefined) return `result#${String(m.id)}`;
    return "unknown";
  });
  return `body=${parts.join(",")}`;
}

/** `Authorization` reduced to its scheme and length — never its value. */
function describeAuth(raw: string | undefined): string {
  if (!raw) return "auth=none";
  const [scheme, ...rest] = raw.split(" ");
  const value = rest.join(" ");
  return `auth=${scheme.toLowerCase()}(${value.length})`;
}

/**
 * Build the log for this run. Reads `MCP_STUB_WIRE_LOG` once, at start — a
 * per-request read would let a mid-run env change split the log.
 */
export function createWireLog(target = process.env.MCP_STUB_WIRE_LOG): WireLog {
  if (!target) return OFF;

  const write = sink(target);
  let seq = 0;

  return {
    enabled: true,
    record(req, res) {
      const n = ++seq;
      const started = Date.now();

      const headers = INTERESTING_HEADERS.map((name) => {
        const value = req.headers[name];
        return value === undefined
          ? null
          : `${name.replace(/^mcp-/, "")}=${String(value)}`;
      })
        .filter((part): part is string => part !== null)
        .join(" ");

      let done = false;
      const type = (): string => String(res.getHeader("content-type") ?? "-");

      // `finish` means the response ended normally. `close` without `finish`
      // means the client hung up first — the interesting case for a stream the
      // client opened and then abandoned.
      res.on("finish", () => {
        done = true;
        write(
          `mcp-wire #${n} <- ${res.statusCode} ${type()} ${Date.now() - started}ms closed`,
        );
      });
      res.on("close", () => {
        if (done) return;
        done = true;
        write(
          `mcp-wire #${n} <- ${res.statusCode} ${type()} ${Date.now() - started}ms aborted`,
        );
      });

      const openTimer = setTimeout(() => {
        if (done || !res.headersSent) return;
        write(
          `mcp-wire #${n} open ${res.statusCode} ${type()} ${Date.now() - started}ms`,
        );
      }, OPEN_AFTER_MS);
      openTimer.unref?.();

      return (body: unknown) => {
        write(
          `mcp-wire #${n} -> ${req.method} ${req.url}\n` +
            `  ${headers} ${describeAuth(req.headers.authorization)} ${describeBody(body)}`,
        );
      };
    },
  };
}
