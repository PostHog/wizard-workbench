/**
 * Shared inputs and outputs for the headless wizard routes, `run-program.ts`
 * and `run-agent.ts`. Each runs one wizard surface in this process.
 *
 * The wizard is not a dependency of this repo. Its source comes from the
 * checkout in `WIZARD_REPO`, through the wizard's own path aliases (`@programs`,
 * `@agent`, `@shared/*`). The package scripts start tsx with
 * `--tsconfig "$WIZARD_REPO/tsconfig.json"`, so tsx resolves those aliases
 * against that checkout, here and inside every wizard file.
 *
 * Every route reads the same env: a PostHog personal key from
 * `POSTHOG_PERSONAL_API_KEY` or `POSTHOG_KEY_FILE`, and a project from
 * `PROJECT_ID`. The wizard's runner mints its own gateway token from that key.
 * The program route also takes `APP_DIR`. The agent route makes its own empty
 * directory. `--check` exits once the wizard modules load, before any of that
 * env is read and before any request.
 */

import { existsSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** `--check`: load the wizard modules a run needs, print where they resolved, exit. */
export const CHECK = process.argv.includes("--check");

export type E2eEnv = {
  /** Empty when the route makes its own working directory. */
  appDir: string;
  apiKey: string;
  projectId: number;
};

/** The progress events the wizard's `AgentProgress` carries, typed here by hand. */
export type AgentProgress =
  | { kind: "log"; message: string }
  | { kind: "status"; message: string }
  | { kind: "stage"; stage: string }
  | { kind: "tasks"; tasks: { status: string; content: string }[] }
  | { kind: "url"; which: string; url: string }
  | { kind: "authError" }
  | {
      kind:
        | "lifecycle"
        | "spinner"
        | "usage"
        | "finalCost"
        | "handoff"
        | "completion"
        | "activity";
    };

/** The wizard's `@shared` modules the credential step calls. */
export type SharedModules = {
  api: {
    fetchProjectData(
      apiKey: string,
      projectId: number,
      baseUrl: string,
    ): Promise<{ api_token: string }>;
    fetchUserData(apiKey: string, baseUrl: string): Promise<unknown>;
  };
  hosts: {
    HostResolution: {
      fromAccessToken(
        apiKey: string,
        options: { region: string },
      ): Promise<{ appHost: string }>;
    };
  };
};

export type E2eCredentials = {
  posthog: {
    accessToken: string;
    projectApiKey: string;
    host: unknown;
    projectId: number;
  };
  project: unknown;
  apiUser: unknown;
};

/** Where each wizard module resolved, for `--check`. */
const loaded: { specifier: string; file: string }[] = [];

/** The wizard checkout the package script handed to tsx. */
export function wizardRepo(): string {
  const repo = process.env.WIZARD_REPO?.trim();
  if (!repo || !existsSync(join(repo, "tsconfig.json")))
    throw new Error("Set WIZARD_REPO to a wizard checkout with a tsconfig.json");
  return realpathSync(resolve(repo));
}

/** `file` relative to the wizard checkout, or null when it sits outside it. */
function inWizardRepo(file: string): string | null {
  const inRepo = relative(wizardRepo(), realpathSync(file));
  return inRepo.startsWith("..") || isAbsolute(inRepo) ? null : inRepo;
}

/**
 * Import one wizard module through its alias. Fails unless the alias resolves
 * inside `WIZARD_REPO` and the module exports every name in `names`.
 */
export async function importWizard<T>(
  specifier: string,
  names: readonly (keyof T & string)[],
): Promise<T> {
  let url: string;
  try {
    url = import.meta.resolve(specifier);
  } catch {
    throw new Error(
      `${specifier} did not resolve. Start through the package script, which runs tsx with --tsconfig "$WIZARD_REPO/tsconfig.json".`,
    );
  }
  const file = inWizardRepo(fileURLToPath(url));
  if (!file) throw new Error(`${specifier} resolved to ${url}, outside WIZARD_REPO ${wizardRepo()}`);
  loaded.push({ specifier, file });
  const module = (await import(url)) as Record<string, unknown>;
  const missing = names.filter((name) => module[name] === undefined);
  if (missing.length > 0)
    throw new Error(`${specifier} in ${wizardRepo()} exports no ${missing.join(", ")}`);
  return module as T;
}

/** Load a package from the wizard's own dependencies, not the workbench's. */
export function requireWizardDependency<T>(name: string): T {
  const wizardRequire = createRequire(join(wizardRepo(), "package.json"));
  const file = wizardRequire.resolve(name);
  loaded.push({ specifier: name, file: inWizardRepo(file) ?? file });
  return wizardRequire(name) as T;
}

/** Load the `@shared` modules `resolveE2eCredentials` calls. */
export async function importSharedModules(): Promise<SharedModules> {
  return {
    api: await importWizard<SharedModules["api"]>("@shared/api", [
      "fetchProjectData",
      "fetchUserData",
    ]),
    hosts: await importWizard<SharedModules["hosts"]>(
      "@shared/host-resolution",
      ["HostResolution"],
    ),
  };
}

/** Print where every wizard module resolved and exit, before any env read or request. */
export function exitAfterCheck(route: string): never {
  console.log(`${route}: wizard modules resolve from ${wizardRepo()}`);
  for (const { specifier, file } of loaded) console.log(`  ${specifier} -> ${file}`);
  process.exit(0);
}

/** A blank variable counts as unset, so the key file is the fallback. */
export function readPersonalApiKey(
  env: NodeJS.ProcessEnv,
  readFile: (file: string) => string = (file) => readFileSync(file, "utf8"),
): string {
  const inline = env.POSTHOG_PERSONAL_API_KEY?.trim();
  if (inline) return inline;
  const file = env.POSTHOG_KEY_FILE?.trim();
  return file ? readFile(file).trim() : "";
}

/** Throws one message listing every missing input, before any run starts. */
export function readE2eEnv(
  env: NodeJS.ProcessEnv,
  { needsAppDir = true }: { needsAppDir?: boolean } = {},
): E2eEnv {
  const missing: string[] = [];
  const appDir = env.APP_DIR?.trim() ?? "";
  if (needsAppDir && (!appDir || !existsSync(appDir)))
    missing.push("APP_DIR: an existing app copy, never the fixture in apps/");
  let apiKey = "";
  try {
    apiKey = readPersonalApiKey(env);
  } catch {
    // An unreadable key file is reported as a missing key below.
  }
  if (!apiKey) missing.push("POSTHOG_PERSONAL_API_KEY or a readable POSTHOG_KEY_FILE");
  const projectId = Number(env.PROJECT_ID);
  if (!Number.isInteger(projectId) || projectId <= 0)
    missing.push("PROJECT_ID: a positive project id");
  if (missing.length > 0) throw new Error(`Missing e2e inputs:\n- ${missing.join("\n- ")}`);
  return { appDir, apiKey, projectId };
}

/**
 * Resolve PostHog credentials from the personal key through the wizard's
 * `@shared` modules only, so the agent route loads nothing from programs, the
 * TUI or the CLI.
 */
export async function resolveE2eCredentials(
  e2e: E2eEnv,
  shared: SharedModules,
): Promise<E2eCredentials> {
  const host = await shared.hosts.HostResolution.fromAccessToken(e2e.apiKey, {
    region: "us",
  });
  const project = await shared.api.fetchProjectData(e2e.apiKey, e2e.projectId, host.appHost);
  const apiUser = await shared.api.fetchUserData(e2e.apiKey, host.appHost).catch(() => null);
  return {
    posthog: {
      accessToken: e2e.apiKey,
      projectApiKey: project.api_token,
      host,
      projectId: e2e.projectId,
    },
    project,
    apiUser,
  };
}

/** Write the route's result to `E2E_RESULT_JSON`, when set, for a caller to assert on. */
export function writeE2eResult(result: Record<string, unknown>): void {
  const file = process.env.E2E_RESULT_JSON;
  if (file) writeFileSync(file, JSON.stringify(result, null, 2));
}

/** One line per progress event a person would want in a CI log. */
export function formatProgress(event: AgentProgress): string | null {
  switch (event.kind) {
    case "log":
      return event.message;
    case "status":
      return `status: ${event.message}`;
    case "stage":
      return `stage: ${event.stage}`;
    case "tasks":
      return `tasks: ${event.tasks.map((task) => `${task.status} ${task.content}`).join(", ")}`;
    case "url":
      return `${event.which}: ${event.url}`;
    case "authError":
      return "gateway rejected the inference token";
    default:
      return null;
  }
}
