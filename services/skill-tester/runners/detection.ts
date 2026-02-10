/**
 * Detection Runner — runs the wizard's framework detection against a directory.
 *
 * Executes detection as a subprocess in the wizard's directory so all of the
 * wizard's dependencies (posthog-node, @clack/prompts, etc.) resolve correctly.
 */
import { execFileSync } from "child_process";
import { existsSync } from "fs";
import { resolve, join } from "path";
import { homedir } from "os";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DetectorTrace {
  integration: string;
  name: string;
  matched: boolean;
  durationMs: number;
}

export interface DetectionResult {
  /** Which integration was detected (null = nothing) */
  detected: string | null;
  /** Human-readable name of the detected framework (null if nothing) */
  detectedName: string | null;
  /** Full trace of every detector that ran */
  trace: DetectorTrace[];
  /** Total time for all detectors */
  totalMs: number;
}

// ─── Detection ───────────────────────────────────────────────────────────────

export function getWizardPath(): string {
  const wizardPath = process.env.WIZARD_PATH;
  if (!wizardPath) {
    throw new Error(
      "WIZARD_PATH environment variable is required. Set it in .env or export it.",
    );
  }
  // Expand ~ to home directory (dotenv doesn't do shell expansion)
  return wizardPath.startsWith("~")
    ? wizardPath.replace("~", homedir())
    : wizardPath;
}

/**
 * Inline Node script that runs inside the wizard's directory context.
 * Imports the registry, runs every detector, and outputs JSON.
 */
const DETECTION_SCRIPT = `
const { FRAMEWORK_REGISTRY } = require('./dist/src/lib/registry');
const { Integration } = require('./dist/src/lib/constants');

async function main() {
  const installDir = process.argv[1];
  const trace = [];
  let detected = null;
  let detectedName = null;
  const startTotal = Date.now();

  for (const integration of Object.values(Integration)) {
    const config = FRAMEWORK_REGISTRY[integration];
    if (!config) continue;

    const start = Date.now();
    let matched = false;

    try {
      matched = await config.detection.detect({ installDir });
    } catch {
      matched = false;
    }

    trace.push({
      integration,
      name: config.metadata.name,
      matched,
      durationMs: Date.now() - start,
    });

    if (matched && !detected) {
      detected = integration;
      detectedName = config.metadata.name;
    }
  }

  console.log(JSON.stringify({
    detected,
    detectedName,
    trace,
    totalMs: Date.now() - startTotal,
  }));
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
`;

/**
 * Run detection against a directory with full tracing.
 *
 * Spawns a Node subprocess in the wizard's directory so all wizard
 * dependencies resolve from the wizard's node_modules.
 */
export async function runDetection(installDir: string): Promise<DetectionResult> {
  const wizardPath = getWizardPath();
  const absInstallDir = resolve(installDir);

  // Check wizard is built
  const registryPath = join(wizardPath, "dist", "src", "lib", "registry.js");
  if (!existsSync(registryPath)) {
    throw new Error(
      `Wizard not built — expected ${registryPath}\nRun "pnpm build" in ${wizardPath} (or start wizard-build in mprocs).`,
    );
  }

  const output = execFileSync(process.execPath, ["-e", DETECTION_SCRIPT, absInstallDir], {
    cwd: wizardPath,
    encoding: "utf-8",
    timeout: 30_000,
    // Suppress wizard's stderr (clack spinner noise, etc.)
    stdio: ["pipe", "pipe", "pipe"],
  });

  // Parse only the last line, earlier lines may be stray console output from wizard deps
  const lines = output.trim().split("\n");
  return JSON.parse(lines[lines.length - 1]) as DetectionResult;
}
