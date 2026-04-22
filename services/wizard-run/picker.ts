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

export async function selectCommand(ciMode: boolean): Promise<WizardCommand> {
  const available = ciMode
    ? WIZARD_COMMANDS.filter((c) => c.ciCapable)
    : WIZARD_COMMANDS;

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
