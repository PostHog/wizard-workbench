/**
 * `pnpm wizard-program` — one real program run through the wizard's
 * `runProgram`, with no TUI, no store and no session. This process is the
 * host: it detects the framework and supplies the integration effects a CLI
 * host would.
 *
 *   WIZARD_REPO=<wizard checkout> APP_DIR=<app copy> PROJECT_ID=… \
 *   POSTHOG_KEY_FILE=… WIZARD_CI_GATEWAY_TOKEN_FILE=… \
 *   [PROGRAM=posthog-integration] [E2E_RESULT_JSON=result.json] \
 *   pnpm wizard-program
 *
 *   WIZARD_REPO=<wizard checkout> pnpm wizard-program --check
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CHECK,
  exitAfterCheck,
  formatProgress,
  importSharedModules,
  importWizard,
  readE2eEnv,
  resolveE2eCredentials,
  writeE2eResult,
  type AgentProgress,
} from "./harness.js";

/** The slice of `ProgramRunOutcome` this route reads. */
type ProgramRunOutcome = {
  outcome: string;
  failure?: { message: string };
  settledRuns: { result: { snapshot?: { tasks: unknown[] } } }[];
};

type ProgramProgress =
  { kind: "run"; event: AgentProgress } | { kind: "program" };

type Programs = {
  runProgram(
    programId: string,
    input: Record<string, unknown>,
    options: {
      integrationEffects: Record<string, unknown>;
      onProgress: (progress: ProgramProgress) => void;
    },
  ): Promise<ProgramRunOutcome>;
};
type Registry = { FRAMEWORK_REGISTRY: Record<string, unknown> };
type Detection = {
  detectFramework(installDir: string): Promise<string | undefined>;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
} | null;

const effects = {
  readPackageJson: (installDir: string) => {
    const file = join(installDir, "package.json");
    return Promise.resolve(
      existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null,
    );
  },
  hasDeclaredDependency: (name: string, packageJson: unknown) => {
    const pkg = packageJson as PackageJson;
    return Boolean(pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name]);
  },
  warn: (message: string) => console.warn(message),
  setTag: () => undefined,
  capture: () => undefined,
  // A synthetic run never writes to a hosting provider.
  uploadEnvironmentVariables: () => Promise.resolve([]),
  requestDeepLink: () => Promise.resolve(null),
  openDashboardDeepLink: () => undefined,
};

async function main(): Promise<void> {
  const { runProgram } = await importWizard<Programs>("@programs", [
    "runProgram",
  ]);
  const { FRAMEWORK_REGISTRY } = await importWizard<Registry>(
    "@programs/registry",
    ["FRAMEWORK_REGISTRY"],
  );
  const { detectFramework } = await importWizard<Detection>(
    "@programs/detection/framework",
    ["detectFramework"],
  );
  const shared = await importSharedModules();
  if (CHECK) exitAfterCheck("wizard-program");

  const e2e = readE2eEnv(process.env);
  const programId = process.env.PROGRAM || "posthog-integration";
  const credentials = await resolveE2eCredentials(e2e, shared);

  const integration =
    programId === "posthog-integration"
      ? await detectFramework(e2e.appDir)
      : undefined;
  if (programId === "posthog-integration" && !integration)
    throw new Error(`No supported framework detected in ${e2e.appDir}`);

  const outcome = await runProgram(
    programId,
    {
      installDir: e2e.appDir,
      credentials,
      integration: integration ?? null,
      frameworkConfig: integration
        ? FRAMEWORK_REGISTRY[integration]
        : undefined,
      frameworkContext: {},
      flags: { ci: true },
    },
    {
      integrationEffects: effects,
      onProgress: (progress) => {
        // Program-data snapshots carry state, not a line to print.
        if (progress.kind !== "run") return;
        const line = formatProgress(progress.event);
        if (line) console.log(line);
      },
    },
  );

  writeE2eResult({
    route: "programs",
    programId,
    integration: integration ?? null,
    outcome: outcome.outcome,
    failure: outcome.failure?.message ?? null,
    settledRuns: outcome.settledRuns.length,
    tasks: outcome.settledRuns.flatMap(
      (run) => run.result.snapshot?.tasks ?? [],
    ),
  });
  console.log(`${programId}: ${outcome.outcome}`);
  if (outcome.outcome !== "success") process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
