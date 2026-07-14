import { posix, win32 } from "node:path";
import type { DetectionReport } from "../types.js";

export function normalizePath(value: string): string {
  const unix = value.replaceAll("\\", "/").replace(/^\.\//, "");
  if (
    posix.isAbsolute(unix) ||
    win32.isAbsolute(value) ||
    unix.split("/").includes("..")
  )
    throw new Error(`path escapes fixture: ${value}`);
  const normalized = posix.normalize(unix || ".");
  return normalized === "" ? "." : normalized;
}

export function normalizeReport(report: DetectionReport): DetectionReport {
  const seen = new Set<string>();
  const projects = report.projects
    .map((project) => ({ ...project, path: normalizePath(project.path) }))
    .sort((a, b) => a.path.localeCompare(b.path));
  for (const project of projects) {
    if (seen.has(project.path))
      throw new Error(`duplicate detected project path: ${project.path}`);
    seen.add(project.path);
  }
  return {
    ...report,
    projects,
    ...(report.selectedPath !== undefined
      ? {
          selectedPath:
            report.selectedPath === null
              ? null
              : normalizePath(report.selectedPath),
        }
      : {}),
  };
}
