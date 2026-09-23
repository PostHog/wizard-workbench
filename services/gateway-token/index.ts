import "dotenv/config";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const DEFAULT_GATEWAY_TOKEN_FILE = join(
  homedir(),
  ".config",
  "posthog",
  "wizard-gateway-token",
);

export interface SavedGatewayToken {
  program: string;
  projectId: number;
  gatewayUrl: string;
  refreshAtMs: number;
}

export interface GatewayToken {
  tokenFile: string;
  gatewayUrl: string;
}

export interface GatewayTokenOptions {
  program: string;
  projectId: string;
  tokenFile?: string;
  wizardPath?: string;
  refresh?: boolean;
  now?: () => number;
  mintToken?: (request: MintRequest) => Promise<void>;
}

export interface MintRequest {
  program: string;
  projectId: string;
  tokenFile: string;
  wizardPath: string;
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

function resolveWizardPath(wizardPath: string | undefined): string {
  const configured = wizardPath ?? process.env.WIZARD_PATH;
  if (!configured) throw new Error("WIZARD_PATH must point at the wizard repo.");
  return configured.replace(/^~/, homedir());
}

function mintWithWizardLogin(request: MintRequest): Promise<void> {
  const tsx = join(request.wizardPath, "node_modules", ".bin", "tsx");
  const child = spawn(tsx, ["scripts/mint-gateway-token.no-jest.ts"], {
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
  const tokenFile = options.tokenFile ?? DEFAULT_GATEWAY_TOKEN_FILE;
  const nowMs = (options.now ?? Date.now)();
  const saved = readSavedGatewayToken(tokenFile);
  if (!options.refresh && isSavedTokenUsable(saved, options.program, options.projectId, nowMs)) {
    return { tokenFile, gatewayUrl: saved.gatewayUrl };
  }

  const mintToken = options.mintToken ?? mintWithWizardLogin;
  await mintToken({
    program: options.program,
    projectId: options.projectId,
    tokenFile,
    wizardPath: resolveWizardPath(options.wizardPath),
  });

  const minted = readSavedGatewayToken(tokenFile);
  if (!isSavedTokenUsable(minted, options.program, options.projectId, nowMs)) {
    throw new Error(`the mint did not leave a usable token for ${options.program} in ${tokenFile}`);
  }
  return { tokenFile, gatewayUrl: minted.gatewayUrl };
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
    tokenFile: process.env.WIZARD_CI_GATEWAY_TOKEN_FILE,
    refresh: process.argv.includes("--refresh"),
  })
    .then(({ tokenFile }) => console.log(`✓ gateway token for ${program} ready: ${tokenFile}`))
    .catch((error: Error) => {
      console.error(`✖ ${error.message}`);
      process.exit(1);
    });
}
