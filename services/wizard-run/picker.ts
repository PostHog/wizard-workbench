/**
 * Interactive pickers for command and app selection.
 * Shared by wizard-run and wizard-ci.
 */

import { createInterface } from "readline";
import {
  WIZARD_COMMANDS,
  commandToInvocation,
  type WizardCommand,
} from "../wizard-commands.js";
import type { App } from "../wizard-ci/utils.js";

export function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Numbered single-select prompt over a small list of choices.
 * If there's only one choice, returns it without prompting.
 */
export async function promptChoice(
  question: string,
  choices: readonly string[],
): Promise<string | undefined> {
  if (choices.length === 0) return undefined;
  if (choices.length === 1) return choices[0];

  console.log(`${question}\n`);
  choices.forEach((c, i) => console.log(`  ${i + 1}) ${c}`));
  console.log();

  const selection = await prompt(`Enter number (1-${choices.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= choices.length) {
    console.error("Invalid selection");
    return undefined;
  }

  return choices[index];
}

export async function selectCommand(
  ciMode: boolean,
  e2eOnly = false,
): Promise<WizardCommand> {
  const base = ciMode
    ? WIZARD_COMMANDS.filter((c) => c.ciCapable)
    : WIZARD_COMMANDS;
  // Snapshots are auto-driven by an e2e.json flow definition, so that mode only
  // offers commands that have one. Interactive / headless runs are real wizard
  // runs — every command is available. Fall back to the full list if no e2e
  // flows resolve (e.g. WIZARD_PATH unset) so the picker never goes empty.
  const withE2e = base.filter((c) => c.hasE2e);
  const available = e2eOnly && withE2e.length > 0 ? withE2e : base;

  if (available.length === 0) {
    console.error("No wizard commands available for this mode.");
    process.exit(1);
  }

  console.log("Select a wizard command:\n");
  available.forEach((cmd, i) =>
    console.log(
      `  ${i + 1}) ${commandToInvocation(cmd.id).padEnd(28)} ${cmd.description}`,
    ),
  );
  console.log();

  const selection = await prompt(`Enter number (1-${available.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= available.length) {
    console.error("Invalid selection");
    process.exit(1);
  }

  return available[index];
}

export async function selectApp(apps: App[]): Promise<App> {
  console.log("Select an app:\n");
  apps.forEach((app, i) => console.log(`  ${i + 1}) ${app.name}`));
  console.log();

  const selection = await prompt(`Enter number (1-${apps.length}): `);
  const index = parseInt(selection, 10) - 1;

  if (index < 0 || index >= apps.length) {
    console.error("Invalid selection");
    process.exit(1);
  }

  return apps[index];
}
