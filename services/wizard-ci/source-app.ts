import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface SourcePointer {
  sourceApp: string;
}

export function loadSourcePointer(appsDir: string, app: string): SourcePointer | null {
  const pointerFile = join(appsDir, app, ".wizard-ci", "source.json");
  let raw: string;
  try {
    raw = readFileSync(pointerFile, "utf8");
  } catch {
    return null;
  }
  const parsed = JSON.parse(raw) as Partial<SourcePointer>;
  if (typeof parsed.sourceApp !== "string" || parsed.sourceApp === "") {
    throw new Error(`apps/${app}/.wizard-ci/source.json needs a non-empty "sourceApp"`);
  }
  return { sourceApp: parsed.sourceApp };
}

export function resolveSourceApp(
  appsDir: string,
  app: string,
  expectSourceApp: string | undefined,
): string {
  return loadSourcePointer(appsDir, app)?.sourceApp ?? expectSourceApp ?? app;
}
