import "dotenv/config";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const WIZARD_MINT_SCRIPT = join("scripts", "mint-gateway-token.no-jest.ts");
const WORKBENCH = join(import.meta.dirname, "..", "..");

export function resolveWizardRepo(): string {
  const configuredPath = process.env.WIZARD_PATH?.replace(/^~/, process.env.HOME || "");
  if (configuredPath) return configuredPath;
  for (const name of ["wizard-e2e", "wizard"]) {
    const siblingPath = join(WORKBENCH, "..", name);
    if (existsSync(siblingPath)) return siblingPath;
  }
  return `${process.env.HOME}/development/wizard`;
}

export function defaultGatewayTokenFile(program: string, region: string, projectId: string): string {
  return join(homedir(), ".config", "posthog", `wizard-gateway-token-${program}-${region}-${projectId}`);
}

export interface SavedGatewayToken {
  program: string;
  projectId: number;
  gatewayUrl: string;
  refreshAtMs: number;
  tokenSha256?: string;
}

export interface GatewayToken {
  tokenFile: string;
  sourceTokenFile: string;
  gatewayUrl?: string;
  dispose: () => void;
}

export interface GatewayTokenOptions {
  program: string;
  projectId: string;
  region?: string;
  tokenFile?: string;
  wizardPath?: string;
  refresh?: boolean;
  environment?: NodeJS.ProcessEnv;
  now?: () => number;
  mintToken?: (request: MintRequest) => Promise<void>;
}

export interface MintRequest {
  program: string;
  projectId: string;
  tokenFile: string;
  wizardPath: string;
}

function isGatewayForRegion(gatewayUrl: string, region: string, environment: NodeJS.ProcessEnv): boolean {
  if (!URL.canParse(gatewayUrl)) return false;
  const sidecarOrigin = new URL(gatewayUrl).origin;
  const overrideUrl = environment.WIZARD_CI_GATEWAY_URL;
  if (!overrideUrl) return sidecarOrigin === `https://ai-gateway.${region}.posthog.com`;
  if (!URL.canParse(overrideUrl)) return false;
  return sidecarOrigin === new URL(overrideUrl).origin;
}

function isSidecarBoundToToken(tokenBytes: Buffer, saved: SavedGatewayToken): boolean {
  if (!saved.tokenSha256) return false;
  return createHash("sha256").update(tokenBytes).digest("hex") === saved.tokenSha256;
}

function readPreIssuedTokenBytes(tokenFile: string): Buffer | undefined {
  if (!existsSync(tokenFile) || existsSync(`${tokenFile}.json`)) return undefined;
  const tokenBytes = readFileSync(tokenFile);
  if (tokenBytes.toString("utf8").trim() === "") return undefined;
  return tokenBytes;
}

function snapshotGatewayToken(
  tokenBytes: Buffer,
  sourceTokenFile: string,
  gatewayUrl?: string,
): GatewayToken {
  const snapshotDirectory = mkdtempSync(join(tmpdir(), "wizard-gateway-token-"));
  const dispose = () => rmSync(snapshotDirectory, { recursive: true, force: true });
  const snapshotFile = join(snapshotDirectory, "token");
  try {
    writeFileSync(snapshotFile, tokenBytes, { mode: 0o600, flag: "wx" });
  } catch (error) {
    dispose();
    throw error;
  }
  return { tokenFile: snapshotFile, sourceTokenFile, gatewayUrl, dispose };
}

export function readSavedGatewayToken(tokenFile: string): SavedGatewayToken | undefined {
  const metadataFile = `${tokenFile}.json`;
  if (!existsSync(tokenFile) || !existsSync(metadataFile)) return undefined;
  if (!readFileSync(tokenFile, "utf8").trim()) return undefined;
  try {
    return JSON.parse(readFileSync(metadataFile, "utf8")) as SavedGatewayToken;
  } catch {
    return undefined;
  }
}

export function isSavedTokenUsable(
  saved: SavedGatewayToken | undefined,
  program: string,
  projectId: string,
  nowMs: number,
): saved is SavedGatewayToken {
  if (!saved) return false;
  if (saved.program !== program) return false;
  if (String(saved.projectId) !== projectId) return false;
  return nowMs < saved.refreshAtMs;
}

function mintWithWizardLogin(request: MintRequest): Promise<void> {
  if (!existsSync(join(request.wizardPath, WIZARD_MINT_SCRIPT))) {
    return Promise.reject(
      new Error(
        `${request.wizardPath} has no ${WIZARD_MINT_SCRIPT}; update the wizard checkout, or set WIZARD_CI_GATEWAY_TOKEN_FILE to a file holding an issued token`,
      ),
    );
  }
  const tsx = join(request.wizardPath, "node_modules", ".bin", "tsx");
  const child = spawn(tsx, [WIZARD_MINT_SCRIPT], {
    cwd: request.wizardPath,
    stdio: "inherit",
    env: {
      ...process.env,
      PROGRAM: request.program,
      PROJECT_ID: request.projectId,
      TOKEN_FILE: request.tokenFile,
    },
  });
  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`gateway token mint exited with code ${code}`)),
    );
  });
}

export async function ensureGatewayToken(options: GatewayTokenOptions): Promise<GatewayToken> {
  const region = options.region || "us";
  const environment = options.environment ?? process.env;
  const isExplicitTokenFile = Boolean(options.tokenFile);
  const tokenFile = options.tokenFile || defaultGatewayTokenFile(options.program, region, options.projectId);
  const preIssuedTokenBytes = isExplicitTokenFile ? readPreIssuedTokenBytes(tokenFile) : undefined;
  if (preIssuedTokenBytes) return snapshotGatewayToken(preIssuedTokenBytes, tokenFile);
  const nowMs = (options.now ?? Date.now)();
  const snapshotIfUsableForThisRun = (saved: SavedGatewayToken | undefined): GatewayToken | undefined => {
    if (!isSavedTokenUsable(saved, options.program, options.projectId, nowMs)) return undefined;
    if (!isGatewayForRegion(saved.gatewayUrl, region, environment)) return undefined;
    const tokenBytes = readFileSync(tokenFile);
    if (!isSidecarBoundToToken(tokenBytes, saved)) return undefined;
    return snapshotGatewayToken(tokenBytes, tokenFile, saved.gatewayUrl);
  };
  const cachedToken = options.refresh ? undefined : snapshotIfUsableForThisRun(readSavedGatewayToken(tokenFile));
  if (cachedToken) return cachedToken;
  if (environment.CI) {
    throw new Error(
      `no usable gateway token for ${options.program} in ${tokenFile}; in CI set WIZARD_CI_GATEWAY_TOKEN_FILE to a file holding an issued token`,
    );
  }

  const mintToken = options.mintToken ?? mintWithWizardLogin;
  await mintToken({
    program: options.program,
    projectId: options.projectId,
    tokenFile,
    wizardPath: options.wizardPath ?? resolveWizardRepo(),
  });

  const mintedToken = snapshotIfUsableForThisRun(readSavedGatewayToken(tokenFile));
  if (!mintedToken) {
    throw new Error(`the mint did not leave a usable token for ${options.program} in ${tokenFile}`);
  }
  return mintedToken;
}

function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectId = readFlag("project-id") ?? process.env.POSTHOG_WIZARD_PROJECT_ID;
  const program = readFlag("program") ?? "posthog-integration";
  if (!projectId) {
    console.error("✖ project id required: --project-id or POSTHOG_WIZARD_PROJECT_ID.");
    process.exit(2);
  }
  ensureGatewayToken({
    program,
    projectId,
    region: process.env.POSTHOG_REGION || "us",
    tokenFile: process.env.WIZARD_CI_GATEWAY_TOKEN_FILE,
    wizardPath: resolveWizardRepo(),
    refresh: process.argv.includes("--refresh"),
  })
    .then(({ sourceTokenFile, dispose }) => {
      dispose();
      console.log(`✓ gateway token for ${program} ready: ${sourceTokenFile}`);
    })
    .catch((error: Error) => {
      console.error(`✖ ${error.message}`);
      process.exit(1);
    });
}
