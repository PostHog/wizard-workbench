import type { DetectionReport, DetectedProject } from "../types.js";

function supported(project: DetectedProject): boolean {
  return project.targetId !== null;
}

export function selectHeadlessProject(
  projects: DetectedProject[]
): Pick<DetectionReport, "selectedPath" | "selectedStrategy"> {
  const recommended = projects.find(
    (project) => project.recommended && supported(project)
  );
  if (recommended)
    return { selectedPath: recommended.path, selectedStrategy: "recommended" };
  const instrumentable = projects.find(
    (project) => supported(project) && !project.hasPostHog
  );
  if (instrumentable)
    return {
      selectedPath: instrumentable.path,
      selectedStrategy: "first-instrumentable",
    };
  return { selectedPath: null, selectedStrategy: "none-fallback" };
}
