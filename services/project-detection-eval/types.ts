export type EvaluationMode = "registry-crosscheck" | "simulated";
export type ConsumerProfile =
  | "registry-crosscheck"
  | "self-driving-integration"
  | "source-maps"
  | "headless-integration";
export type ExpectedOutcome =
  | "success"
  | "no-manifests"
  | "no-supported-project"
  | "fallback"
  | "detector-error";
export type CheckState =
  | "passed"
  | "failed"
  | "warning"
  | "skipped"
  | "blocked";

export type ProjectExpectation = {
  path: string;
  presence: "required" | "optional" | "forbidden";
  role?:
    | "workspace-root"
    | "client"
    | "server"
    | "library"
    | "docs"
    | "tooling";
  canonicalFramework?: string;
  acceptedLabels?: string[];
  targetId?: string | null;
  hasPostHog?: boolean;
};

export type RecommendationExpectation = {
  required: boolean;
  acceptablePaths: string[];
  forbiddenPaths?: string[];
  rationale: string;
};

export type ConsumerExpectation = {
  profile: ConsumerProfile;
  expectedOutcome: ExpectedOutcome;
  repoType?: "single" | "monorepo";
  projects?: ProjectExpectation[];
  recommendation?: RecommendationExpectation;
  selectedPath?: {
    acceptablePaths: string[];
    expectedStrategy:
      | "user-choice"
      | "recommended"
      | "first-instrumentable"
      | "none-fallback";
  };
};

export type DetectionCase = {
  schemaVersion: 1;
  id: string;
  description: string;
  provenance: {
    reason: string;
    issueUrls?: string[];
    prUrls?: string[];
    customerPattern?: string;
  };
  fixture: {
    kind: "synthetic" | "workbench-app" | "submodule";
    path: string;
    copyBeforeRun: boolean;
  };
  tiers: Array<"pr" | "nightly" | "experimental">;
  consumers: ConsumerExpectation[];
  tags: string[];
};

export type ToolCall = {
  tool: string;
  input: Record<string, unknown>;
  sequence: number;
};
export type DetectedProject = {
  path: string;
  framework?: string;
  targetId: string | null;
  hasPostHog: boolean;
  recommended?: boolean;
};
export type DetectionReport = {
  repoType: "single" | "monorepo";
  projects: DetectedProject[];
  selectedPath?: string | null;
  selectedStrategy?:
    | "user-choice"
    | "recommended"
    | "first-instrumentable"
    | "none-fallback";
};
export type DetectionRun = {
  mode: EvaluationMode;
  status: "completed" | "detector-error" | "infrastructure-error" | "timeout";
  report?: DetectionReport;
  toolCalls: ToolCall[];
  durationMs: number;
  error?: string;
};

export type Mismatch = {
  field:
    | "outcome"
    | "repoType"
    | "projectPresence"
    | "manifestGrounding"
    | "framework"
    | "targetId"
    | "hasPostHog"
    | "recommendation"
    | "selectedPath"
    | "selectedStrategy"
    | "toolPolicy"
    | "pathContainment"
    | "schema";
  severity: "critical" | "error" | "warning";
  projectPath?: string;
  expected: unknown;
  actual: unknown;
  message: string;
};

export type EvaluationResult = {
  caseId: string;
  attempt?: number;
  profile: ConsumerProfile;
  mode: EvaluationMode;
  status: "passed" | "failed" | "blocked";
  evidenceClass:
    | "Unit-proven"
    | "Mixed deterministic evidence"
    | "Recorded/replay-proven"
    | "Live agentic-proven"
    | "Human-reviewed"
    | "Inferred"
    | "Blocked"
    | "Unknown";
  fieldEvidence?: Record<string, string>;
  checks: Record<string, CheckState>;
  mismatches: Mismatch[];
  durationMs: number;
};
