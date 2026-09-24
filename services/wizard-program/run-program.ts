/**
 * `pnpm wizard-program` — one real program run through the wizard's
 * `runProgram`, with no TUI. This process is the host: it builds the run
 * definition and program settings from the program's `ProgramConfig`, the way
 * the wizard's legacy adapter does, and supplies the credentials.
 *
 *   WIZARD_REPO=<wizard checkout> APP_DIR=<app copy> PROJECT_ID=… \
 *   POSTHOG_KEY_FILE=… [PROGRAM=posthog-integration] \
 *   [E2E_RESULT_JSON=result.json] pnpm wizard-program
 *
 *   WIZARD_REPO=<wizard checkout> pnpm wizard-program --check
 */

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

type FrameworkConfig = { metadata: { docsUrl: string } };

/** The slice of `WizardSession` this route reads and writes. */
type Session = {
  installDir: string;
  integration: string | null;
  frameworkConfig: FrameworkConfig | null;
};

/** The UI effects a program's `run(session, host)` may call. */
type ProgramRunHost = {
  getFrameworkContext(key: string): unknown;
  setFrameworkContext(key: string, value: unknown): void;
  warn(message: string): void;
};

/** The slice of `ProgramConfig` a run is built from. */
type ProgramConfig = {
  steps: unknown[];
  run?: object | ((session: Session, host: ProgramRunHost) => Promise<object>);
  requiresAi?: boolean;
  agentFlow?: string;
  allowedTools?: readonly string[];
  disallowedTools?: readonly string[];
  excludedTaskTypes?: unknown;
};

type Programs = {
  runProgram(
    programId: string,
    input: Record<string, unknown>,
    options: { onProgress: (progress: ProgramProgress) => void },
  ): Promise<ProgramRunOutcome>;
  getProgramConfig(programId: string): ProgramConfig | undefined;
};
type ProgramSteps = {
  postAuthGateSteps(steps: unknown[]): { id: string }[];
};
type Sessions = {
  buildSession(args: { installDir: string; ci: boolean }): Session;
};
type Ui = {
  setUI(ui: unknown): void;
  getUI(): {
    getFrameworkContext(key: string): unknown;
    setFrameworkContext(key: string, value: unknown): void;
    log: { warn(message: string): void };
  };
};
type HeadlessUi = { HeadlessUI: new (store: unknown) => unknown };
type Store = { WizardStore: new (programId: string) => { session: Session } };
type Registry = { FRAMEWORK_REGISTRY: Record<string, FrameworkConfig> };
type Detection = {
  detectFramework(installDir: string): Promise<string | undefined>;
};

async function main(): Promise<void> {
  const { runProgram, getProgramConfig } = await importWizard<Programs>(
    "@programs",
    ["runProgram", "getProgramConfig"],
  );
  const { postAuthGateSteps } = await importWizard<ProgramSteps>(
    "@programs/program-step",
    ["postAuthGateSteps"],
  );
  const { buildSession } = await importWizard<Sessions>("@lib/wizard-session", [
    "buildSession",
  ]);
  const { setUI, getUI } = await importWizard<Ui>("@ui", ["setUI", "getUI"]);
  const { HeadlessUI } = await importWizard<HeadlessUi>("@ui/headless-ui", [
    "HeadlessUI",
  ]);
  const { WizardStore } = await importWizard<Store>("@ui/tui/store", [
    "WizardStore",
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
  const programConfig = getProgramConfig(programId);
  if (!programConfig?.run)
    throw new Error(`${programId} is not a registered program with a run`);

  // A program's `run(session)` can call `getUI()`. Install the headless UI
  // the `--ci` runner installs, over a store that holds this session.
  const session = buildSession({ installDir: e2e.appDir, ci: true });
  const store = new WizardStore(programId);
  store.session = session;
  setUI(new HeadlessUI(store));

  // posthog-integration's `run(session)` reads the framework off the session.
  // A `--ci` run fills it in `ciPreRun`, which also logs in and can scan the
  // repo with an agent, so this route detects the framework alone.
  if (programId === "posthog-integration") {
    const integration = await detectFramework(e2e.appDir);
    if (!integration)
      throw new Error(`No supported framework detected in ${e2e.appDir}`);
    session.integration = integration;
    session.frameworkConfig = FRAMEWORK_REGISTRY[integration];
  }

  const credentials = await resolveE2eCredentials(e2e, shared);
  // The legacy adapter's run host: each effect reaches `getUI()` at call time.
  const host: ProgramRunHost = {
    getFrameworkContext: (key) => getUI().getFrameworkContext(key),
    setFrameworkContext: (key, value) => getUI().setFrameworkContext(key, value),
    warn: (message) => getUI().log.warn(message),
  };
  const run =
    typeof programConfig.run === "function"
      ? await programConfig.run(session, host)
      : programConfig.run;

  // No hooks or seed tasks: postRun uploads env vars to a hosting provider,
  // the outro builders feed a screen, and a CI session seeds no tasks.
  const outcome = await runProgram(
    programId,
    {
      installDir: session.installDir,
      run,
      program: {
        requiresAi: programConfig.requiresAi,
        agentFlow: programConfig.agentFlow,
        allowedTools: programConfig.allowedTools,
        disallowedTools: programConfig.disallowedTools,
        excludedTaskTypes: programConfig.excludedTaskTypes,
        postAuthGates: postAuthGateSteps(programConfig.steps).map(
          (step) => step.id,
        ),
      },
      credentials,
      integration: session.integration,
      frameworkDocsUrl: session.frameworkConfig?.metadata.docsUrl,
      flags: { ci: true },
    },
    {
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
    integration: session.integration,
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
