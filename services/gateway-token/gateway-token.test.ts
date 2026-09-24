import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";

import {
  defaultGatewayTokenFile,
  ensureGatewayToken,
  type GatewayToken,
  type MintRequest,
  type SavedGatewayToken,
} from "./index.js";

const NOW_MS = 1_800_000_000_000;
const GATEWAY_URL = "https://ai-gateway.us.posthog.com";
const SAVED_TOKEN = "phe_saved";
const SAVED_TOKEN_SHA256 = createHash("sha256").update(SAVED_TOKEN).digest("hex");

function saveToken(tokenFile: string, saved: SavedGatewayToken): void {
  mkdirSync(dirname(tokenFile), { recursive: true });
  writeFileSync(tokenFile, SAVED_TOKEN);
  writeFileSync(`${tokenFile}.json`, JSON.stringify({ tokenSha256: SAVED_TOKEN_SHA256, ...saved }));
}

function assertSnapshotOf(token: GatewayToken, sourceTokenFile: string): void {
  assert.equal(token.sourceTokenFile, sourceTokenFile);
  assert.notEqual(token.tokenFile, sourceTokenFile);
  assert.deepEqual(readFileSync(token.tokenFile), readFileSync(sourceTokenFile));
  assert.equal(statSync(token.tokenFile).mode & 0o777, 0o600);
}

describe("ensureGatewayToken", () => {
  let workDir: string;
  let tokenFile: string;
  let mintRequests: MintRequest[];
  let issuedTokens: GatewayToken[];

  const ensureAndTrack = async (tokenOptions: Parameters<typeof ensureGatewayToken>[0]) => {
    const token = await ensureGatewayToken(tokenOptions);
    issuedTokens.push(token);
    return token;
  };

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
    environment: {},
    now: () => NOW_MS,
    mintToken: recordingMint,
    ...overrides,
  });

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), "gateway-token-test-"));
    tokenFile = join(workDir, "posthog", "wizard-gateway-token");
    mintRequests = [];
    issuedTokens = [];
  });

  afterEach(() => {
    for (const token of issuedTokens) token.dispose();
    rmSync(workDir, { recursive: true, force: true });
  });

  it("mints through the wizard login when no token is saved", async () => {
    const token = await ensureAndTrack(options());

    assert.deepEqual(mintRequests, [
      { program: "feature-flags", projectId: "483112", tokenFile, wizardPath: "/wizard" },
    ]);
    assertSnapshotOf(token, tokenFile);
    assert.equal(token.gatewayUrl, GATEWAY_URL);
  });

  it("hands out a snapshot of a reused token that later writes to the cache file do not change", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 1 });

    const token = await ensureAndTrack(options());
    writeFileSync(tokenFile, "phe_from_another_run");

    assert.equal(readFileSync(token.tokenFile, "utf8"), SAVED_TOKEN);
  });

  it("removes the token snapshot on dispose", async () => {
    const token = await ensureAndTrack(options());

    token.dispose();

    assert.equal(existsSync(token.tokenFile), false);
    assert.equal(existsSync(dirname(token.tokenFile)), false);
    assert.equal(existsSync(tokenFile), true);
  });

  it("reuses a saved token for the same program and project before its refresh time", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 1 });

    await ensureAndTrack(options());

    assert.equal(mintRequests.length, 0);
  });

  it("re-mints once the saved token is past its refresh time", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS });

    await ensureAndTrack(options());

    assert.equal(mintRequests.length, 1);
  });

  it("re-mints when the saved token was minted for another program", async () => {
    saveToken(tokenFile, { program: "error-tracking", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 60_000 });

    await ensureAndTrack(options());

    assert.equal(mintRequests[0]?.program, "feature-flags");
  });

  it("re-mints when the saved token belongs to another project", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 1, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 60_000 });

    await ensureAndTrack(options());

    assert.equal(mintRequests.length, 1);
  });

  const withHomeDirectory = async (run: () => Promise<void>) => {
    const realHome = process.env.HOME;
    process.env.HOME = workDir;
    try {
      await run();
    } finally {
      process.env.HOME = realHome;
    }
  };

  it("uses an explicitly given token file without a sidecar as-is and never mints", async () => {
    mkdirSync(dirname(tokenFile), { recursive: true });
    writeFileSync(tokenFile, "phe_issued_by_ci");

    const token = await ensureAndTrack(options());

    assert.equal(mintRequests.length, 0);
    assertSnapshotOf(token, tokenFile);
    assert.equal(token.gatewayUrl, undefined);
  });

  it("mints into a per-program, per-region, per-project file under the home directory when no token file is given", async () => {
    await withHomeDirectory(async () => {
      const token = await ensureAndTrack(
        options({ tokenFile: undefined, program: "posthog-integration", region: "us" }),
      );

      const expectedFile = join(workDir, ".config", "posthog", "wizard-gateway-token-posthog-integration-us-483112");
      assert.equal(defaultGatewayTokenFile("posthog-integration", "us", "483112"), expectedFile);
      assert.equal(mintRequests[0]?.tokenFile, expectedFile);
      assertSnapshotOf(token, expectedFile);
    });
  });

  it("re-mints a sidecarless token in the managed default file", async () => {
    await withHomeDirectory(async () => {
      const managedFile = defaultGatewayTokenFile("feature-flags", "us", "483112");
      mkdirSync(dirname(managedFile), { recursive: true });
      writeFileSync(managedFile, "phe_interrupted_mint");

      const token = await ensureAndTrack(options({ tokenFile: undefined }));

      assert.equal(mintRequests.length, 1);
      assertSnapshotOf(token, managedFile);
      assert.equal(token.gatewayUrl, GATEWAY_URL);
    });
  });

  it("re-mints when the saved token's gateway belongs to another region", async () => {
    saveToken(tokenFile, {
      program: "feature-flags",
      projectId: 483112,
      gatewayUrl: "https://ai-gateway.eu.posthog.com",
      refreshAtMs: NOW_MS + 60_000,
    });

    const token = await ensureAndTrack(options({ region: "us" }));

    assert.equal(mintRequests.length, 1);
    assert.equal(token.gatewayUrl, GATEWAY_URL);
  });

  it("re-mints when the saved gateway does not match an explicit gateway override", async () => {
    saveToken(tokenFile, {
      program: "feature-flags",
      projectId: 483112,
      gatewayUrl: "http://localhost:8765",
      refreshAtMs: NOW_MS + 60_000,
    });

    const token = await ensureAndTrack(options({ environment: { WIZARD_CI_GATEWAY_URL: `${GATEWAY_URL}/v1` } }));

    assert.equal(mintRequests.length, 1);
    assert.equal(token.gatewayUrl, GATEWAY_URL);
  });

  it("reuses a saved token whose gateway matches the origin of an explicit gateway override", async () => {
    saveToken(tokenFile, { program: "feature-flags", projectId: 483112, gatewayUrl: GATEWAY_URL, refreshAtMs: NOW_MS + 1 });

    await ensureAndTrack(options({ environment: { WIZARD_CI_GATEWAY_URL: `${GATEWAY_URL}/v1` } }));

    assert.equal(mintRequests.length, 0);
  });

  it("re-mints when the sidecar hash does not match the token file", async () => {
    saveToken(tokenFile, {
      program: "feature-flags",
      projectId: 483112,
      gatewayUrl: GATEWAY_URL,
      refreshAtMs: NOW_MS + 60_000,
      tokenSha256: createHash("sha256").update("phe_previous").digest("hex"),
    });

    await ensureAndTrack(options());

    assert.equal(mintRequests.length, 1);
  });

  it("re-mints when the sidecar has no token hash", async () => {
    saveToken(tokenFile, {
      program: "feature-flags",
      projectId: 483112,
      gatewayUrl: GATEWAY_URL,
      refreshAtMs: NOW_MS + 60_000,
      tokenSha256: undefined,
    });

    await ensureAndTrack(options());

    assert.equal(mintRequests.length, 1);
  });

  it("fails without minting in CI when no usable token exists", async () => {
    await assert.rejects(
      ensureGatewayToken(options({ environment: { CI: "true" } })),
      /WIZARD_CI_GATEWAY_TOKEN_FILE/,
    );
    assert.equal(mintRequests.length, 0);
  });

  it("names the missing wizard mint script instead of spawning it", async () => {
    await assert.rejects(
      ensureGatewayToken(options({ mintToken: undefined, wizardPath: workDir })),
      /has no scripts\/mint-gateway-token\.no-jest\.ts/,
    );
  });

  it("fails when the mint leaves no usable token behind", async () => {
    await assert.rejects(
      ensureGatewayToken(options({ mintToken: async () => undefined })),
      /did not leave a usable token for feature-flags/,
    );
  });
});
