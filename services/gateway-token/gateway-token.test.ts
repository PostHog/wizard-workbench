import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import { ensureGatewayToken, type MintRequest, type SavedGatewayToken } from "./index.js";

const NOW_MS = 1_800_000_000_000;
const GATEWAY_URL = "https://ai-gateway.us.posthog.com";

function saveToken(tokenFile: string, saved: SavedGatewayToken): void {
  mkdirSync(dirname(tokenFile), { recursive: true });
  writeFileSync(tokenFile, "phe_saved");
  writeFileSync(`${tokenFile}.json`, JSON.stringify(saved));
}

describe("ensureGatewayToken", () => {
  let workDir: string;
  let tokenFile: string;
  let mintRequests: MintRequest[];

  const recordingMint = async (request: MintRequest) => {
    mintRequests.push(request);
    saveToken(request.tokenFile, {
      program: request.program,
      projectId: Number(request.projectId),
      gatewayUrl: GATEWAY_URL,
      refreshAtMs: NOW_MS + 60_000,
    });
  };

  const options = (overrides: Partial<Parameters<typeof ensureGatewayToken>[0]> = {}) => ({
    program: "feature-flags",
    projectId: "483112",
    tokenFile,
    wizardPath: "/wizard",
    now: () => NOW_MS,
    mintToken: recordingMint,
    ...overrides,
  });

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), "gateway-token-test-"));
    tokenFile = join(workDir, "posthog", "wizard-gateway-token");
    mintRequests = [];
  });

  afterEach(() => rmSync(workDir, { recursive: true, force: true }));

  it("mints through the wizard login when no token is saved", async () => {
    const token = await ensureGatewayToken(options());

    assert.deepEqual(mintRequests, [
      { program: "feature-flags", projectId: "483112", tokenFile, wizardPath: "/wizard" },
    ]);
    assert.deepEqual(token, { tokenFile, gatewayUrl: GATEWAY_URL });
  });

  it("reuses a saved token for the same program and project before its refresh time", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 1 });

    await ensureGatewayToken(options());

    assert.equal(mintRequests.length, 0);
  });

  it("re-mints once the saved token is past its refresh time", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS });

    await ensureGatewayToken(options());

    assert.equal(mintRequests.length, 1);
  });

  it("re-mints when the saved token was minted for another program", async () => {
    saveToken(tokenFile, { program: "error-tracking", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 60_000 });

    await ensureGatewayToken(options());

    assert.equal(mintRequests[0]?.program, "feature-flags");
  });

  it("re-mints when the saved token belongs to another project", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 1, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 60_000 });

    await ensureGatewayToken(options());

    assert.equal(mintRequests.length, 1);
  });

  it("fails when the mint leaves no usable token behind", async () => {
    await assert.rejects(
      ensureGatewayToken(options({ mintToken: async () => undefined })),
      /did not leave a usable token for feature-flags/,
    );
  });
});
