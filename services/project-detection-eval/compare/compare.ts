import type {
  ConsumerExpectation,
  DetectionReport,
  Mismatch,
  ToolCall,
} from "../types.js";

const allowedTools = new Set(["Glob", "Read", "Grep"]);

export function compareToolPolicy(calls: ToolCall[]): Mismatch[] {
  return calls
    .filter((call) => !allowedTools.has(call.tool))
    .map((call) => ({
      field: "toolPolicy",
      severity: "critical",
      expected: "Glob, Read, or Grep",
      actual: call.tool,
      message: `forbidden model tool call at sequence ${call.sequence}: ${call.tool}`,
    }));
}

export function compareReport(
  expected: ConsumerExpectation,
  actual: DetectionReport
): Mismatch[] {
  const out: Mismatch[] = [];
  if (expected.repoType && expected.repoType !== actual.repoType)
    out.push({
      field: "repoType",
      severity: "error",
      expected: expected.repoType,
      actual: actual.repoType,
      message: "repository type differs",
    });
  const byPath = new Map(
    actual.projects.map((project) => [project.path, project])
  );
  for (const project of expected.projects ?? []) {
    const found = byPath.get(project.path);
    if (project.presence === "forbidden" && found)
      out.push({
        field: "projectPresence",
        severity: "critical",
        projectPath: project.path,
        expected: "absent",
        actual: "present",
        message: "forbidden project was detected",
      });
    if (project.presence === "required" && !found)
      out.push({
        field: "projectPresence",
        severity: "critical",
        projectPath: project.path,
        expected: "present",
        actual: "absent",
        message: "required project was not detected",
      });
    if (!found || project.presence === "forbidden") continue;
    if (project.targetId !== undefined && project.targetId !== found.targetId)
      out.push({
        field: "targetId",
        severity: "error",
        projectPath: project.path,
        expected: project.targetId,
        actual: found.targetId,
        message: "target ID differs",
      });
    if (
      project.hasPostHog !== undefined &&
      project.hasPostHog !== found.hasPostHog
    )
      out.push({
        field: "hasPostHog",
        severity: "critical",
        projectPath: project.path,
        expected: project.hasPostHog,
        actual: found.hasPostHog,
        message: "PostHog presence differs",
      });
    if (
      project.acceptedLabels?.length &&
      found.framework &&
      !project.acceptedLabels.includes(found.framework)
    )
      out.push({
        field: "framework",
        severity: "warning",
        projectPath: project.path,
        expected: project.acceptedLabels,
        actual: found.framework,
        message: "framework display label is not accepted",
      });
  }
  const recommended = actual.projects.filter((project) => project.recommended);
  if (recommended.length > 1)
    out.push({
      field: "recommendation",
      severity: "critical",
      expected: "at most one",
      actual: recommended.map((item) => item.path),
      message: "multiple projects were recommended",
    });
  if (expected.recommendation) {
    const path = recommended[0]?.path;
    if (expected.recommendation.required && !path)
      out.push({
        field: "recommendation",
        severity: "error",
        expected: expected.recommendation.acceptablePaths,
        actual: null,
        message: "required recommendation is absent",
      });
    if (path && !byPath.has(path))
      out.push({
        field: "recommendation",
        severity: "critical",
        expected: "detected project",
        actual: path,
        message: "recommendation is outside the detected project set",
      });
    if (path && expected.recommendation.forbiddenPaths?.includes(path))
      out.push({
        field: "recommendation",
        severity: "critical",
        expected: `not ${path}`,
        actual: path,
        message: "explicitly forbidden project was recommended",
      });
    if (path && !expected.recommendation.acceptablePaths.includes(path))
      out.push({
        field: "recommendation",
        severity: "error",
        expected: expected.recommendation.acceptablePaths,
        actual: path,
        message: "recommendation is not acceptable",
      });
  }
  if (expected.selectedPath) {
    if (
      !expected.selectedPath.acceptablePaths.includes(actual.selectedPath ?? "")
    )
      out.push({
        field: "selectedPath",
        severity: "critical",
        expected: expected.selectedPath.acceptablePaths,
        actual: actual.selectedPath,
        message: "consumer selected an unacceptable path",
      });
    if (actual.selectedPath && !byPath.has(actual.selectedPath))
      out.push({
        field: "pathContainment",
        severity: "critical",
        expected: "detected project path",
        actual: actual.selectedPath,
        message: "consumer selected a path outside the detected project set",
      });
    if (actual.selectedStrategy !== expected.selectedPath.expectedStrategy)
      out.push({
        field: "selectedStrategy",
        severity: "error",
        expected: expected.selectedPath.expectedStrategy,
        actual: actual.selectedStrategy,
        message: "selection strategy differs",
      });
  }
  return out;
}
