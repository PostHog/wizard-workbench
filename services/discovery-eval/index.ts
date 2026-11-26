#!/usr/bin/env node
/**
 * Deterministic goalpost grader for `PostHog/wizard` project discovery.
 *
 * Runs `wizard --test-discovery=json` (zero login, zero LLM tokens, zero cost)
 * against production and custom monorepo fixtures under `apps/project-discovery/`
 * and grades each report against `services/discovery-eval/expectations/*.discovery.json`.
 *
 * Usage:
 *   pnpm discovery-eval --wizard /path/to/wizard [--filter <name>] [--strict] [--json]
 */

import "dotenv/config";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  evaluateDiscoveryReport,
  hasBlockingFailure,
  loadDiscoveryExpectations,
  readDiscoveryReport,
  type DiscoveryExpectFile,
  type DiscoveryScenarioExpect,
  type DiscoveryTestReport,
  type ScenarioResult,
} from "./checks.js";

const WORKBENCH = resolve(import.meta.dirname, "..", "..");
const DISCOVERY_ROOT = join(WORKBENCH, "apps", "project-discovery");
const EXPECTATIONS_DIR = join(import.meta.dirname, "expectations");

interface CliArgs {
  wizardPath: string;
  filter?: string;
  strict: boolean;
  json: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  let wizardPath = process.env.WIZARD_PATH ?? "";
  let filter: string | undefined;
  let strict = false;
  let json = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--wizard" && argv[i + 1]) {
      wizardPath = argv[++i];
    } else if (arg.startsWith("--wizard=")) {
      wizardPath = arg.slice("--wizard=".length);
    } else if (arg === "--filter" && argv[i + 1]) {
      filter = argv[++i];
    } else if (arg.startsWith("--filter=")) {
      filter = arg.slice("--filter=".length);
    } else if (arg === "--strict") {
      strict = true;
    } else if (arg === "--json") {
      json = true;
    }
  }

  if (!wizardPath) {
    console.error(
      "Missing wizard checkout path. Pass --wizard /path/to/wizard or set WIZARD_PATH.",
    );
    process.exit(2);
  }
  return { wizardPath: resolve(wizardPath), filter, strict, json };
}

function runTestDiscovery(
  wizardPath: string,
  installDir: string,
  scenario: DiscoveryScenarioExpect,
): { report: DiscoveryTestReport; durationMs: number } {
  const mode = scenario.mode ?? "one-project";
  const cliArgs = [
    ...(scenario.command ? [scenario.command] : []),
    "--test-discovery=json",
    `--install-dir=${installDir}`,
  ];

  const distBin = join(wizardPath, "dist", "bin.js");
  const useBuilt = existsSync(distBin) && process.env.DISCOVERY_EVAL_USE_SOURCE !== "1";
  const cmd = useBuilt ? process.execPath : "pnpm";
  const args = useBuilt
    ? [distBin, ...cliArgs]
    : [
        "exec",
        "tsx",
        "--tsconfig",
        "tsconfig.base.json",
        "--import",
        "./scripts/markdown-loader.no-jest.mjs",
        "bin.ts",
        ...cliArgs,
      ];

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    WIZARD_CI_FLAG_OVERRIDES: JSON.stringify({
      "wizard-project-discovery": mode,
    }),
  };

  const started = Date.now();
  const stdout = execFileSync(cmd, args, {
    cwd: wizardPath,
    env,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 30_000,
  });
  const durationMs = Date.now() - started;

  const jsonStart = stdout.indexOf("{");
  if (jsonStart === -1) {
    throw new Error(`No JSON object found in stdout:\n${stdout.slice(0, 400)}`);
  }
  const report = readDiscoveryReport(JSON.parse(stdout.slice(jsonStart)));
  return { report, durationMs };
}

function runFixture(
  wizardPath: string,
  spec: DiscoveryExpectFile,
  strict: boolean,
): ScenarioResult[] {
  const fixtureDir = join(DISCOVERY_ROOT, spec.fixture);
  if (!existsSync(fixtureDir)) {
    return [
      {
        fixtureId: spec.id,
        scenario: "setup",
        durationMs: 0,
        checks: [],
        error: `Fixture missing at ${fixtureDir} (run: git submodule update --init --recursive)`,
      },
    ];
  }

  const results: ScenarioResult[] = [];
  for (const scenario of spec.scenarios) {
    const targetDir = scenario.subdir
      ? join(fixtureDir, scenario.subdir)
      : fixtureDir;
    try {
      const { report, durationMs } = runTestDiscovery(
        wizardPath,
        targetDir,
        scenario,
      );
      const checks = evaluateDiscoveryReport(report, scenario, durationMs, {
        strict,
      });
      results.push({
        fixtureId: spec.id,
        scenario: scenario.name,
        durationMs,
        checks,
      });
    } catch (error) {
      results.push({
        fixtureId: spec.id,
        scenario: scenario.name,
        durationMs: 0,
        checks: [],
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const specs = loadDiscoveryExpectations(EXPECTATIONS_DIR).filter((s) =>
    args.filter
      ? s.id.includes(args.filter) || s.toolFamily.includes(args.filter)
      : true,
  );

  if (specs.length === 0) {
    console.error("No discovery expectation files matched.");
    process.exit(2);
  }

  const allResults: ScenarioResult[] = [];
  for (const spec of specs) {
    allResults.push(...runFixture(args.wizardPath, spec, args.strict));
  }

  if (args.json) {
    process.stdout.write(`${JSON.stringify(allResults, null, 2)}\n`);
  } else {
    let passTotal = 0;
    let failTotal = 0;
    let advTotal = 0;

    for (const res of allResults) {
      const label = `${res.fixtureId} [${res.scenario}]`;
      if (res.error) {
        failTotal += 1;
        console.log(`ERROR ${label}: ${res.error}`);
        continue;
      }
      const fails = res.checks.filter((c) => c.status === "fail").length;
      const advs = res.checks.filter((c) => c.status === "advisory").length;
      const passes = res.checks.filter((c) => c.status === "pass").length;
      passTotal += passes;
      failTotal += fails;
      advTotal += advs;

      const badge = fails > 0 ? "FAIL" : advs > 0 ? "ADV " : "PASS";
      console.log(
        `${badge}  ${label} (${res.durationMs}ms) — ${passes} pass, ${fails} fail, ${advs} advisory`,
      );
      for (const check of res.checks) {
        if (check.status !== "pass") {
          console.log(
            `        [${check.status.toUpperCase()}] ${check.name}: ${check.detail}`,
          );
        }
      }
    }

    console.log(
      `\nSummary: ${passTotal} pass, ${failTotal} fail, ${advTotal} advisory across ${allResults.length} scenarios`,
    );
  }

  const failed = allResults.some(
    (r) => Boolean(r.error) || hasBlockingFailure(r.checks),
  );
  process.exit(failed ? 1 : 0);
}

main();
