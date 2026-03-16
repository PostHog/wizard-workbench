/**
 * Unit tests for pr-evaluator pure functions
 *
 * Run: pnpm test:evaluator
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectFramework, detectArchType, parseCommandments, parseDocsConfig } from "./prompt-builder.js";
import {
  repairAndParseJSON,
  validateAndCorrectScores,
  computeScoreFromRubric,
  computeScoresFromRubric,
  injectScoresIntoComment,
  RubricSchema,
  type EvaluateScores,
  type RubricDimension,
  type RubricData,
} from "./evaluator.js";
import { truncateDiff, MAX_DIFF_CHARS, MAX_FILE_PATCH_CHARS } from "./git-local.js";
import type { PRData } from "../github/index.js";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makePRData(overrides: Partial<PRData> = {}): PRData {
  return {
    number: 0,
    title: "Test PR",
    description: "",
    author: "test",
    baseBranch: "main",
    headBranch: "feature",
    diff: "",
    files: [],
    ...overrides,
  };
}

function makeScores(overrides: Partial<EvaluateScores> = {}): EvaluateScores {
  return {
    file_analysis: 4,
    app_sanity: 4,
    posthog_implementation: 4,
    event_quality: 4,
    confidence: 4,
    framework: "nextjs",
    arch_type: "full-stack",
    ...overrides,
  };
}

// ── detectFramework ──────────────────────────────────────────────────────────

describe("detectFramework", () => {
  it("detects Python from .py files", () => {
    const pr = makePRData({
      files: [{ filename: "app/main.py", status: "added", additions: 10, deletions: 0 }],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("python"));
  });

  it("detects React from .tsx files", () => {
    const pr = makePRData({
      files: [{ filename: "src/App.tsx", status: "added", additions: 10, deletions: 0 }],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("react"));
  });

  it("detects Django from requirements.txt patch content", () => {
    const pr = makePRData({
      files: [
        {
          filename: "requirements.txt",
          status: "modified",
          additions: 1,
          deletions: 0,
          patch: "+django>=4.2\n+posthog>=3.0",
        },
      ],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("django"));
    assert.ok(tags.includes("python"));
  });

  it("does NOT detect Django from diff content mentioning django in comments", () => {
    const pr = makePRData({
      files: [
        { filename: "src/index.ts", status: "modified", additions: 5, deletions: 0 },
        { filename: "package.json", status: "modified", additions: 1, deletions: 0, patch: '+"posthog-js": "^1.0"' },
      ],
      diff: '// This is inspired by Django\'s ORM pattern\nconst orm = new ORM();',
    });
    const tags = detectFramework(pr);
    assert.ok(!tags.includes("django"), `Should not detect django, got: [${tags.join(", ")}]`);
  });

  it("detects Next.js from next.config file", () => {
    const pr = makePRData({
      files: [{ filename: "next.config.ts", status: "modified", additions: 5, deletions: 0 }],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("nextjs"));
    assert.ok(tags.includes("react"));
  });

  it("detects Node.js server from posthog-node in package.json", () => {
    const pr = makePRData({
      files: [
        {
          filename: "package.json",
          status: "modified",
          additions: 1,
          deletions: 0,
          patch: '+"posthog-node": "^4.0"',
        },
      ],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("javascript_node"));
  });

  it("detects FastAPI from pyproject.toml patch", () => {
    const pr = makePRData({
      files: [
        {
          filename: "pyproject.toml",
          status: "modified",
          additions: 2,
          deletions: 0,
          patch: '+fastapi = ">=0.100"\n+posthog = ">=3.0"',
        },
      ],
    });
    const tags = detectFramework(pr);
    assert.ok(tags.includes("fastapi"));
    assert.ok(tags.includes("python"));
  });

  it("returns empty array for unrecognized files", () => {
    const pr = makePRData({
      files: [{ filename: "README.md", status: "modified", additions: 1, deletions: 0 }],
    });
    const tags = detectFramework(pr);
    assert.deepEqual(tags, []);
  });
});

// ── detectArchType ───────────────────────────────────────────────────────────

describe("detectArchType", () => {
  it("returns server-only for Django", () => {
    assert.equal(detectArchType(["django", "python"]), "server-only");
  });

  it("returns client-only for React", () => {
    assert.equal(detectArchType(["react", "javascript_web"]), "client-only");
  });

  it("returns full-stack for Next.js", () => {
    assert.equal(detectArchType(["nextjs", "react"]), "full-stack");
  });

  it("returns full-stack when both server and client tags present", () => {
    assert.equal(detectArchType(["django", "react"]), "full-stack");
  });

  it("returns full-stack as default for empty tags", () => {
    assert.equal(detectArchType([]), "full-stack");
  });

  it("returns server-only for FastAPI", () => {
    assert.equal(detectArchType(["fastapi", "python"]), "server-only");
  });

  it("returns client-only for Swift", () => {
    assert.equal(detectArchType(["swift"]), "client-only");
  });

  it("returns full-stack for SvelteKit", () => {
    assert.equal(detectArchType(["sveltekit"]), "full-stack");
  });

  it("returns server-only for plain Python (no framework)", () => {
    assert.equal(detectArchType(["python"]), "server-only");
  });

  it("returns server-only for plain Ruby (no framework)", () => {
    assert.equal(detectArchType(["ruby"]), "server-only");
  });
});

// ── parseCommandments ────────────────────────────────────────────────────────

describe("parseCommandments", () => {
  it("parses a minimal YAML structure", () => {
    const yaml = `commandments:
  react:
    - Use usePostHog() hook
    - Never call posthog.init() in useEffect
  django:
    - Initialize in AppConfig.ready()`;
    const result = parseCommandments(yaml);
    assert.deepEqual(result["react"], ["Use usePostHog() hook", "Never call posthog.init() in useEffect"]);
    assert.deepEqual(result["django"], ["Initialize in AppConfig.ready()"]);
  });

  it("returns empty object for empty string", () => {
    assert.deepEqual(parseCommandments(""), {});
  });

  it("strips surrounding quotes from rules", () => {
    const yaml = `commandments:
  test:
    - "quoted rule"
    - 'single quoted'`;
    const result = parseCommandments(yaml);
    assert.deepEqual(result["test"], ["quoted rule", "single quoted"]);
  });
});

// ── repairAndParseJSON ───────────────────────────────────────────────────────

describe("repairAndParseJSON", () => {
  it("parses valid JSON", () => {
    const result = repairAndParseJSON('{"a": 1, "b": 2}');
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it("fixes trailing commas", () => {
    const result = repairAndParseJSON('{"a": 1, "b": 2,}');
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it("removes JS-style comments", () => {
    const result = repairAndParseJSON('{\n  "a": 1, // comment\n  "b": 2\n}');
    assert.deepEqual(result, { a: 1, b: 2 });
  });

  it("preserves // inside quoted strings (e.g. URLs)", () => {
    const result = repairAndParseJSON('{"host": "https://app.posthog.com"}');
    assert.deepEqual(result, { host: "https://app.posthog.com" });
  });

  it("throws on truly invalid JSON", () => {
    assert.throws(() => repairAndParseJSON("{not json at all}"));
  });
});

// ── validateAndCorrectScores ─────────────────────────────────────────────────

describe("validateAndCorrectScores", () => {
  it("passes through valid scores unchanged", () => {
    const scores = makeScores();
    const result = validateAndCorrectScores(scores);
    assert.deepEqual(result, scores);
  });

  it("clamps out-of-range scores", () => {
    const scores = makeScores({ file_analysis: 7, posthog_implementation: 0 });
    const result = validateAndCorrectScores(scores);
    assert.equal(result.file_analysis, 5);
    assert.equal(result.posthog_implementation, 1);
  });

  it("auto-corrects confidence per formula", () => {
    // avg(3, 5, 4, 4) = 4, min(5, 4) = 4
    const scores = makeScores({
      file_analysis: 3,
      app_sanity: 5,
      posthog_implementation: 4,
      event_quality: 4,
      confidence: 5, // wrong — should be 4
    });
    const result = validateAndCorrectScores(scores);
    assert.equal(result.confidence, 4);
  });

  it("confidence cannot exceed app_sanity", () => {
    // avg(5, 2, 5, 5) = 4.25 -> round = 4, min(2, 4) = 2
    const scores = makeScores({
      file_analysis: 5,
      app_sanity: 2,
      posthog_implementation: 5,
      event_quality: 5,
      confidence: 4, // wrong — should be 2
    });
    const result = validateAndCorrectScores(scores);
    assert.equal(result.confidence, 2);
  });

  it("defaults invalid arch_type to full-stack", () => {
    const scores = makeScores({ arch_type: "invalid" as any });
    const result = validateAndCorrectScores(scores);
    assert.equal(result.arch_type, "full-stack");
  });
});

// ── truncateDiff ─────────────────────────────────────────────────────────────

describe("truncateDiff", () => {
  it("returns short diffs unchanged", () => {
    const diff = "diff --git a/foo.ts b/foo.ts\n+hello";
    assert.equal(truncateDiff(diff), diff);
  });

  it("truncates diffs over MAX_DIFF_CHARS", () => {
    // Build a diff with multiple file sections that exceeds MAX_DIFF_CHARS
    const fileCount = 10;
    const perFile = Math.ceil((MAX_DIFF_CHARS + 1000) / fileCount);
    const sections = Array.from({ length: fileCount }, (_, i) =>
      `diff --git a/file${i}.ts b/file${i}.ts\n` + "x".repeat(perFile)
    );
    const diff = sections.join("\n");
    const result = truncateDiff(diff);
    assert.ok(result.includes("[diff truncated at 100k chars]") || result.includes("[patch truncated"));
    assert.ok(result.length < diff.length, "Result should be shorter than input");
  });

  it("truncates individual long file patches", () => {
    // Build a diff that's under MAX_DIFF_CHARS overall but has one huge file patch
    const longPatch = "diff --git a/big.ts b/big.ts\n" + "x".repeat(MAX_FILE_PATCH_CHARS + 5000);
    const shortPatch = "diff --git a/small.ts b/small.ts\n+ok";
    // Total must exceed MAX_DIFF_CHARS for truncateDiff to kick in
    const padding = "diff --git a/pad.ts b/pad.ts\n" + "y".repeat(MAX_DIFF_CHARS);
    const diff = longPatch + "\n" + shortPatch + "\n" + padding;
    const result = truncateDiff(diff);
    assert.ok(result.includes("[patch truncated"), "Should truncate the long individual patch");
  });
});

// ── computeScoreFromRubric ───────────────────────────────────────────────────

describe("computeScoreFromRubric", () => {
  it("returns 5 for all yes", () => {
    const dim: RubricDimension = { a: "yes", b: "yes", c: "yes", d: "yes", e: "yes" };
    assert.equal(computeScoreFromRubric(dim), 5);
  });

  it("returns 1 for all no", () => {
    const dim: RubricDimension = { a: "no", b: "no", c: "no" };
    assert.equal(computeScoreFromRubric(dim), 1);
  });

  it("returns 3 for all n/a (default)", () => {
    const dim: RubricDimension = { a: "n/a", b: "n/a" };
    assert.equal(computeScoreFromRubric(dim), 3);
  });

  it("excludes n/a from calculation", () => {
    // 3 yes out of 4 applicable = 75% -> round(0.75 * 5) = 4
    const dim: RubricDimension = { a: "yes", b: "yes", c: "yes", d: "no", e: "n/a" };
    assert.equal(computeScoreFromRubric(dim), 4);
  });

  it("computes correct score for 50% pass rate", () => {
    // 2 yes out of 4 = 50% -> round(0.5 * 5) = 3
    const dim: RubricDimension = { a: "yes", b: "yes", c: "no", d: "no" };
    assert.equal(computeScoreFromRubric(dim), 3);
  });

  it("computes correct score for 1 out of 5", () => {
    // 1/5 = 20% -> round(0.2 * 5) = 1
    const dim: RubricDimension = { a: "yes", b: "no", c: "no", d: "no", e: "no" };
    assert.equal(computeScoreFromRubric(dim), 1);
  });
});

// ── computeScoresFromRubric ──────────────────────────────────────────────────

describe("computeScoresFromRubric", () => {
  it("computes all scores and confidence from rubric", () => {
    const rubric: RubricData = {
      file_analysis: { fa_a: "yes", fa_b: "yes", fa_c: "yes", fa_d: "yes", fa_e: "yes", fa_f: "yes" }, // 6/6 = 5
      app_sanity: { as_a: "yes", as_b: "yes", as_c: "yes", as_d: "yes", as_e: "no", as_f: "no", as_g: "no" }, // 4/7 ~57% -> 3
      posthog_implementation: { ph_a: "yes", ph_b: "yes", ph_c: "yes", ph_d: "yes", ph_e: "yes", ph_f: "n/a", ph_g: "no", ph_h: "n/a" }, // 5/6 ~83% -> 4
      event_quality: { eq_a: "yes", eq_b: "yes", eq_c: "yes", eq_d: "yes", eq_e: "no" }, // 4/5 = 80% -> 4
    };
    const scores = computeScoresFromRubric(rubric, "django", "server-only");
    assert.equal(scores.file_analysis, 5);
    assert.equal(scores.app_sanity, 3);
    assert.equal(scores.posthog_implementation, 4);
    assert.equal(scores.event_quality, 4);
    // avg(5,3,4,4) = 4.0 -> round = 4, min(3, 4) = 3
    assert.equal(scores.confidence, 3);
    assert.equal(scores.framework, "django");
    assert.equal(scores.arch_type, "server-only");
  });
});

// ── RubricSchema validation ──────────────────────────────────────────────────

describe("RubricSchema", () => {
  it("validates a correct rubric", () => {
    const data = {
      file_analysis: { fa_a: "yes", fa_b: "no" },
      app_sanity: { as_a: "yes" },
      posthog_implementation: { ph_a: "n/a" },
      event_quality: { eq_a: "yes" },
    };
    const result = RubricSchema.safeParse(data);
    assert.ok(result.success);
  });

  it("rejects invalid rubric values", () => {
    const data = {
      file_analysis: { fa_a: "maybe" },
      app_sanity: { as_a: "yes" },
      posthog_implementation: { ph_a: "yes" },
      event_quality: { eq_a: "yes" },
    };
    const result = RubricSchema.safeParse(data);
    assert.ok(!result.success);
  });

  it("rejects missing dimensions", () => {
    const data = {
      file_analysis: { fa_a: "yes" },
      // missing app_sanity, posthog_implementation, event_quality
    };
    const result = RubricSchema.safeParse(data);
    assert.ok(!result.success);
  });
});

// ── injectScoresIntoComment ──────────────────────────────────────────────────

describe("injectScoresIntoComment", () => {
  const scores = makeScores({
    file_analysis: 3,
    app_sanity: 4,
    posthog_implementation: 5,
    event_quality: 4,
    confidence: 4,
    framework: "nextjs",
    arch_type: "full-stack",
  });

  const comment = [
    "### Confidence score: 2/5 \u274C",
    "",
    "Some review content",
    "",
    '<!-- SCORES\n{\n  "file_analysis": 0,\n  "app_sanity": 0,\n  "posthog_implementation": 0,\n  "event_quality": 0,\n  "confidence": 0,\n  "framework": "nextjs",\n  "arch_type": "full-stack"\n}\nSCORES -->',
  ].join("\n");

  it("replaces SCORES block 0s with computed values", () => {
    const result = injectScoresIntoComment(comment, scores);
    assert.ok(result.includes('"file_analysis": 3'));
    assert.ok(result.includes('"confidence": 4'));
    assert.ok(!result.includes('"file_analysis": 0'));
  });

  it("updates confidence header to match computed score", () => {
    const result = injectScoresIntoComment(comment, scores);
    assert.ok(result.includes("### Confidence score: 4/5"));
    assert.ok(!result.includes("### Confidence score: 2/5"));
  });

  it("returns comment unchanged if no SCORES block exists", () => {
    const plain = "### Confidence score: 3/5 \u{1F914}\n\nNo scores block here";
    const result = injectScoresIntoComment(plain, scores);
    // Confidence header should still be updated
    assert.ok(result.includes("### Confidence score: 4/5"));
    assert.ok(!result.includes("SCORES"));
  });

  it("returns comment unchanged if no confidence header exists", () => {
    const noHeader = '<!-- SCORES\n{\n  "file_analysis": 0\n}\nSCORES -->';
    const result = injectScoresIntoComment(noHeader, scores);
    assert.ok(result.includes('"file_analysis": 3'));
    assert.ok(!result.includes("Confidence score:"));
  });

  it("uses correct emoji for each confidence level", () => {
    for (const [level, emoji] of [[5, "\u{1F9D9}"], [4, "\u{1F44D}"], [3, "\u{1F914}"], [2, "\u274C"], [1, "\u274C"]] as [number, string][]) {
      const s = makeScores({ confidence: level });
      const result = injectScoresIntoComment(comment, s);
      assert.ok(result.includes(`${level}/5 ${emoji}`), `Expected emoji ${emoji} for confidence ${level}`);
    }
  });
});

// ── parseDocsConfig ──────────────────────────────────────────────────────────

describe("parseDocsConfig", () => {
  it("returns empty object for empty string", () => {
    assert.deepEqual(parseDocsConfig(""), {});
  });

  it("parses a single variant with tags and docs_urls", () => {
    const yaml = `variants:
  - id: nextjs
    tags: [nextjs, react]
    docs_urls:
      - https://posthog.com/docs/libraries/next-js
      - https://posthog.com/docs/libraries/react`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result["nextjs"], [
      "https://posthog.com/docs/libraries/next-js",
      "https://posthog.com/docs/libraries/react",
    ]);
    assert.deepEqual(result["react"], [
      "https://posthog.com/docs/libraries/next-js",
      "https://posthog.com/docs/libraries/react",
    ]);
  });

  it("includes shared_docs in every tag", () => {
    const yaml = `shared_docs:
      - https://posthog.com/docs/getting-started
      - https://posthog.com/docs/error-tracking
variants:
  - id: django
    tags: [django, python]
    docs_urls:
      - https://posthog.com/docs/libraries/django`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result["django"], [
      "https://posthog.com/docs/getting-started",
      "https://posthog.com/docs/error-tracking",
      "https://posthog.com/docs/libraries/django",
    ]);
    assert.deepEqual(result["python"], [
      "https://posthog.com/docs/getting-started",
      "https://posthog.com/docs/error-tracking",
      "https://posthog.com/docs/libraries/django",
    ]);
  });

  it("handles multiple variants", () => {
    const yaml = `variants:
  - id: django
    tags: [django]
    docs_urls:
      - https://posthog.com/docs/libraries/django
  - id: flask
    tags: [flask]
    docs_urls:
      - https://posthog.com/docs/libraries/flask`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result["django"], ["https://posthog.com/docs/libraries/django"]);
    assert.deepEqual(result["flask"], ["https://posthog.com/docs/libraries/flask"]);
  });

  it("skips variants with no tags", () => {
    const yaml = `variants:
  - id: mystery
    docs_urls:
      - https://posthog.com/docs/mystery`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result, {});
  });

  it("handles quoted tags", () => {
    const yaml = `variants:
  - id: rails
    tags: ['ruby-on-rails', "ruby"]
    docs_urls:
      - https://posthog.com/docs/libraries/ruby-on-rails`;
    const result = parseDocsConfig(yaml);
    assert.ok(result["ruby-on-rails"]);
    assert.ok(result["ruby"]);
  });

  it("handles variant with no docs_urls", () => {
    const yaml = `variants:
  - id: bare
    tags: [bare]`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result["bare"], []);
  });

  it("deduplicates URLs when shared_docs overlap with variant docs", () => {
    const yaml = `shared_docs:
      - https://posthog.com/docs/shared
variants:
  - id: test
    tags: [test]
    docs_urls:
      - https://posthog.com/docs/shared
      - https://posthog.com/docs/specific`;
    const result = parseDocsConfig(yaml);
    assert.deepEqual(result["test"], [
      "https://posthog.com/docs/shared",
      "https://posthog.com/docs/specific",
    ]);
  });
});
