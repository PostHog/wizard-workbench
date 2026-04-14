/**
 * Registry of wizard commands the workbench can run.
 *
 * Each entry maps to a yargs subcommand in bin.ts (or the default integration
 * flow when `id === 'default'`). Adding a new wizard command to the workbench
 * picker only requires appending to this list.
 */

export interface WizardCommand {
  /** Subcommand ID. 'default' means the main integration flow (no subcommand). */
  id: string;
  /** Human-readable label shown in the picker. */
  label: string;
  /** One-line description shown next to the label. */
  description: string;
  /** Whether this command supports the --ci flag for non-interactive runs. */
  ciCapable?: boolean;
}

export const WIZARD_COMMANDS: WizardCommand[] = [
  {
    id: 'default',
    label: 'PostHog Integration',
    description: 'Set up PostHog in a new or existing project',
    ciCapable: true,
  },
  {
    id: 'revenue',
    label: 'Revenue Analytics',
    description: 'Wire Stripe + PostHog for revenue tracking',
    ciCapable: true,
  },
  {
    id: 'skill',
    label: 'Skill',
    description: 'Run a skill by ID from context mill',
  },
];

/**
 * Convert a command id to the subcommand string the wizard binary expects.
 * 'default' → undefined (no subcommand), 'skill' → undefined (uses --skill flag),
 * any other id → the id itself.
 */
export function commandToSubcommand(id: string): string | undefined {
  if (id === 'default' || id === 'skill') return undefined;
  return id;
}

/**
 * Render a command as the literal CLI invocation that will be run.
 * e.g. 'default' → "posthog-wizard", 'revenue' → "posthog-wizard revenue",
 * 'skill' → "posthog-wizard --skill=<skill-id>".
 */
export function commandToInvocation(id: string, skillId?: string): string {
  if (id === 'skill') {
    return `wizard --skill=${skillId || '<skill-id>'}`;
  }
  const sub = commandToSubcommand(id);
  return sub ? `wizard ${sub}` : 'wizard';
}

export function findCommand(id: string): WizardCommand | undefined {
  return WIZARD_COMMANDS.find((c) => c.id === id);
}
