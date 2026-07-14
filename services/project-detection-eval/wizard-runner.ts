import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
type TargetProfile = "integration" | "source-maps";

const SCRIPT = String.raw`
const profile = process.argv[1];
const command = process.argv[2];
async function main() {
  if (command === 'manifest-glob') {
    const { manifestGlob } = require('./src/lib/detection/agentic');
    console.log(JSON.stringify(manifestGlob()));
    return;
  }
  if (command === 'targets') {
    if (profile === 'integration') {
      const { FRAMEWORK_REGISTRY } = require('./src/lib/registry');
      console.log(JSON.stringify(Object.keys(FRAMEWORK_REGISTRY)));
    } else {
      const { AUTOMATABLE_VARIANTS } = require('./src/lib/programs/error-tracking-upload-source-maps/detect');
      console.log(JSON.stringify([...AUTOMATABLE_VARIANTS]));
    }
    return;
  }
  const installDir = process.argv[3];
  const { detectFramework } = require('./src/lib/detection/framework');
  if (command === 'detect-many') {
    const paths = JSON.parse(installDir);
    const results = [];
    for (const path of paths) results.push((await detectFramework(path)) ?? null);
    console.log(JSON.stringify(results));
  } else {
    const detected = await detectFramework(installDir);
    console.log(JSON.stringify(detected ?? null));
  }
}
main().catch((error) => { console.error(error); process.exit(1); });
`;

export function wizardPath(): string {
  const raw = process.env.WIZARD_PATH;
  if (!raw) throw new Error("WIZARD_PATH is required");
  return raw.startsWith("~") ? raw.replace("~", homedir()) : raw;
}

function invoke(profile: TargetProfile, command: string, value = ""): unknown {
  const cwd = wizardPath();
  const tsx = join(cwd, "node_modules", ".bin", "tsx");
  if (!existsSync(join(cwd, "src", "lib", "registry.ts")) || !existsSync(tsx)) {
    throw new Error(
      `Wizard source or installed dependencies are missing at ${cwd}`
    );
  }
  const output = execFileSync(tsx, ["-e", SCRIPT, profile, command, value], {
    cwd,
    encoding: "utf8",
    timeout: 30_000,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output.trim().split("\n").at(-1) ?? "null");
}

const targetCache = new Map<TargetProfile, string[]>();
export function productionTargets(profile: TargetProfile): string[] {
  const cached = targetCache.get(profile);
  if (cached) return cached;
  const targets = invoke(profile, "targets") as string[];
  targetCache.set(profile, targets);
  return targets;
}

export function detectIntegration(path: string): string | null {
  return invoke("integration", "detect", path) as string | null;
}

export function detectIntegrations(paths: string[]): Array<string | null> {
  return invoke("integration", "detect-many", JSON.stringify(paths)) as Array<
    string | null
  >;
}
