/**
 * `pnpm wizard-agent` — one real agent run through the wizard's `runAgent` on
 * a skill that has nothing to do with PostHog programs. A local skills server
 * hands the agent a `quack` skill, the agent writes `quack/quack.txt` into an
 * empty directory, and this script checks the file. No programs, TUI, store or
 * context-mill are involved.
 *
 *   WIZARD_REPO=<wizard checkout> PROJECT_ID=… POSTHOG_KEY_FILE=… \
 *   [E2E_RESULT_JSON=result.json] pnpm wizard-agent
 *
 *   WIZARD_REPO=<wizard checkout> pnpm wizard-agent --check
 */

import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  CHECK,
  exitAfterCheck,
  formatProgress,
  importSharedModules,
  importWizard,
  readE2eEnv,
  requireWizardDependency,
  resolveE2eCredentials,
  writeE2eResult,
  type AgentProgress,
} from "./harness.js";

/** The slice of `@agent` this route calls. */
type Agent = {
  runAgent(
    config: Record<string, unknown>,
    input: Record<string, unknown>,
    options: { onProgress: (event: AgentProgress) => void },
  ): Promise<{ outcome: string; failure?: { message: string } }>;
  RunOutcome: { Success: string };
};
type Constants = {
  Sequence: { linear: string };
  Harness: { anthropic: string };
  HAIKU_MODEL: string;
};
type Fflate = { zipSync(files: Record<string, Uint8Array>): Uint8Array };

const PROGRAM_ID = "e2e-agent";
const SKILL_ID = "quack";
const QUACK_FILE = join("quack", "quack.txt");
const SKILL_MD = `---
name: quack
description: Write the word quack into quack/quack.txt.
---

# Quack

1. Create a directory named \`quack\` in the current working directory.
2. Write a file \`quack/quack.txt\` whose entire content is the word \`quack\`.
3. Change nothing else. Do not install packages or call any PostHog tool.
`;

/** Serve a one-skill menu and its archive on a loopback port. */
async function serveQuackSkill(fflate: Fflate): Promise<{ url: string; close: () => void }> {
  const archive = Buffer.from(fflate.zipSync({ "SKILL.md": new TextEncoder().encode(SKILL_MD) }));
  let base = "";
  const server = createServer((req, res) => {
    if (req.url === "/skill-menu.json") {
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          categories: {
            e2e: [{ id: SKILL_ID, name: "Quack", downloadUrl: `${base}/quack.zip` }],
          },
        }),
      );
    } else if (req.url === "/quack.zip") {
      res.setHeader("content-type", "application/zip");
      res.end(archive);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  const address = server.address() as { port: number };
  base = `http://127.0.0.1:${address.port}`;
  return { url: base, close: () => server.close() };
}

async function main(): Promise<void> {
  const { runAgent, RunOutcome } = await importWizard<Agent>("@agent", ["runAgent", "RunOutcome"]);
  const { Sequence, Harness, HAIKU_MODEL } = await importWizard<Constants>("@shared/constants", [
    "Sequence",
    "Harness",
    "HAIKU_MODEL",
  ]);
  const shared = await importSharedModules();
  const fflate = requireWizardDependency<Fflate>("fflate");
  if (CHECK) exitAfterCheck("wizard-agent");

  const e2e = readE2eEnv(process.env, { needsAppDir: false });
  const workDir = mkdtempSync(join(tmpdir(), "wizard-e2e-agent-"));
  const credentials = await resolveE2eCredentials(e2e, shared);
  const skills = await serveQuackSkill(fflate);

  const config = {
    programId: PROGRAM_ID,
    run: {
      integrationLabel: SKILL_ID,
      skillId: SKILL_ID,
      spinnerMessage: "Quacking",
      successMessage: "Quacked",
      estimatedDurationMinutes: 1,
      reportFile: "quack-report.md",
      docsUrl: "https://posthog.com/docs",
    },
    composed: false,
    // Bound the way agentic detection binds its direct runAgent call: linear
    // Haiku on the Anthropic harness.
    binding: { sequence: Sequence.linear, harness: Harness.anthropic, model: HAIKU_MODEL },
    // Only the orchestrator reads it; this run is linear.
    switchboard: { program: PROGRAM_ID, composed: false, flags: {}, flagPayloads: {} },
    skillsBaseUrl: skills.url,
    wizardFlags: {},
    wizardFlagPayloads: {},
    wizardMetadata: {},
  };

  try {
    const result = await runAgent(
      config,
      {
        installDir: workDir,
        credentials: credentials.posthog,
        project: credentials.project,
        apiUser: credentials.apiUser,
        skillId: SKILL_ID,
        flags: {
          ci: true,
          signup: false,
          debug: false,
          e2eAsk: false,
          localMcp: false,
          captureAio: false,
          benchmark: false,
          yaraReport: false,
        },
        host: {},
      },
      {
        onProgress: (event) => {
          const line = formatProgress(event);
          if (line) console.log(line);
        },
      },
    );

    const quackPath = join(workDir, QUACK_FILE);
    const quack = existsSync(quackPath) ? readFileSync(quackPath, "utf8").trim() : null;
    const passed = result.outcome === RunOutcome.Success && quack === "quack";
    writeE2eResult({
      route: "agent",
      skillId: SKILL_ID,
      workDir,
      outcome: result.outcome,
      failure: result.outcome === RunOutcome.Success ? null : (result.failure?.message ?? null),
      quack,
      passed,
    });
    console.log(`${SKILL_ID}: ${result.outcome}, ${QUACK_FILE} = ${quack}`);
    if (!passed) process.exitCode = 1;
  } finally {
    skills.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
