import assert from "node:assert/strict";
import test from "node:test";
import { selectHeadlessProject } from "../compare/selection.js";

const api = {
  path: "apps/api",
  targetId: "javascript_node",
  hasPostHog: false,
};
const web = {
  path: "apps/web",
  targetId: "nextjs",
  hasPostHog: false,
  recommended: true,
};
test("recommended supported project wins", () =>
  assert.deepEqual(selectHeadlessProject([api, web]), {
    selectedPath: "apps/web",
    selectedStrategy: "recommended",
  }));
test("recommended project wins even with PostHog", () =>
  assert.equal(
    selectHeadlessProject([api, { ...web, hasPostHog: true }]).selectedPath,
    "apps/web"
  ));
test("unsupported recommendation falls back to first instrumentable", () =>
  assert.deepEqual(selectHeadlessProject([{ ...web, targetId: null }, api]), {
    selectedPath: "apps/api",
    selectedStrategy: "first-instrumentable",
  }));
test("no eligible project preserves original directory", () =>
  assert.deepEqual(selectHeadlessProject([{ ...api, hasPostHog: true }]), {
    selectedPath: null,
    selectedStrategy: "none-fallback",
  }));
