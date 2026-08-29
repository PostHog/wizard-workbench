/**
 * Run a child process without blocking this one.
 *
 * The e2e runner hosts the stub MCP server in its own process, and the wizard
 * it spawns talks to that stub over HTTP. `spawnSync` blocks the Node event
 * loop until the child exits, so a stub in the same process accepts no
 * connection for the whole run: the wizard's MCP client connects, waits, and
 * gives up. The Claude Agent SDK then reports the server as `pending` and the
 * agent starts with no PostHog tool at all.
 *
 * Every child the e2e runner starts goes through here for that reason. Do not
 * reintroduce `spawnSync` in a process that serves the stub.
 */

import { spawn, type SpawnOptions } from "child_process";

export interface ChildResult {
  /** Exit code, or null when a signal killed the child. */
  status: number | null;
  signal: NodeJS.Signals | null;
}

export interface RunChildOptions extends SpawnOptions {
  /**
   * Called with each chunk the child writes to stdout. Set `stdio` so stdout is
   * a pipe, otherwise there is nothing to read.
   */
  onStdout?: (chunk: string) => void;
}

/**
 * Start `command` and resolve when it exits. Never rejects on a non-zero exit
 * — the caller reads `status`, the same way it read `spawnSync`'s.
 */
export function runChild(
  command: string,
  args: string[],
  options: RunChildOptions = {},
): Promise<ChildResult> {
  const { onStdout, ...spawnOptions } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...spawnOptions });
    if (onStdout) {
      child.stdout?.setEncoding("utf8");
      child.stdout?.on("data", onStdout);
    }
    child.once("error", reject);
    child.once("close", (status, signal) => resolve({ status, signal }));
  });
}
