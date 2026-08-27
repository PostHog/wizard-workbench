/**
 * Registry of wizard commands the workbench can run.
 *
 * Sourced from `apps/manifest.json`. Each entry maps to a yargs subcommand in
 * bin.ts (or the default integration flow when `id === 'default'`).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface WizardCommand {
  /** Subcommand ID. 'default' means the main integration flow (no subcommand). */
  id: string;
  /** Human-readable label shown in the picker. */
  label: string;
  /** One-line description shown next to the label. */
  description: string;
  /** Whether this command supports the --ci flag for non-interactive runs. */
  ciCapable?: boolean;
  /**
   * Whether this command only runs under `--e2e`. An e2eOnly command drives a
   * mocked, assertion-graded run, so the normal diff-mode runners (wizard-run,
   * wizard-benchmark) hide it — they would produce a diff nobody grades.
   */
  e2eOnly?: boolean;
  /** Subdirectory under apps/ to scan for test apps. */
  appsDir: string;
  /** Whether the wizard repo ships an e2e.json flow definition for this command. */
  hasE2e: boolean;
}

interface ManifestEntry {
  id: string;
  dir: string;
  label: string;
  description: string;
  ciCapable?: boolean;
  e2eOnly?: boolean;
}

interface Manifest {
  workflows: ManifestEntry[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = join(__dirname, "..", "apps", "manifest.json");

/**
 * Map a command id to its wizard program id where they differ — used to locate
 * the program's e2e test definition (`src/lib/programs/<program>/test/e2e.json`)
 * in the wizard repo.
 */
const COMMAND_PROGRAM: Record<string, string> = {
  default: "posthog-integration",
  migrate: "migration",
  skill: "agent-skill",
  warehouse: "warehouse-source",
  "upload-sourcemaps": "error-tracking-upload-source-maps",
};

/** The wizard program id a command drives (e.g. 'default' → 'posthog-integration'). */
export function commandToProgram(id: string): string {
  return COMMAND_PROGRAM[id] ?? id;
}

/** Whether the wizard repo ships an e2e.json flow definition for this command. */
function hasE2eDefinition(commandId: string): boolean {
  const wizardPath = process.env.WIZARD_PATH;
  if (!wizardPath) return false;
  const program = COMMAND_PROGRAM[commandId] ?? commandId;
  return existsSync(
    join(wizardPath, "src", "lib", "programs", program, "test", "e2e.json"),
  );
}

function loadManifest(): WizardCommand[] {
  const raw = readFileSync(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw) as Manifest;
  return manifest.workflows.map((w) => ({
    id: w.id,
    label: w.label,
    description: w.description,
    ciCapable: w.ciCapable ?? false,
    e2eOnly: w.e2eOnly ?? false,
    appsDir: w.dir,
    hasE2e: hasE2eDefinition(w.id),
  }));
}

export const WIZARD_COMMANDS: WizardCommand[] = loadManifest();

/**
 * Family commands (e.g. `audit`) require a concrete leaf in non-interactive
 * runs — after the CLI overhaul, bare `wizard audit` opens an interactive
 * picker (or errors under `--ci`) instead of running an audit. Drive a
 * sensible default leaf so CI keeps exercising the command. `all` runs the
 * comprehensive audit so CI checks full integrations end-to-end.
 */
const FAMILY_DEFAULT_LEAF: Record<string, string> = { audit: 'all' };

/**
 * Convert a command id to the subcommand string the wizard binary expects.
 * 'default' → undefined (no subcommand), 'skill' → undefined (uses --skill flag),
 * a family id → "<family> <leaf>" (e.g. 'audit' → 'audit events'),
 * any other id → the id itself. May be multi-token — callers must split on
 * whitespace before pushing into an argv array.
 */
export function commandToSubcommand(id: string): string | undefined {
  if (id === 'default' || id === 'skill') return undefined;
  if (FAMILY_DEFAULT_LEAF[id]) return `${id} ${FAMILY_DEFAULT_LEAF[id]}`;
  return id;
}

/**
 * Migrate variants the workbench knows how to drive. Keep in sync with the
 * wizard's `--product` choices (src/lib/workflows/migration/index.ts +
 * bin.ts).
 */
export const MIGRATE_PRODUCTS = ['statsig'] as const;
export type MigrateProduct = (typeof MIGRATE_PRODUCTS)[number];

/**
 * Render a command as the literal CLI invocation that will be run.
 * e.g. 'default' → "posthog-wizard", 'revenue' → "posthog-wizard revenue",
 * 'skill' → "posthog-wizard --skill=<skill-id>",
 * 'migrate' → "posthog-wizard migrate --product=<product>".
 */
export function commandToInvocation(
  id: string,
  extra?: { skillId?: string; product?: string; integrate?: boolean },
): string {
  if (id === 'skill') {
    return `wizard --skill=${extra?.skillId || '<skill-id>'}`;
  }
  if (id === 'migrate') {
    return `wizard migrate --product=${extra?.product || '<product>'}`;
  }
  if (id === 'self-driving') {
    return extra?.integrate
      ? 'wizard self-driving --integrate'
      : 'wizard self-driving';
  }
  const sub = commandToSubcommand(id);
  return sub ? `wizard ${sub}` : 'wizard';
}

export function findCommand(id: string): WizardCommand | undefined {
  return WIZARD_COMMANDS.find((c) => c.id === id);
}

/**
 * Find a command whose appsDir matches the first segment of an app path.
 * e.g. "basic-integration/angular/foo" → command with appsDir "basic-integration".
 */
export function findCommandByAppPath(appPath: string): WizardCommand | undefined {
  const slash = appPath.indexOf("/");
  if (slash <= 0) return undefined;
  const prefix = appPath.slice(0, slash);
  return WIZARD_COMMANDS.find((c) => c.appsDir === prefix);
}

/**
 * Keep only apps whose command has an e2e.json flow definition. Falls back to
 * the full list if none resolve (e.g. WIZARD_PATH unset), so a picker never
 * goes empty.
 */
export function filterE2eApps<T extends { name: string }>(apps: T[]): T[] {
  const filtered = apps.filter((a) => findCommandByAppPath(a.name)?.hasE2e);
  return filtered.length > 0 ? filtered : apps;
}
