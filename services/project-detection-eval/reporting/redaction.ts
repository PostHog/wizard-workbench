import { homedir, tmpdir } from "node:os";
import { relative, resolve, sep } from "node:path";

const secret =
  /((?:phc|phx|pha)_[A-Za-z0-9_-]+|sk-[A-Za-z0-9_-]+|(?:Bearer|Basic)\s+[A-Za-z0-9._~+/-]+=*)/gi;

export function redactValue(value: unknown, fixtureRoot: string): unknown {
  if (typeof value === "string") {
    const absoluteRoot = resolve(fixtureRoot);
    const contained = value.startsWith(absoluteRoot + sep)
      ? relative(absoluteRoot, value).split(sep).join("/")
      : value;
    return contained
      .replaceAll(absoluteRoot, "[FIXTURE]")
      .replaceAll(homedir(), "[HOME]")
      .replaceAll(resolve(tmpdir()), "[TMP]")
      .replace(secret, "[REDACTED]");
  }
  if (Array.isArray(value))
    return value.map((item) => redactValue(item, fixtureRoot));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => {
        const sensitiveKey =
          /secret|authorization|api.?key/i.test(key) ||
          (/token/i.test(key) && typeof item === "string");
        return [
          key,
          sensitiveKey ? "[REDACTED]" : redactValue(item, fixtureRoot),
        ];
      })
    );
  return value;
}
