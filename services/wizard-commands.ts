/**
 * Registry of wizard commands the workbench can run.
 *
 * Sourced from `apps/manifest.json`. Each entry maps to a yargs subcommand in
 * bin.ts (or the default integration flow when `id === 'default'`).
 */

import { readFileSync } from "node:fs";
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
  /** Subdirectory under apps/ to scan for test apps. */
  appsDir: string;
}

interface ManifestEntry {
  id: string;
  dir: string;
  label: string;
  description: string;
  ciCapable?: boolean;
}

interface Manifest {
  workflows: ManifestEntry[];
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = join(__dirname, "..", "apps", "manifest.json");

function loadManifest(): WizardCommand[] {
  const raw = readFileSync(MANIFEST_PATH, "utf8");
  const manifest = JSON.parse(raw) as Manifest;
  return manifest.workflows.map((w) => ({
    id: w.id,
    label: w.label,
    description: w.description,
    ciCapable: w.ciCapable ?? false,
    appsDir: w.dir,
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
  extra?: { skillId?: string; product?: string },
): string {
  if (id === 'skill') {
    return `wizard --skill=${extra?.skillId || '<skill-id>'}`;
  }
  if (id === 'migrate') {
    return `wizard migrate --product=${extra?.product || '<product>'}`;
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
