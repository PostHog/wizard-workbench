import { z } from "zod";
import { posix, win32 } from "node:path";
import type { DetectionCase, DetectionReport } from "./types.js";

const safeRelativePath = z
  .string()
  .min(1)
  .refine(
    (value) => !/[\u0000-\u001f\u007f]/.test(value),
    "path must not contain control characters"
  )
  .refine(
    (value) =>
      value === "." ||
      (!posix.isAbsolute(value.replaceAll("\\", "/")) &&
        !win32.isAbsolute(value) &&
        !value.split(/[\\/]/).includes("..")),
    "path must be fixture-relative and contained"
  );
const nonEmptyStrings = z.array(z.string().min(1)).min(1);

const project = z
  .object({
    path: safeRelativePath,
    presence: z.enum(["required", "optional", "forbidden"]),
    role: z
      .enum([
        "workspace-root",
        "client",
        "server",
        "library",
        "docs",
        "tooling",
      ])
      .optional(),
    canonicalFramework: z.string().min(1).optional(),
    acceptedLabels: nonEmptyStrings.optional(),
    targetId: z.string().min(1).nullable().optional(),
    hasPostHog: z.boolean().optional(),
  })
  .strict();

const recommendation = z
  .object({
    required: z.boolean(),
    acceptablePaths: z.array(safeRelativePath).min(1),
    forbiddenPaths: z.array(safeRelativePath).optional(),
    rationale: z.string().min(1),
  })
  .strict();

const consumer = z
  .object({
    profile: z.enum([
      "registry-crosscheck",
      "self-driving-integration",
      "source-maps",
      "headless-integration",
    ]),
    expectedOutcome: z.enum([
      "success",
      "no-manifests",
      "no-supported-project",
      "fallback",
      "detector-error",
    ]),
    repoType: z.enum(["single", "monorepo"]).optional(),
    projects: z.array(project).optional(),
    recommendation: recommendation.optional(),
    selectedPath: z
      .object({
        acceptablePaths: z.array(safeRelativePath).min(1),
        expectedStrategy: z.enum([
          "user-choice",
          "recommended",
          "first-instrumentable",
          "none-fallback",
        ]),
      })
      .strict()
      .optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const paths = value.projects?.map((item) => item.path) ?? [];
    for (const duplicate of paths.filter(
      (path, index) => paths.indexOf(path) !== index
    ))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate project path: ${duplicate}`,
        path: ["projects"],
      });
  });

export const detectionCaseSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
    description: z.string().min(1),
    provenance: z
      .object({
        reason: z.string().min(1),
        issueUrls: z.array(z.string().url()).optional(),
        prUrls: z.array(z.string().url()).optional(),
        customerPattern: z.string().min(1).optional(),
      })
      .strict(),
    fixture: z
      .object({
        kind: z.enum(["synthetic", "workbench-app", "submodule"]),
        path: safeRelativePath,
        copyBeforeRun: z.boolean(),
      })
      .strict(),
    tiers: z.array(z.enum(["pr", "nightly", "experimental"])).min(1),
    consumers: z.array(consumer).min(1),
    tags: nonEmptyStrings,
  })
  .strict()
  .superRefine((value, ctx) => {
    const profiles = value.consumers.map((item) => item.profile);
    for (const duplicate of profiles.filter(
      (profile, index) => profiles.indexOf(profile) !== index
    )) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate consumer profile: ${duplicate}`,
        path: ["consumers"],
      });
    }
  });

export const detectionReportSchema = z
  .object({
    repoType: z.enum(["single", "monorepo"]),
    projects: z.array(
      z
        .object({
          path: safeRelativePath,
          framework: z.string().min(1).optional(),
          targetId: z.string().min(1).nullable(),
          hasPostHog: z.boolean(),
          recommended: z.boolean().optional(),
        })
        .strict()
    ),
    selectedPath: safeRelativePath.nullable().optional(),
    selectedStrategy: z
      .enum([
        "user-choice",
        "recommended",
        "first-instrumentable",
        "none-fallback",
      ])
      .optional(),
  })
  .strict();

export function parseDetectionCase(value: unknown): DetectionCase {
  return detectionCaseSchema.parse(value) as DetectionCase;
}
export function parseDetectionReport(value: unknown): DetectionReport {
  return detectionReportSchema.parse(value) as DetectionReport;
}

export function validateCatalog(cases: DetectionCase[]): void {
  const ids = new Set<string>();
  for (const item of cases) {
    if (ids.has(item.id)) throw new Error(`duplicate case id: ${item.id}`);
    ids.add(item.id);
  }
}
