import assert from "node:assert/strict";
import test from "node:test";
import { join, resolve } from "node:path";
import { loadCases } from "../evaluator.js";
import {
  parseDetectionCase,
  parseDetectionReport,
  validateCatalog,
} from "../schema.js";

const service = resolve(import.meta.dirname, "..");
const valid = () => loadCases(join(service, "cases"))[0];

test("initial three-case catalog validates", () =>
  assert.equal(loadCases(join(service, "cases")).length, 3));
test("rejects unknown schema version", () =>
  assert.throws(() => parseDetectionCase({ ...valid(), schemaVersion: 2 })));
test("rejects path traversal", () =>
  assert.throws(() =>
    parseDetectionCase({
      ...valid(),
      fixture: { ...valid().fixture, path: "../escape" },
    })
  ));
test("rejects absolute paths", () =>
  assert.throws(() =>
    parseDetectionCase({
      ...valid(),
      fixture: { ...valid().fixture, path: "/escape" },
    })
  ));
test("rejects Windows absolute paths", () => {
  for (const path of ["C:\\\\escape", "\\\\\\\\server\\\\share"])
    assert.throws(() =>
      parseDetectionCase({ ...valid(), fixture: { ...valid().fixture, path } })
    );
});
test("rejects missing provenance reason", () =>
  assert.throws(() =>
    parseDetectionCase({ ...valid(), provenance: { reason: "" } })
  ));
test("rejects duplicate project paths", () => {
  const item = valid();
  const consumer = item.consumers[0];
  assert.throws(() =>
    parseDetectionCase({
      ...item,
      consumers: [
        {
          ...consumer,
          projects: [consumer.projects![0], consumer.projects![0]],
        },
      ],
    })
  );
});
test("rejects duplicate consumer profiles", () => {
  const item = valid();
  assert.throws(() =>
    parseDetectionCase({
      ...item,
      consumers: [item.consumers[0], item.consumers[0]],
    })
  );
});
test("rejects duplicate case IDs", () => {
  const item = valid();
  assert.throws(() => validateCatalog([item, item]));
});
test("validates detector reports before comparison", () => {
  assert.equal(
    parseDetectionReport({
      repoType: "single",
      projects: [{ path: ".", targetId: null, hasPostHog: false }],
    }).projects.length,
    1
  );
  assert.throws(() =>
    parseDetectionReport({
      repoType: "single",
      projects: [{ path: ".", targetId: null }],
    })
  );
  assert.throws(() =>
    parseDetectionReport({
      repoType: "single",
      projects: [],
      rawOutput: "not allowed",
    })
  );
});

test("rejects uncontained or control-character detector report paths", () => {
  for (const path of [
    "../escape",
    "/escape",
    "C:\\escape",
    "\\\\server\\share",
    "apps/web\nforged",
  ])
    assert.throws(() =>
      parseDetectionReport({
        repoType: "single",
        projects: [{ path, targetId: null, hasPostHog: false }],
      })
    );
});

test("rejects every constrained catalog enum and identifier", () => {
  const mutations: Array<(item: ReturnType<typeof valid>) => void> = [
    (item) => {
      item.id = "Not Valid";
    },
    (item) => {
      item.fixture.kind = "unknown" as never;
    },
    (item) => {
      item.tiers = ["unknown" as never];
    },
    (item) => {
      item.consumers[0].profile = "unknown" as never;
    },
    (item) => {
      item.consumers[0].expectedOutcome = "unknown" as never;
    },
    (item) => {
      item.consumers[0].projects![0].presence = "unknown" as never;
    },
    (item) => {
      item.consumers[0].projects![0].role = "unknown" as never;
    },
  ];
  for (const mutate of mutations) {
    const item = structuredClone(valid());
    mutate(item);
    assert.throws(() => parseDetectionCase(item));
  }
});

test("rejects empty required catalog collections and strings", () => {
  const mutations: Array<(item: ReturnType<typeof valid>) => void> = [
    (item) => {
      item.tiers = [];
    },
    (item) => {
      item.tags = [];
    },
    (item) => {
      item.tags = [""];
    },
    (item) => {
      item.consumers = [];
    },
    (item) => {
      item.consumers[0].projects![0].targetId = "";
    },
    (item) => {
      item.consumers[0].projects![0].acceptedLabels = [];
    },
  ];
  for (const mutate of mutations) {
    const item = structuredClone(valid());
    mutate(item);
    assert.throws(() => parseDetectionCase(item));
  }
});

test("rejects invalid recommendation and selection contracts", () => {
  const item = structuredClone(valid());
  item.consumers[0].recommendation = {
    required: true,
    acceptablePaths: [],
    rationale: "",
  };
  assert.throws(() => parseDetectionCase(item));
  item.consumers[0].recommendation = {
    required: true,
    acceptablePaths: ["../escape"],
    rationale: "reason",
  };
  assert.throws(() => parseDetectionCase(item));
  item.consumers[0].recommendation = undefined;
  item.consumers[0].selectedPath = {
    acceptablePaths: [],
    expectedStrategy: "recommended",
  };
  assert.throws(() => parseDetectionCase(item));
  item.consumers[0].selectedPath = {
    acceptablePaths: ["."],
    expectedStrategy: "unknown" as "recommended",
  };
  assert.throws(() => parseDetectionCase(item));
});

test("rejects unknown catalog fields", () => {
  assert.throws(() => parseDetectionCase({ ...valid(), unreviewed: true }));
});
