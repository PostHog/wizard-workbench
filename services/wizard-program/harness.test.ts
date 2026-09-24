/**
 * Pins the env contract both headless wizard routes share, so a route never
 * starts a live run with an input the other would reject.
 *
 *   pnpm test:wizard-program
 */

import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it, mock } from "node:test";

import { readE2eEnv, readPersonalApiKey } from "./harness.js";

const appDir = mkdtempSync(join(tmpdir(), "wizard-program-"));
const complete = {
  APP_DIR: appDir,
  POSTHOG_PERSONAL_API_KEY: "phx_inline",
  PROJECT_ID: "228144",
};

it("prefers the inline key and falls back to the key file when it is blank", () => {
  const readFile = mock.fn((_file: string) => " phx_file \n");
  assert.equal(readPersonalApiKey(complete, readFile), "phx_inline");
  assert.equal(
    readPersonalApiKey({ POSTHOG_PERSONAL_API_KEY: "  ", POSTHOG_KEY_FILE: "/keys/phx" }, readFile),
    "phx_file",
  );
  assert.deepEqual(
    readFile.mock.calls.map((call) => call.arguments),
    [["/keys/phx"]],
  );
});

it("reads a complete env", () => {
  assert.deepEqual(readE2eEnv(complete), {
    appDir,
    apiKey: "phx_inline",
    projectId: 228144,
  });
});

it("lets the agent route run without an app directory", () => {
  assert.equal(readE2eEnv({ ...complete, APP_DIR: "" }, { needsAppDir: false }).appDir, "");
});

for (const [name, override] of [
  ["APP_DIR", { APP_DIR: join(appDir, "missing") }],
  ["POSTHOG_PERSONAL_API_KEY", { POSTHOG_PERSONAL_API_KEY: "" }],
  ["PROJECT_ID", { PROJECT_ID: "0" }],
] as const) {
  it(`names a missing ${name}`, () => {
    assert.throws(() => readE2eEnv({ ...complete, ...override }), new RegExp(name));
  });
}
